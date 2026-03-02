import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";
import {
  sendOrderConfirmation,
  sendArtisanNewOrderNotification,
} from "@/lib/email";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const { sessionId } = await req.json();

    if (!sessionId) {
      return NextResponse.json({ error: "Missing session ID" }, { status: 400 });
    }

    // Retrieve the Stripe session to verify payment
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (session.payment_status !== "paid") {
      return NextResponse.json(
        { error: "Payment not completed" },
        { status: 400 }
      );
    }

    const paymentIntent = session.payment_intent as string;

    // Check if order already exists (webhook might have already created it)
    const existingOrder = await prisma.order.findUnique({
      where: { paymentId: paymentIntent },
    });

    if (existingOrder) {
      // Order already created (by webhook), just return success
      return NextResponse.json({
        success: true,
        orderId: existingOrder.id,
        alreadyProcessed: true,
      });
    }

    // Webhook didn't create the order — do it now
    const userId = session.metadata?.userId;
    const cartItemsStr = session.metadata?.cartItems;

    if (!userId || !cartItemsStr) {
      return NextResponse.json({ error: "Missing metadata" }, { status: 400 });
    }

    const cartItems = JSON.parse(cartItemsStr);
    const totalAmount = (session.amount_total || 0) / 100;

    // Create order in transaction
    const order = await prisma.$transaction(
      async (tx) => {
        const newOrder = await tx.order.create({
          data: {
            customerId: userId,
            total: totalAmount,
            status: "Confirmed",
            paymentId: paymentIntent,
            paymentStatus: "paid",
            items: {
              create: cartItems.map((item: any) => ({
                productId: item.id,
                quantity: item.quantity,
                price: item.price,
              })),
            },
          },
        });

        for (const item of cartItems) {
          await tx.product.update({
            where: { id: item.id },
            data: {
              stock: { decrement: item.quantity },
              salesCount: { increment: item.quantity },
            },
          });
        }

        return newOrder;
      },
      { maxWait: 5000, timeout: 20000 }
    );

    console.log(`✅ Order ${order.id} created via verify-session for payment ${paymentIntent}`);

    // Send email notifications
    const orderWithDetails = await prisma.order.findUnique({
      where: { id: order.id },
      include: {
        items: { include: { product: { include: { artisan: true } } } },
        customer: true,
      },
    });

    if (orderWithDetails) {
      // Email to customer
      try {
        await sendOrderConfirmation({
          customerName: orderWithDetails.customer.name || "Valued Patron",
          customerEmail: orderWithDetails.customer.email,
          orderId: order.id,
          items: orderWithDetails.items.map((i) => ({
            title: i.product.title,
            quantity: i.quantity,
            price: i.price,
          })),
          total: totalAmount,
        });
        console.log(`📧 Order confirmation email sent to ${orderWithDetails.customer.email}`);
      } catch (emailErr) {
        console.error("Failed to send customer email:", emailErr);
      }

      // Email to each artisan
      const artisanGroups = new Map<
        string,
        { artisan: any; items: typeof orderWithDetails.items }
      >();
      for (const item of orderWithDetails.items) {
        const artisan = item.product.artisan;
        if (!artisanGroups.has(artisan.id)) {
          artisanGroups.set(artisan.id, { artisan, items: [] });
        }
        artisanGroups.get(artisan.id)!.items.push(item);
      }

      for (const [, group] of artisanGroups) {
        try {
          await sendArtisanNewOrderNotification({
            artisanName: group.artisan.name || "Artisan",
            artisanEmail: group.artisan.email,
            orderId: order.id,
            items: group.items.map((i) => ({
              title: i.product.title,
              quantity: i.quantity,
              price: i.price,
            })),
            customerName: orderWithDetails.customer.name || "A Patron",
          });
          console.log(`📧 Artisan notification sent to ${group.artisan.email}`);
        } catch (emailErr) {
          console.error(`Failed to send artisan email to ${group.artisan.email}:`, emailErr);
        }
      }
    }

    return NextResponse.json({
      success: true,
      orderId: order.id,
      alreadyProcessed: false,
    });
  } catch (error: any) {
    console.error("Verify session error:", error);
    return NextResponse.json(
      { error: error.message || "Verification failed" },
      { status: 500 }
    );
  }
}

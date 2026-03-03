import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";
import {
  sendOrderConfirmation,
  sendArtisanNewOrderNotification,
} from "@/lib/email";

// Disable body parsing — Stripe needs the raw body for signature verification
export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const body = await req.text();
  const signature = req.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json({ error: "No signature" }, { status: 400 });
  }

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err: any) {
    console.error("Webhook signature verification failed:", err.message);
    return NextResponse.json(
      { error: `Webhook Error: ${err.message}` },
      { status: 400 }
    );
  }

  // Handle the checkout.session.completed event
  if (event.type === "checkout.session.completed") {
    const session = event.data.object;

    try {
      const userId = session.metadata?.userId;
      const checkoutSessionId = session.metadata?.checkoutSessionId;

      if (!userId || !checkoutSessionId) {
        console.error("Missing metadata in Stripe session");
        return NextResponse.json({ error: "Missing metadata" }, { status: 400 });
      }

      // Load cart from DB (not from Stripe metadata)
      const checkoutData = await prisma.checkoutSession.findUnique({
        where: { id: checkoutSessionId },
      });

      if (!checkoutData || checkoutData.status === "completed") {
        console.error("Checkout session not found or already completed");
        return NextResponse.json({ error: "Invalid checkout session" }, { status: 400 });
      }

      const cartItems = checkoutData.cartItems as any[];
      const totalAmount = (session.amount_total || 0) / 100;

      // Create the order in a transaction
      const order = await prisma.$transaction(
        async (tx) => {
          //Create the Order
          const newOrder = await tx.order.create({
            data: {
              customerId: userId,
              total: totalAmount,
              status: "Confirmed",
              paymentId: session.payment_intent as string,
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

          // Decrease Stock & Increase Sales Count
          for (const item of cartItems) {
            await tx.product.update({
              where: { id: item.id },
              data: {
                stock: { decrement: item.quantity },
                salesCount: { increment: item.quantity },
              },
            });
          }

          //Mark checkout session as completed
          await tx.checkoutSession.update({
            where: { id: checkoutSessionId },
            data: { status: "completed" },
          });

          return newOrder;
        },
        { maxWait: 5000, timeout: 20000 }
      );

      console.log(`✅ Order ${order.id} created from Stripe payment ${session.payment_intent}`);

      //Send email notifications (must await on Vercel serverless!)
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
          console.log(`📧 Webhook: Order email sent to ${orderWithDetails.customer.email}`);
        } catch (emailErr) {
          console.error("Webhook: Failed to send customer email:", emailErr);
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
            console.log(`📧 Webhook: Artisan email sent to ${group.artisan.email}`);
          } catch (emailErr) {
            console.error(`Webhook: Failed to send artisan email:`, emailErr);
          }
        }
      }
    } catch (error) {
      console.error("Webhook order creation error:", error);
      return NextResponse.json(
        { error: "Order creation failed" },
        { status: 500 }
      );
    }
  }

  return NextResponse.json({ received: true });
}

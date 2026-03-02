import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { stripe } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({ where: { clerkId: userId } });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const { items, shipping } = await req.json();

    if (!items || items.length === 0) {
      return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
    }

    // Build Stripe line items from cart
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

    const lineItems = items.map((item: any) => {
      // Stripe requires absolute URLs for images
      let images: string[] = [];
      if (item.image) {
        const img = item.image as string;
        if (img.startsWith("http://") || img.startsWith("https://")) {
          images = [img];
        } else if (img.startsWith("/")) {
          images = [`${appUrl}${img}`];
        }
      }

      return {
        price_data: {
          currency: "inr",
          product_data: {
            name: item.title,
            images,
          },
          unit_amount: Math.round(item.price * 100), // Stripe uses paise (smallest unit)
        },
        quantity: item.quantity,
      };
    });

    // Add shipping as a line item if applicable
    if (shipping > 0) {
      lineItems.push({
        price_data: {
          currency: "inr",
          product_data: {
            name: "Shipping & Handling",
            images: [] as string[],
          },
          unit_amount: Math.round(shipping * 100),
        },
        quantity: 1,
      });
    }

    // Create Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      customer_email: user.email,
      line_items: lineItems,
      metadata: {
        userId: user.id,
        cartItems: JSON.stringify(
          items.map((item: any) => ({
            id: item.id,
            title: item.title,
            quantity: item.quantity,
            price: item.price,
          }))
        ),
      },
      success_url: `${appUrl}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${appUrl}/checkout`,
    });

    return NextResponse.json({ url: session.url });
  } catch (error: any) {
    console.error("Stripe checkout error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to create checkout session" },
      { status: 500 }
    );
  }
}

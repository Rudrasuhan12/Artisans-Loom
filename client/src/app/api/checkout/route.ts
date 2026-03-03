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

    //Fetch real prices from DB instead of trusting client
    const productIds = items.map((item: any) => item.id);
    const dbProducts = await prisma.product.findMany({
      where: { id: { in: productIds } },
      include: { auction: true },
    });

    // Validate all products exist
    if (dbProducts.length !== productIds.length) {
      const foundIds = new Set(dbProducts.map((p) => p.id));
      const missingIds = productIds.filter((id: string) => !foundIds.has(id));
      return NextResponse.json(
        { error: `Products not found: ${missingIds.join(", ")}` },
        { status: 400 }
      );
    }

    // Validate stock and check for active auctions
    for (const item of items) {
      const product = dbProducts.find((p) => p.id === item.id)!;

      // Stock check
      if (product.stock < item.quantity) {
        return NextResponse.json(
          {
            error: `"${product.title}" only has ${product.stock} in stock (requested ${item.quantity})`,
          },
          { status: 400 }
        );
      }

      // Auction collision check
      if (product.auction && product.auction.status === "ACTIVE") {
        return NextResponse.json(
          {
            error: `"${product.title}" is currently in an active auction and cannot be purchased directly`,
          },
          { status: 400 }
        );
      }
    }

    // Build Stripe line items using DB prices (NOT client prices)
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

    const lineItems = items.map((item: any) => {
      const product = dbProducts.find((p) => p.id === item.id)!;

      let images: string[] = [];
      if (product.images && product.images.length > 0) {
        const img = product.images[0];
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
            name: product.title,
            images,
          },
          unit_amount: Math.round(product.price * 100), // Use DB price, not client price
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

    //Save cart to DB instead of Stripe metadata (avoids 500-char limit)
    const checkoutSession = await prisma.checkoutSession.create({
      data: {
        userId: user.id,
        cartItems: items.map((item: any) => {
          const product = dbProducts.find((p) => p.id === item.id)!;
          return {
            id: product.id,
            title: product.title,
            quantity: item.quantity,
            price: product.price,
          };
        }),
        expiresAt: new Date(Date.now() + 30 * 60 * 1000),
      },
    });

    // Create Stripe Checkout Session with only the DB session ID in metadata
    const stripeSession = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      customer_email: user.email,
      line_items: lineItems,
      shipping_address_collection: {
        allowed_countries: ["IN"],
      },
      billing_address_collection: "required",
      metadata: {
        userId: user.id,
        checkoutSessionId: checkoutSession.id,
      },
      success_url: `${appUrl}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${appUrl}/checkout`,
    });

    // Link Stripe session ID back to our DB record
    await prisma.checkoutSession.update({
      where: { id: checkoutSession.id },
      data: { stripeSessionId: stripeSession.id },
    });

    return NextResponse.json({ url: stripeSession.url });
  } catch (error: any) {
    console.error("Stripe checkout error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to create checkout session" },
      { status: 500 }
    );
  }
}

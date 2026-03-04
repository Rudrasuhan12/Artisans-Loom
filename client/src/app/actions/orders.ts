"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { sendOrderConfirmation, sendArtisanNewOrderNotification } from "@/lib/email";

export async function createOrderAction(cartItems: any[], totalAmount: number) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const user = await prisma.user.findUnique({ where: { id: session.user.id } });
  if (!user) throw new Error("User not found");

  try {
    // Fetch real prices from DB to prevent client-side price tampering
    const productIds = cartItems.map((item) => item.id);
    const dbProducts = await prisma.product.findMany({
      where: { id: { in: productIds } },
      select: { id: true, title: true, price: true, stock: true },
    });

    const productMap = new Map(dbProducts.map((p) => [p.id, p]));

    // Validate all products exist and have sufficient stock
    for (const item of cartItems) {
      const dbProduct = productMap.get(item.id);
      if (!dbProduct) throw new Error(`Product not found: ${item.id}`);
      if (dbProduct.stock < item.quantity) {
        throw new Error(`"${dbProduct.title}" only has ${dbProduct.stock} in stock`);
      }
    }

    // Recalculate total from DB prices
    const verifiedTotal = cartItems.reduce((sum, item) => {
      const dbProduct = productMap.get(item.id)!;
      return sum + dbProduct.price * item.quantity;
    }, 0);

    const order = await prisma.$transaction(async (tx) => {
      
      // 1. Create the Order with DB-verified prices
      const newOrder = await tx.order.create({
        data: {
          customerId: user.id,
          total: verifiedTotal,
          status: "Confirmed",
          paymentStatus: "unpaid",
          items: {
            create: cartItems.map((item) => ({
              productId: item.id,
              quantity: item.quantity,
              price: productMap.get(item.id)!.price, // Use DB price
            }))
          }
        }
      });

      // 2. Decrease Stock & Increase Sales Count for EACH product
      for (const item of cartItems) {
        await tx.product.update({
          where: { id: item.id },
          data: {
            stock: { decrement: item.quantity },
            salesCount: { increment: item.quantity }
          }
        });
      }

      return newOrder;
    }, {
      maxWait: 5000, // Wait max 5s to start the transaction
      timeout: 20000 // Allow 20s for the transaction to finish (Fixes P2028)
    });

    // 3. Revalidate pages so data shows up immediately
    revalidatePath("/customer");
    revalidatePath("/customer/orders");
    revalidatePath("/artisan/dashboard");
    revalidatePath("/artisan/analytics");

    // 4. Send email notifications (non-blocking — don't await)
    const orderWithDetails = await prisma.order.findUnique({
      where: { id: order.id },
      include: {
        items: { include: { product: { include: { artisan: true } } } },
        customer: true,
      },
    });

    if (orderWithDetails) {
      // Email to customer
      sendOrderConfirmation({
        customerName: orderWithDetails.customer.name || "Valued Patron",
        customerEmail: orderWithDetails.customer.email,
        orderId: order.id,
        items: orderWithDetails.items.map((i) => ({
          title: i.product.title,
          quantity: i.quantity,
          price: i.price,
        })),
        total: verifiedTotal,
      });

      // Email to each artisan whose products were ordered
      const artisanGroups = new Map<string, { artisan: any; items: typeof orderWithDetails.items }>();
      for (const item of orderWithDetails.items) {
        const artisan = item.product.artisan;
        if (!artisanGroups.has(artisan.id)) {
          artisanGroups.set(artisan.id, { artisan, items: [] });
        }
        artisanGroups.get(artisan.id)!.items.push(item);
      }

      for (const [, group] of artisanGroups) {
        sendArtisanNewOrderNotification({
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
      }
    }

    return { success: true, orderId: order.id };

  } catch (error) {
    console.error("Order Creation Failed:", error);
    throw new Error("Failed to place order");
  }
}
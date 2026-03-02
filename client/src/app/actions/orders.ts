"use server";

import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { sendOrderConfirmation, sendArtisanNewOrderNotification } from "@/lib/email";

export async function createOrderAction(cartItems: any[], totalAmount: number) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const user = await prisma.user.findUnique({ where: { clerkId: userId } });
  if (!user) throw new Error("User not found");

  try {
    // --- FIX IS HERE ---
    // Added { maxWait: 5000, timeout: 20000 } as the second argument
    const order = await prisma.$transaction(async (tx) => {
      
      // 1. Create the Order
      const newOrder = await tx.order.create({
        data: {
          customerId: user.id,
          total: totalAmount,
          status: "Confirmed", // Initial status
          items: {
            create: cartItems.map((item) => ({
              productId: item.id,
              quantity: item.quantity,
              price: item.price
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
        total: totalAmount,
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
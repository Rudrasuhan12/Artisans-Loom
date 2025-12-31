"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { auth } from "@clerk/nextjs/server";

export async function placeBidAction(auctionId: string, amount: number) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const user = await prisma.user.findUnique({ where: { clerkId: userId } });
  if (!user) throw new Error("User not found");

  const auction = await prisma.auctionItem.findUnique({ where: { id: auctionId } });
  if (!auction) throw new Error("Auction not found");

  if (amount <= auction.currentBid) {
    throw new Error("Bid must be higher than current price");
  }

  await prisma.$transaction([
    prisma.bid.create({
      data: { amount, auctionId, userId: user.id }
    }),
    prisma.auctionItem.update({
      where: { id: auctionId },
      data: { currentBid: amount }
    })
  ]);

  revalidatePath(`/auction/${auctionId}`);
}

export async function checkAndResolveAuctionAction(auctionId: string) {
  const auction = await prisma.auctionItem.findUnique({
    where: { id: auctionId },
    include: { bids: { orderBy: { amount: 'desc' }, take: 1 }, product: true }
  });

  if (!auction || auction.status !== "ACTIVE") return auction;

  if (new Date() > new Date(auction.endTime)) {
    if (auction.bids.length === 0) {
      await prisma.auctionItem.update({
        where: { id: auctionId },
        data: { status: "UNSOLD" }
      });
      return { ...auction, status: "UNSOLD" };
    }

    const winner = auction.bids[0];
    
    await prisma.$transaction(async (tx) => {
      await tx.auctionItem.update({
        where: { id: auctionId },
        data: { status: "SOLD" }
      });

      await tx.order.create({
        data: {
          customerId: winner.userId,
          total: winner.amount,
          status: "Auction Won",
          items: {
            create: {
               productId: auction.product.id,
               quantity: 1,
               price: winner.amount
            }
          }
        }
      });
      
      await tx.product.update({
        where: { id: auction.product.id },
        data: { stock: 0, salesCount: { increment: 1 } }
      });
    });

    revalidatePath("/auction");
    revalidatePath("/customer");
    revalidatePath("/artisan");
  }
}

export async function startAuctionAction(formData: FormData) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const productId = formData.get("productId") as string;
  const basePrice = parseFloat(formData.get("basePrice") as string);
  const days = parseInt(formData.get("days") as string);

  const existingAuction = await prisma.auctionItem.findUnique({
    where: { productId }
  });

  if (existingAuction) {
    if (existingAuction.status === 'ACTIVE') {
      throw new Error("This masterpiece is already live in the Royal Vault.");
    }
    if (existingAuction.status === 'SOLD') {
      throw new Error("This masterpiece has already been sold via auction.");
    }
    if (existingAuction.status === 'UNSOLD') {
      throw new Error("This item was previously auctioned. Rare items cannot be re-listed to maintain exclusivity.");
    }
  }

  const endTime = new Date();
  endTime.setDate(endTime.getDate() + days);

  await prisma.auctionItem.create({
    data: {
      productId,
      basePrice,
      currentBid: basePrice,
      endTime,
      status: "ACTIVE",
    }
  });

  revalidatePath("/artisan/products");
  revalidatePath("/auction");
}
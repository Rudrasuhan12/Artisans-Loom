"use server";

import { prisma } from "@/lib/prisma";

export type TimeRange = "today" | "week" | "month" | "year" | "all";

export async function getTrendingProducts(range: TimeRange = "week", limit: number = 10) {
  let startDate = new Date();

  switch (range) {
    case "today":
      startDate.setHours(0, 0, 0, 0);
      break;
    case "week":
      startDate.setDate(startDate.getDate() - 7);
      break;
    case "month":
      startDate.setMonth(startDate.getMonth() - 1);
      break;
    case "year":
      startDate.setFullYear(startDate.getFullYear() - 1);
      break;
    case "all":
      startDate = new Date(0);
      break;
  }

  const topSales = await prisma.orderItem.groupBy({
    by: ["productId"],
    where: {
      order: {
        createdAt: {
          gte: startDate,
        },
      },
    },
    _sum: {
      quantity: true,
    },
    orderBy: {
      _sum: {
        quantity: "desc",
      },
    },
    take: limit,
  });

  if (topSales.length === 0) {
    const fallbackProducts = await prisma.product.findMany({
      orderBy: { salesCount: "desc" },
      take: limit,
      include: { artisan: { include: { profile: true } } },
    });
    return fallbackProducts;
  }

  const productIds = topSales.map((item) => item.productId);
  const products = await prisma.product.findMany({
    where: { id: { in: productIds } },
    include: { artisan: { include: { profile: true } } },
  });

  const sortedProducts = productIds
    .map((id) => products.find((p) => p.id === id))
    .filter((p) => p !== undefined);

  return sortedProducts;
}
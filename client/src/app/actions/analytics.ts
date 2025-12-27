"use server";

import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

export async function getAnalyticsData() {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const artisan = await prisma.user.findUnique({ where: { clerkId: userId } });
  if (!artisan) throw new Error("Artisan not found");

  const sales = await prisma.orderItem.findMany({
    where: { product: { artisanId: artisan.id } },
    select: {
      price: true,
      quantity: true,
      order: { select: { createdAt: true, customerId: true } }
    }
  });

  const totalRevenue = sales.reduce((acc: number, item: { price: number; quantity: number }) => 
    acc + (item.price * item.quantity), 0
  );

  const totalSold = sales.reduce((acc: number, item: { quantity: number }) => 
    acc + item.quantity, 0
  );

  const totalCustomers = new Set(sales.map((item: { order: { customerId: string } }) => item.order.customerId)).size;

  const chartMap = new Map();
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  months.forEach(m => chartMap.set(m, { name: m, total: 0, count: 0 }));

  sales.forEach((item: any) => {
    const date = new Date(item.order.createdAt);
    const month = months[date.getMonth()];
    const current = chartMap.get(month);
    
    chartMap.set(month, {
      name: month,
      total: current.total + (item.price * item.quantity),
      count: current.count + item.quantity
    });
  });

  return {
    totalRevenue,
    totalSold,
    totalCustomers,
    chartData: Array.from(chartMap.values())
  };
}
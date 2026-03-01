import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, Users, Package, ShoppingCart, DollarSign, BarChart3 } from "lucide-react";

export default async function AdminAnalyticsPage() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  const user = await prisma.user.findUnique({
    where: { clerkId: userId },
  });

  if (!user || user.role !== "ADMIN") {
    redirect("/");
  }

  // Fetch analytics data
  const [
    totalUsers,
    totalArtisans,
    totalCustomers,
    totalProducts,
    totalOrders,
    revenue
  ] = await Promise.all([
    prisma.user.count(),
    prisma.user.count({ where: { role: "ARTISAN" } }),
    prisma.user.count({ where: { role: "CUSTOMER" } }),
    prisma.product.count(),
    prisma.order.count(),
    prisma.order.aggregate({ _sum: { total: true } }),
  ]);

  const stats = [
    { name: "Total Users", value: totalUsers, icon: Users, color: "text-blue-600" },
    { name: "Artisans", value: totalArtisans, icon: Users, color: "text-amber-600" },
    { name: "Customers", value: totalCustomers, icon: Users, color: "text-emerald-600" },
    { name: "Products", value: totalProducts, icon: Package, color: "text-purple-600" },
    { name: "Orders", value: totalOrders, icon: ShoppingCart, color: "text-rose-600" },
    { name: "Revenue", value: `₹${(revenue._sum.total || 0).toLocaleString()}`, icon: DollarSign, color: "text-green-600" },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-serif font-bold text-[#4A3526]">Platform Analytics</h1>
        <p className="text-[#8C7B70] mt-1">Overview of platform performance and metrics.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {stats.map((stat) => (
          <Card key={stat.name} className="border-none shadow-md">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-[#8C7B70]">{stat.name}</p>
                  <p className="text-3xl font-bold text-[#4A3526] mt-1">{stat.value}</p>
                </div>
                <div className={`w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center`}>
                  <stat.icon className={`w-6 h-6 ${stat.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="border-none shadow-md">
        <CardHeader>
          <CardTitle className="text-xl font-serif text-[#4A3526] flex items-center gap-2">
            <BarChart3 className="w-5 h-5" />
            Growth Trends
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64 flex items-center justify-center text-[#8C7B70]">
            <div className="text-center">
              <TrendingUp className="w-16 h-16 mx-auto mb-4 text-[#D4AF37]/50" />
              <p>Detailed charts coming soon</p>
              <p className="text-sm">Analytics visualization will be added in the next update.</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

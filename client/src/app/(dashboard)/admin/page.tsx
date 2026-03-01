import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ShieldCheck, Users, Package, TrendingUp } from "lucide-react";
import Link from "next/link";

export default async function AdminDashboardPage() {
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

  // Fetch stats
  const [totalUsers, totalArtisans, totalProducts, pendingVerifications] = await Promise.all([
    prisma.user.count(),
    prisma.user.count({ where: { role: "ARTISAN" } }),
    prisma.product.count(),
    prisma.profile.count({ where: { verificationStatus: "pending" } }),
  ]);

  const stats = [
    { 
      name: "Total Users", 
      value: totalUsers, 
      icon: Users, 
      color: "text-blue-600",
      bgColor: "bg-blue-100"
    },
    { 
      name: "Artisans", 
      value: totalArtisans, 
      icon: Users, 
      color: "text-amber-600",
      bgColor: "bg-amber-100"
    },
    { 
      name: "Products", 
      value: totalProducts, 
      icon: Package, 
      color: "text-emerald-600",
      bgColor: "bg-emerald-100"
    },
    { 
      name: "Pending Verifications", 
      value: pendingVerifications, 
      icon: ShieldCheck, 
      color: "text-purple-600",
      bgColor: "bg-purple-100",
      href: "/admin/verification"
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-serif font-bold text-[#4A3526]">Admin Dashboard</h1>
        <p className="text-[#8C7B70] mt-1">Welcome back, Admin. Here's an overview of your platform.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const content = (
            <Card className={`border-none shadow-md hover:shadow-lg transition-shadow ${stat.href ? 'cursor-pointer' : ''}`}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-[#8C7B70]">{stat.name}</p>
                    <p className="text-3xl font-bold text-[#4A3526] mt-1">{stat.value}</p>
                  </div>
                  <div className={`w-12 h-12 rounded-full ${stat.bgColor} flex items-center justify-center`}>
                    <stat.icon className={`w-6 h-6 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          );

          return stat.href ? (
            <Link key={stat.name} href={stat.href}>
              {content}
            </Link>
          ) : (
            <div key={stat.name}>{content}</div>
          );
        })}
      </div>

      {/* Quick Actions */}
      <Card className="border-none shadow-md">
        <CardHeader>
          <CardTitle className="text-xl font-serif text-[#4A3526]">Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link 
              href="/admin/verification"
              className="flex items-center gap-4 p-4 rounded-xl bg-gradient-to-r from-emerald-50 to-emerald-100 hover:from-emerald-100 hover:to-emerald-200 transition-all"
            >
              <ShieldCheck className="w-8 h-8 text-emerald-600" />
              <div>
                <p className="font-semibold text-[#4A3526]">Review Verifications</p>
                <p className="text-sm text-[#8C7B70]">{pendingVerifications} pending</p>
              </div>
            </Link>
            
            <Link 
              href="/admin/users"
              className="flex items-center gap-4 p-4 rounded-xl bg-gradient-to-r from-blue-50 to-blue-100 hover:from-blue-100 hover:to-blue-200 transition-all"
            >
              <Users className="w-8 h-8 text-blue-600" />
              <div>
                <p className="font-semibold text-[#4A3526]">Manage Users</p>
                <p className="text-sm text-[#8C7B70]">{totalUsers} total users</p>
              </div>
            </Link>
            
            <Link 
              href="/admin/analytics"
              className="flex items-center gap-4 p-4 rounded-xl bg-gradient-to-r from-amber-50 to-amber-100 hover:from-amber-100 hover:to-amber-200 transition-all"
            >
              <TrendingUp className="w-8 h-8 text-amber-600" />
              <div>
                <p className="font-semibold text-[#4A3526]">View Analytics</p>
                <p className="text-sm text-[#8C7B70]">Platform insights</p>
              </div>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

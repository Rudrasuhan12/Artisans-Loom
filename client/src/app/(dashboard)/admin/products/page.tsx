import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Package, Search } from "lucide-react";
import AdminProductList from "@/components/dashboard/AdminProductList";

export default async function AdminProductsPage() {
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

  const products = await prisma.product.findMany({
    include: {
      artisan: {
        select: { id: true, name: true, email: true },
      },
      _count: {
        select: { orderItems: true },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  const categories = [...new Set(products.map((p) => p.category))].sort();

  const stats = {
    total: products.length,
    outOfStock: products.filter((p) => p.stock === 0).length,
    totalValue: products.reduce((sum, p) => sum + p.price * p.stock, 0),
    totalSold: products.reduce((sum, p) => sum + p.salesCount, 0),
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-serif font-bold text-[#4A3526]">
          Product Management
        </h1>
        <p className="text-[#8C7B70] mt-1">
          View, manage, and remove products across all artisans.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-none shadow-md">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center">
                <Package className="w-5 h-5 text-amber-700" />
              </div>
              <div>
                <p className="text-2xl font-bold text-[#4A3526]">{stats.total}</p>
                <p className="text-sm text-[#8C7B70]">Total Products</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-md">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
                <Package className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-[#4A3526]">{stats.outOfStock}</p>
                <p className="text-sm text-[#8C7B70]">Out of Stock</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-md">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center">
                <span className="text-emerald-700 font-bold">₹</span>
              </div>
              <div>
                <p className="text-2xl font-bold text-[#4A3526]">
                  ₹{stats.totalValue.toLocaleString("en-IN")}
                </p>
                <p className="text-sm text-[#8C7B70]">Inventory Value</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-md">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                <span className="text-blue-700 font-bold">#</span>
              </div>
              <div>
                <p className="text-2xl font-bold text-[#4A3526]">{stats.totalSold}</p>
                <p className="text-sm text-[#8C7B70]">Total Units Sold</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Products List — Client Component for search/filter/delete */}
      <AdminProductList
        products={JSON.parse(JSON.stringify(products))}
        categories={categories}
      />
    </div>
  );
}

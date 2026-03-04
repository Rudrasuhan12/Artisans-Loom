import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, ShieldCheck, Package, Calendar } from "lucide-react";

export default async function AdminUsersPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/sign-in");
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
  });

  if (!user || user.role !== "ADMIN") {
    redirect("/");
  }

  const users = await prisma.user.findMany({
    include: {
      profile: true,
      _count: { select: { products: true, orders: true } },
    },
    orderBy: { createdAt: "desc" },
    take: 50,
  });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-serif font-bold text-[#4A3526]">Manage Users</h1>
        <p className="text-[#8C7B70] mt-1">View and manage all platform users.</p>
      </div>

      <Card className="border-none shadow-md">
        <CardHeader>
          <CardTitle className="text-xl font-serif text-[#4A3526] flex items-center gap-2">
            <Users className="w-5 h-5" />
            All Users ({users.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {users.map((u) => (
              <div 
                key={u.id} 
                className="flex items-center justify-between p-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-amber-200 to-amber-400 flex items-center justify-center text-white font-bold text-lg">
                    {u.name?.charAt(0) || u.email?.charAt(0) || "U"}
                  </div>
                  <div>
                    <p className="font-semibold text-[#4A3526]">{u.name || "Unknown"}</p>
                    <p className="text-sm text-[#8C7B70]">{u.email}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  <Badge variant={u.role === "ADMIN" ? "default" : u.role === "ARTISAN" ? "secondary" : "outline"}>
                    {u.role}
                  </Badge>
                  
                  {u.profile?.isVerified && (
                    <ShieldCheck className="w-5 h-5 text-emerald-500" />
                  )}
                  
                  {u.role === "ARTISAN" && (
                    <div className="flex items-center gap-1 text-sm text-[#8C7B70]">
                      <Package className="w-4 h-4" />
                      {u._count.products} products
                    </div>
                  )}
                  
                  <div className="flex items-center gap-1 text-sm text-[#8C7B70]">
                    <Calendar className="w-4 h-4" />
                    {new Date(u.createdAt).toLocaleDateString()}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

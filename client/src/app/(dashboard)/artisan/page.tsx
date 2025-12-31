import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { Package, IndianRupee, ShoppingBag } from "lucide-react";
import { RoyalDivider } from "@/components/ui/royal-divider";
import Image from "next/image";
import { formatDistanceToNow } from "date-fns";
import OracleInsightWidget from "@/components/artisan/OracleInsightWidget"; 

export default async function ArtisanDashboardPage() {
  const { userId } = await auth();
  if (!userId) return null;

  const artisan = await prisma.user.findUnique({
    where: { clerkId: userId },
    include: { profile: true }
  });

  if (!artisan) return <div>Artisan not found</div>;

  const salesData = await prisma.orderItem.findMany({
    where: { product: { artisanId: artisan.id } },
    include: { order: { include: { customer: true } }, product: true },
    orderBy: { order: { createdAt: 'desc' } }
  });

  const productsCount = await prisma.product.count({ where: { artisanId: artisan.id } });
  const totalRevenue = salesData.reduce((acc: number, item: any) => acc + (item.price * item.quantity), 0);
  const totalSales = salesData.reduce((acc: number, item: any) => acc + item.quantity, 0);
  const uniqueCustomers = new Set(salesData.map((item: any) => item.order.customerId)).size;
  const recentOrders = salesData.slice(0, 5);

  return (
    <div className="space-y-12 pb-20">

      <div className="flex flex-col md:flex-row justify-between items-start gap-6">
        <div>
          <h1 className="text-4xl lg:text-5xl font-serif font-bold bg-clip-text text-transparent bg-linear-to-r from-[#B8860B] via-[#FFD700] to-[#B8860B] animate-shine">
            Namaste, {artisan.name?.split(" ")[0] || "Artisan"}!
          </h1>
          <p className="text-lg text-[#8C7B70] mt-2">
            Your studio's heart is beating strong.
          </p>
        </div>
        <OracleInsightWidget />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {[
          { title: "Total Revenue", value: `₹${totalRevenue.toLocaleString()}`, change: "Lifetime Earnings", icon: IndianRupee },
          { title: "Total Units Sold", value: totalSales, change: `${uniqueCustomers} Unique Customers`, icon: ShoppingBag },
          { title: "Active Products", value: productsCount, change: "In your inventory", icon: Package },
        ].map((stat, i) => (
          <div key={i} className="group relative rounded-2xl p-0.75 bg-linear-to-b from-[#F3E5AB] via-[#D4AF37] to-[#8B6508] shadow-lg hover:shadow-2xl transition-all hover:-translate-y-1">
            <div className="relative h-full bg-[#2C1810] rounded-[14px] p-6 text-white overflow-hidden">
               <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-5"></div>
               <div className="absolute top-0 left-0 w-32 h-32 bg-[#D4AF37]/5 rounded-full blur-2xl"></div>

               <div className="flex items-center justify-between text-sm font-medium text-[#8C7B70] mb-4">
                 {stat.title}
                 <stat.icon className="w-5 h-5 text-[#D4AF37]" />
               </div>
               <p className="text-4xl font-bold font-serif text-[#FDFBF7] drop-shadow-md">{stat.value}</p>
               <p className="text-sm text-green-500 mt-2 font-medium bg-green-500/10 inline-block px-2 py-0.5 rounded border border-green-500/20">{stat.change}</p>
            </div>
          </div>
        ))}
      </div>
      
      <div className="space-y-6">
         <div className="flex items-center justify-between">
            <h2 className="text-2xl font-serif font-bold text-[#4A3526]">Recent Activity</h2>
            <div className="h-px flex-1 bg-[#E5DCCA] ml-6"></div>
         </div>
         
         <div className="relative p-0.5 rounded-3xl bg-linear-to-b from-[#E5DCCA] to-transparent">
            <div className="relative bg-white rounded-[22px] border border-[#E5DCCA]/50 shadow-sm overflow-hidden">
              
              {recentOrders.length === 0 ? (
                <div className="p-20 text-center space-y-4">
                  <div className="w-20 h-20 bg-[#FDFBF7] rounded-full flex items-center justify-center mx-auto border-2 border-dashed border-[#E5DCCA]">
                    <ShoppingBag className="w-8 h-8 text-[#D4AF37]" />
                  </div>
                  <div className="text-[#8C7B70]">
                    <p className="font-serif text-xl font-bold text-[#4A3526]">Your Loom is Ready</p>
                    <p className="text-sm">Orders will appear here once customers discover your art.</p>
                  </div>
                </div>
              ) : (
                <div className="divide-y divide-[#E5DCCA]/30">
                  {recentOrders.map((item: any) => (
                    <div key={item.id} className="p-6 flex items-center justify-between hover:bg-[#FDFBF7] transition-colors group">
                       <div className="flex items-center gap-5">
                          <div className="w-16 h-16 rounded-xl border border-[#E5DCCA] relative overflow-hidden shadow-sm">
                             <Image 
                               src={item.product.images?.[0] || "/p1.png"} 
                               alt="Product" 
                               fill 
                               className="object-cover group-hover:scale-110 transition-transform duration-500" 
                             />
                          </div>
                          <div>
                             <h4 className="font-bold text-[#4A3526] text-base group-hover:text-[#D97742] transition-colors">{item.product.title}</h4>
                             <p className="text-xs text-[#8C7B70] mt-1">
                               Ordered by <span className="text-[#4A3526] font-bold">{item.order.customer.name || "Patron"}</span> • {formatDistanceToNow(new Date(item.order.createdAt))} ago
                             </p>
                          </div>
                       </div>
                       <div className="text-right">
                          <p className="font-serif font-bold text-lg text-[#D97742]">₹{item.price.toLocaleString()}</p>
                          <span className="text-[10px] bg-green-50 text-green-600 border border-green-200 px-3 py-1 rounded-full uppercase font-bold tracking-wider">
                            {item.order.status}
                          </span>
                       </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
         </div>
      </div>
    </div>
  );
}
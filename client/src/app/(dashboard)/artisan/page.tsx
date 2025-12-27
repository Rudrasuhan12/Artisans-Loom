import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { Package, IndianRupee, Users, ShoppingBag } from "lucide-react";
import { RoyalDivider } from "@/components/ui/royal-divider";
import Image from "next/image";
import { formatDistanceToNow } from "date-fns";

export default async function ArtisanDashboardPage() {
  const { userId } = await auth();
  if (!userId) return null;

  const artisan = await prisma.user.findUnique({
    where: { clerkId: userId },
    include: { profile: true }
  });

  if (!artisan) return <div>Artisan not found</div>;

  const salesData = await prisma.orderItem.findMany({
    where: {
      product: {
        artisanId: artisan.id
      }
    },
    include: {
      order: {
        include: { customer: true }
      },
      product: true
    },
    orderBy: { 
      order: {
        createdAt: 'desc' 
      }
    }
  });

  const productsCount = await prisma.product.count({
    where: { artisanId: artisan.id }
  });

  const totalRevenue = salesData.reduce((acc: number, item: any) => acc + (item.price * item.quantity), 0);
  const totalSales = salesData.reduce((acc: number, item: any) => acc + item.quantity, 0);
  const uniqueCustomers = new Set(salesData.map((item: any) => item.order.customerId)).size;

  const recentOrders = salesData.slice(0, 5);

  return (
    <div className="space-y-12">
      <div>
        <h1 className="text-4xl lg:text-5xl font-serif font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#B8860B] via-[#FFD700] to-[#B8860B] animate-shine">
          Welcome back, {artisan.name || "Master Artisan"}!
        </h1>
        <p className="text-lg text-[#8C7B70] mt-2">
          Here is a summary of your studio's performance.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {[
          { title: "Total Revenue", value: `₹${totalRevenue.toLocaleString()}`, change: "Lifetime Earnings", icon: IndianRupee },
          { title: "Total Units Sold", value: totalSales, change: `${uniqueCustomers} Unique Customers`, icon: ShoppingBag },
          { title: "Active Products", value: productsCount, change: "In your inventory", icon: Package },
        ].map((stat, i) => (
          <div key={i} className="group relative rounded-2xl p-[3px] bg-gradient-to-b from-[#F3E5AB] via-[#D4AF37] to-[#8B6508] shadow-lg hover:shadow-2xl transition-shadow">
            <div className="relative h-full bg-[#2C1810] rounded-[14px] p-6 text-white overflow-hidden">
               <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-5"></div>
               <div className="absolute top-0 left-0 w-32 h-32 bg-[#D4AF37]/5 rounded-full blur-2xl"></div>

               <div className="absolute top-3 left-3 w-4 h-4 border-t border-l border-[#D4AF37]/30"></div>
               <div className="absolute top-3 right-3 w-4 h-4 border-t border-r border-[#D4AF37]/30"></div>
               <div className="absolute bottom-3 left-3 w-4 h-4 border-b border-l border-[#D4AF37]/30"></div>
               <div className="absolute bottom-3 right-3 w-4 h-4 border-b border-r border-[#D4AF37]/30"></div>

               <div className="flex items-center justify-between text-sm font-medium text-[#8C7B70]">
                 {stat.title}
                 <stat.icon className="w-5 h-5 text-[#D4AF37]" />
               </div>
               <p className="mt-4 text-4xl font-bold font-serif text-[#FDFBF7] drop-shadow-md">{stat.value}</p>
               <p className="text-sm text-green-500 mt-2">{stat.change}</p>
            </div>
          </div>
        ))}
      </div>
      
      <div className="pt-8">
         <h2 className="text-2xl font-serif font-bold text-[#4A3526]">
           Recent Orders
         </h2>
         <div className="scale-75 -ml-12"><RoyalDivider /></div>

         <div className="relative p-[2px] rounded-xl bg-gradient-to-b from-[#F3E5AB]/50 to-transparent">
            <div className="relative bg-[#FFFBF5] rounded-[10px] border border-[#D4AF37]/20 shadow-inner overflow-hidden">
              
              {recentOrders.length === 0 ? (
                <div className="p-12 text-center text-[#8C7B70]">
                  <ShoppingBag className="w-16 h-16 mx-auto text-[#D4AF37]/40 mb-4" />
                  <p className="font-medium">No sales yet.</p>
                  <p className="text-sm">Your first order is just around the corner!</p>
                </div>
              ) : (
                <div className="divide-y divide-[#E5DCCA]">
                  {recentOrders.map((item: any) => (
                    <div key={item.id} className="p-6 flex items-center justify-between hover:bg-[#FFF5E1]/50 transition-colors">
                       <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-lg border border-[#E5DCCA] relative overflow-hidden">
                             <Image 
                               src={item.product.images?.[0] || "/p1.png"} 
                               alt="Product" 
                               fill 
                               className="object-cover" 
                             />
                          </div>
                          <div>
                             <h4 className="font-bold text-[#4A3526] text-sm">{item.product.title}</h4>
                             <p className="text-xs text-[#8C7B70]">
                               Bought by {item.order.customer.name || "Customer"} • {formatDistanceToNow(new Date(item.order.createdAt))} ago
                             </p>
                          </div>
                       </div>
                       <div className="text-right">
                          <p className="font-bold text-[#2F334F]">₹{item.price.toLocaleString()}</p>
                          <span className="text-[10px] bg-green-100 text-green-700 px-2 py-0.5 rounded-full uppercase font-bold tracking-wider">
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
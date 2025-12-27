import { auth, currentUser } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { IndianRupee, ShoppingBag, Clock, Package } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { getOrderStatus, STATUS_COLORS } from "@/utils/orderStatus";
import { format } from "date-fns";

export default async function CustomerDashboard() {
  const { userId } = await auth();
  const clerkUser = await currentUser();

  if (!userId || !clerkUser) return null;

  const user = await prisma.user.findUnique({
    where: { clerkId: userId },
    include: { 
      orders: { 
        include: { items: { include: { product: true } } },
        orderBy: { createdAt: 'desc' }
      } 
    }
  });

  if (!user) return <div>User not found</div>;

  const totalSpent = user.orders.reduce((acc, order) => acc + order.total, 0);
  const totalOrders = user.orders.length;
  
  const lastActiveDate = clerkUser.lastSignInAt 
    ? format(new Date(clerkUser.lastSignInAt), "MMM dd, yyyy • h:mm a") 
    : "Just now";

  const activeOrders = user.orders.filter(order => {
    const { status } = getOrderStatus(order.createdAt);
    return status !== "Delivered";
  });

  return (
    <div className="space-y-12">
      
      <div>
        <h1 className="text-4xl lg:text-5xl font-serif font-bold text-[#4A3526]">
          Namaste, {user.name?.split(" ")[0]}!
        </h1>
        <p className="text-lg text-[#8C7B70] mt-2">
          Track your treasures and discover new heritage.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        <div className="bg-[#FFFBF5] rounded-2xl p-6 border border-[#E5DCCA] shadow-md flex items-center justify-between">
           <div>
              <p className="text-xs font-bold text-[#8C7B70] uppercase tracking-wider mb-1">Total Spent</p>
              <p className="text-3xl font-serif font-bold text-[#D97742]">₹{totalSpent.toLocaleString()}</p>
           </div>
           <div className="p-4 bg-[#FFF5E1] rounded-full text-[#D97742] border border-[#D4AF37]/20">
              <IndianRupee className="w-6 h-6" />
           </div>
        </div>

        <div className="bg-[#FFFBF5] rounded-2xl p-6 border border-[#E5DCCA] shadow-md flex items-center justify-between">
           <div>
              <p className="text-xs font-bold text-[#8C7B70] uppercase tracking-wider mb-1">Orders Placed</p>
              <p className="text-3xl font-serif font-bold text-[#2F334F]">{totalOrders}</p>
           </div>
           <div className="p-4 bg-[#E0E7FF] rounded-full text-[#2F334F] border border-[#2F334F]/20">
              <ShoppingBag className="w-6 h-6" />
           </div>
        </div>

        <div className="bg-[#FFFBF5] rounded-2xl p-6 border border-[#E5DCCA] shadow-md flex items-center justify-between">
           <div>
              <p className="text-xs font-bold text-[#8C7B70] uppercase tracking-wider mb-1">Last Active</p>
              <p className="text-lg font-serif font-bold text-[#4A3526] leading-tight">
                {lastActiveDate}
              </p>
           </div>
           <div className="p-4 bg-[#F3E5AB] rounded-full text-[#4A3526] border border-[#4A3526]/20">
              <Clock className="w-6 h-6" />
           </div>
        </div>

      </div>

      <div className="pt-8">
         <div className="flex items-center gap-3 mb-6">
            <h2 className="text-2xl font-serif font-bold text-[#4A3526]">Active Shipments</h2>
            <span className="px-3 py-1 bg-[#D97742] text-white text-xs font-bold rounded-full">
              {activeOrders.length} In Transit
            </span>
         </div>

         <div className="space-y-4">
            {activeOrders.length === 0 ? (
               <div className="p-12 text-center bg-white rounded-4xl border border-dashed border-[#E5DCCA]">
                  <Package className="w-12 h-12 text-[#E5DCCA] mx-auto mb-4" />
                  <p className="text-[#8C7B70] font-medium">No active shipments.</p>
                  <p className="text-sm text-[#8C7B70]/60">All previous orders have been delivered.</p>
                  <Link href="/shop" className="text-[#D97742] font-bold hover:underline mt-4 inline-block">
                    Explore New Crafts →
                  </Link>
               </div>
            ) : (
               activeOrders.map((order) => {
                 const { status } = getOrderStatus(order.createdAt);
                 return (
                  <div key={order.id} className="bg-white p-6 rounded-2xl border border-[#E5DCCA] shadow-sm hover:shadow-md transition-all">
                     <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-[#E5DCCA] pb-4 mb-4 gap-4">
                        <div>
                           <p className="text-xs text-[#8C7B70] font-bold uppercase tracking-wider">Order ID</p>
                           <p className="text-[#4A3526] font-mono font-bold">#{order.id.slice(-6).toUpperCase()}</p>
                        </div>
                        <div className="text-right">
                           <p className="text-xs text-[#8C7B70] font-bold uppercase tracking-wider">Status</p>
                           <span className={`inline-block px-3 py-1 mt-1 rounded-full text-xs font-bold border ${STATUS_COLORS[status]}`}>
                              {status}
                           </span>
                        </div>
                     </div>
                     
                     <div className="flex gap-4 overflow-x-auto pb-2 custom-scrollbar">
                        {order.items.map((item) => (
                           <div key={item.id} className="relative w-20 h-20 rounded-xl border border-[#E5DCCA] overflow-hidden shrink-0 group">
                              <Image 
                                src={item.product.images[0] || "/p1.png"} 
                                alt={item.product.title} 
                                fill 
                                className="object-cover" 
                              />
                              <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white text-[10px] text-center py-1 truncate px-1">
                                {item.product.title}
                              </div>
                           </div>
                        ))}
                     </div>
                  </div>
               )})
            )}
         </div>
      </div>

    </div>
  );
}
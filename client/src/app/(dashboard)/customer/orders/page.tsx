import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import Image from "next/image";
import { RoyalDivider } from "@/components/ui/royal-divider";
import { getOrderStatus, STATUS_COLORS } from "@/utils/orderStatus";
import { format } from "date-fns";
import { Crown } from "lucide-react";

export default async function MyOrdersPage() {
  const { userId } = await auth();
  if (!userId) return null;

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

  return (
    <div className="space-y-8 min-h-screen pb-20">
      
      <div>
        <h1 className="text-4xl font-serif font-bold text-[#4A3526]">My Treasures</h1>
        <p className="text-[#8C7B70] mt-2">Track the journey of your handcrafted items.</p>
      </div>
      <div className="scale-100 opacity-60"><RoyalDivider /></div>

      <div className="space-y-6">
        {user.orders.length === 0 ? (
           <div className="p-10 text-center bg-white rounded-2xl border border-dashed border-[#E5DCCA]">
              <p className="text-[#8C7B70]">You haven't ordered anything yet.</p>
           </div>
        ) : (
          user.orders.map((order) => {
            const { status, progress } = getOrderStatus(order.createdAt, order.status);
            
            return (
              <div key={order.id} className={`group relative rounded-2xl p-0.5 shadow-md hover:shadow-xl transition-all ${status === "Auction Won" ? "bg-linear-to-r from-[#D4AF37] via-[#F3E5AB] to-[#D4AF37]" : "bg-linear-to-r from-[#F3E5AB] via-[#D4AF37]/40 to-[#F3E5AB]"}`}>
                <div className="bg-white rounded-[14px] p-6">
                   
                   <div className="flex flex-col md:flex-row justify-between md:items-center mb-6 pb-4 border-b border-[#E5DCCA] gap-4">
                      <div>
                         <p className="text-xs font-bold text-[#8C7B70] uppercase tracking-wider">Order ID</p>
                         <div className="flex items-center gap-2">
                           <p className="text-[#4A3526] font-mono font-bold">#{order.id.slice(-8).toUpperCase()}</p>
                           {/* Show Crown if Auction */}
                           {status === "Auction Won" && <Crown className="w-4 h-4 text-[#D4AF37] fill-[#D4AF37]" />}
                         </div>
                         <p className="text-xs text-[#8C7B70] mt-1">Ordered on {format(new Date(order.createdAt), "PPP")}</p>
                      </div>
                      
                      <div className="flex items-center gap-4">
                         <div className="text-right">
                            <p className="text-xs font-bold text-[#8C7B70] uppercase tracking-wider">Status</p>
                            <span className={`inline-block px-3 py-1 mt-1 rounded-full text-xs font-bold border ${STATUS_COLORS[status] || STATUS_COLORS["Pending"]}`}>
                               {status}
                            </span>
                         </div>
                         <div className="text-right">
                            <p className="text-xs font-bold text-[#8C7B70] uppercase tracking-wider">Total</p>
                            <p className="text-xl font-bold text-[#D97742] font-serif">₹{order.total.toLocaleString()}</p>
                         </div>
                      </div>
                   </div>

                   <div className="space-y-4">
                      {order.items.map((item) => (
                         <div key={item.id} className="flex gap-4 items-center">
                            <div className="relative w-16 h-16 rounded-lg border border-[#E5DCCA] overflow-hidden shrink-0">
                               <Image src={item.product.images[0] || "/p1.png"} alt={item.product.title} fill className="object-cover" />
                            </div>
                            <div className="flex-1">
                               <h4 className="font-bold text-[#4A3526] line-clamp-1">{item.product.title}</h4>
                               <p className="text-sm text-[#8C7B70]">Qty: {item.quantity} × ₹{item.price.toLocaleString()}</p>
                            </div>
                         </div>
                      ))}
                   </div>

                   <div className="mt-8">
                      <div className="h-2 w-full bg-[#F3E5AB]/30 rounded-full overflow-hidden">
                         <div 
                           className={`h-full transition-all duration-1000 ${status === "Auction Won" ? "bg-[#D4AF37]" : "bg-linear-to-r from-[#D4AF37] to-[#8B6508]"}`}
                           style={{ width: `${progress}%` }}
                         />
                      </div>
                      <div className="flex justify-between mt-2 text-[10px] text-[#8C7B70] font-bold uppercase">
                         {status === "Auction Won" ? (
                           <span className="w-full text-center text-[#D4AF37]">Auction Won - Preparing for Royal Dispatch</span>
                         ) : (
                           <>
                             <span>Confirmed</span>
                             <span>Shipped</span>
                             <span>Out for Delivery</span>
                             <span>Delivered</span>
                           </>
                         )}
                      </div>
                   </div>

                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
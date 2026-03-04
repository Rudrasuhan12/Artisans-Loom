import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Image from "next/image";
import { Package, Calendar, ChevronRight, ShoppingBag } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import BackButton from "@/components/ui/BackButton";

export default async function ArtisanPurchaseHistory() {
  const session = await auth();
  if (!session?.user?.id) redirect("/sign-in");

  // Fetch orders placed BY this artisan (acting as a customer)
  const orders = await prisma.order.findMany({
    where: {
      customer: {
        id: session.user.id,
      },
    },
    include: {
      items: {
        include: {
          product: true, 
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <div className="p-6 md:p-10 space-y-8">
      <BackButton position="top-left" fallbackUrl="/artisan" />
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-serif font-bold text-[#4A3526]">My Purchases</h1>
          <p className="text-[#8C7B70]">A history of the handcrafted treasures you have bought.</p>
        </div>
        <Link href="/shop">
          <Button className="bg-[#2F334F] hover:bg-[#1E2135] text-white rounded-xl gap-2">
            <ShoppingBag className="w-4 h-4" /> Browse Shop
          </Button>
        </Link>
      </div>

      {orders.length === 0 ? (
        <div className="bg-white rounded-[2rem] p-16 text-center border border-[#E5DCCA] shadow-sm">
          <div className="w-20 h-20 bg-[#FDFBF7] rounded-full flex items-center justify-center mx-auto mb-6">
            <Package className="w-10 h-10 text-[#E5DCCA]" />
          </div>
          <h3 className="text-xl font-serif font-bold text-[#4A3526] mb-2">No purchases yet</h3>
          <p className="text-[#8C7B70] mb-8">You haven't ordered anything from the Loom yet.</p>
          <Link href="/shop">
            <Button variant="outline" className="border-[#D4AF37] text-[#D4AF37] hover:bg-[#D4AF37]/5 rounded-xl">
              Start Shopping
            </Button>
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div key={order.id} className="bg-white rounded-3xl border border-[#E5DCCA] shadow-sm overflow-hidden">
              <div className="bg-[#FDFBF7] px-8 py-4 border-b border-[#E5DCCA] flex flex-wrap justify-between items-center gap-4">
                <div className="flex gap-8">
                  <div>
                    <p className="text-[10px] uppercase tracking-widest font-bold text-[#8C7B70] mb-1">Date Placed</p>
                    <div className="flex items-center gap-1 text-sm font-bold text-[#4A3526]">
                      <Calendar className="w-3.5 h-3.5 text-[#D4AF37]" />
                      {new Date(order.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-widest font-bold text-[#8C7B70] mb-1">Total Paid</p>
                    <p className="text-sm font-bold text-[#D97742]">₹{order.total.toLocaleString()}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="px-3 py-1 bg-green-50 text-green-600 text-[10px] font-bold rounded-full border border-green-100 uppercase">
                    {order.status}
                  </span>
                  <p className="text-[10px] text-[#8C7B70] font-mono tracking-tighter">#{order.id.slice(-8).toUpperCase()}</p>
                </div>
              </div>

              <div className="p-8 space-y-6">
                {order.items.map((item) => (
                  <div key={item.id} className="flex items-center gap-6 group">
                    <div className="relative w-16 h-16 rounded-xl overflow-hidden border border-[#E5DCCA] flex-shrink-0">
                      <Image 
                        src={item.product.images[0] || "/p1.png"} 
                        alt={item.product.title} 
                        fill 
                        className="object-cover group-hover:scale-110 transition-transform duration-500" 
                      />
                    </div>
                    <div className="flex-grow">
                      <h3 className="font-bold text-[#4A3526] text-sm">{item.product.title}</h3>
                      <div className="flex items-center gap-4 mt-0.5">
                        <p className="text-xs text-[#8C7B70]">Quantity: <span className="text-[#4A3526] font-bold">{item.quantity}</span></p>
                        <p className="text-xs text-[#8C7B70]">Price: <span className="text-[#4A3526] font-bold">₹{item.price.toLocaleString()}</span></p>
                      </div>
                    </div>
                    <Link href={`/shop/${item.productId}`}>
                      <Button variant="ghost" size="sm" className="rounded-full hover:bg-[#FDFBF7] text-[#D4AF37] text-xs font-bold">
                        Details <ChevronRight className="w-3.5 h-3.5 ml-1" />
                      </Button>
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
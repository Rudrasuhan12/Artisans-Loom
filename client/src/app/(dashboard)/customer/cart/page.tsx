"use client";

import { useCartStore } from "@/store/useCartStore";
import { Button } from "@/components/ui/button";
import { RoyalDivider } from "@/components/ui/royal-divider";
import { Minus, Plus, Trash2, ShoppingCart, ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function MyCartPage() {
  const { items, updateQuantity, removeFromCart } = useCartStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  const subtotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0);

  return (
    <div className="space-y-8 min-h-screen pb-20">
      
      <div>
        <h1 className="text-4xl font-serif font-bold text-[#4A3526]">My Cart</h1>
        <p className="text-[#8C7B70] mt-2">Review your selected masterpieces before checkout.</p>
      </div>
      <div className="scale-100 opacity-60"><RoyalDivider /></div>

      {items.length === 0 ? (
         <div className="flex flex-col items-center justify-center py-20 bg-white rounded-4xl border border-dashed border-[#E5DCCA]">
            <ShoppingCart className="w-16 h-16 text-[#E5DCCA] mb-4" />
            <h3 className="text-xl font-bold text-[#4A3526]">Your cart is empty</h3>
            <Link href="/shop" className="mt-4">
               <Button className="bg-[#2F334F] text-[#D4AF37] hover:bg-[#1E2135]">Browse Collection</Button>
            </Link>
         </div>
      ) : (
         <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

            <div className="lg:col-span-2 space-y-4">
               {items.map((item) => (
                  <div key={item.id} className="flex gap-4 bg-white p-4 rounded-2xl border border-[#E5DCCA] shadow-sm hover:shadow-md transition-all">
                     <div className="relative w-24 h-24 rounded-xl overflow-hidden border border-[#E5DCCA] shrink-0">
                        <Image src={item.image} alt={item.title} fill className="object-cover" />
                     </div>
                     <div className="flex-1 flex flex-col justify-between">
                        <div className="flex justify-between items-start">
                           <h3 className="font-bold text-[#4A3526] line-clamp-1">{item.title}</h3>
                           <button onClick={() => removeFromCart(item.id)} className="text-[#8C7B70] hover:text-red-500">
                              <Trash2 className="w-5 h-5" />
                           </button>
                        </div>
                        <div className="flex justify-between items-end">
                           <p className="text-xl font-serif font-bold text-[#D97742]">₹{item.price}</p>
                           <div className="flex items-center border border-[#E5DCCA] rounded-lg bg-[#FDFBF7]">
                              <button onClick={() => updateQuantity(item.id, -1)} className="p-2 hover:text-[#D97742]"><Minus className="w-4 h-4" /></button>
                              <span className="w-8 text-center font-bold text-sm">{item.quantity}</span>
                              <button onClick={() => updateQuantity(item.id, 1)} className="p-2 hover:text-[#D97742]"><Plus className="w-4 h-4" /></button>
                           </div>
                        </div>
                     </div>
                  </div>
               ))}
            </div>

            <div className="h-fit bg-white p-8 rounded-4xl border border-[#E5DCCA] shadow-lg sticky top-8">
               <h3 className="text-xl font-bold text-[#4A3526] mb-6 font-serif">Order Summary</h3>
               <div className="space-y-4 mb-6 text-sm">
                  <div className="flex justify-between text-[#5D4037]">
                     <span>Subtotal</span>
                     <span className="font-bold">₹{subtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-[#5D4037]">
                     <span>Shipping</span>
                     <span className="text-green-600 font-bold">Free</span>
                  </div>
                  <div className="border-t border-[#E5DCCA] pt-4 flex justify-between text-lg font-bold text-[#2F334F]">
                     <span>Total</span>
                     <span>₹{subtotal.toLocaleString()}</span>
                  </div>
               </div>
               <Link href="/checkout">
                  <Button className="w-full h-12 bg-[#2F334F] hover:bg-[#1E2135] text-white rounded-xl shadow-lg font-bold text-lg">
                     Checkout Now <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
               </Link>
            </div>
         </div>
      )}
    </div>
  );
}
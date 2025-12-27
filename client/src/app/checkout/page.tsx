"use client";

import { useCartStore } from "@/store/useCartStore";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ShieldCheck, Truck, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { createOrderAction } from "@/app/actions/orders";

export default function CheckoutPage() {
  const { items, clearCart } = useCartStore();
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
  }, []);

  const subtotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const shipping = subtotal > 5000 ? 0 : 500;
  const total = subtotal + shipping;

  const handlePayment = async () => {
    setLoading(true);

    try {
      await createOrderAction(items, total);
      clearCart();
      toast.success("Payment Successful! Order Placed.");
      router.push("/checkout/success");
    } catch (error) {
      console.error(error);
      toast.error("Payment failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!mounted) return null;

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-[#FDFBF7] flex flex-col items-center justify-center p-4 text-center">
        <h1 className="text-2xl font-serif font-bold text-[#4A3526] mb-4">Your Loom is empty</h1>
        <p className="text-[#8C7B70] mb-8">Add some handcrafted treasures to your cart to proceed.</p>
        <Link href="/shop">
          <Button className="bg-[#2F334F] text-white rounded-xl px-8 h-12">Return to Shop</Button>
        </Link>
      </div>
    );
  }

  return (
    <main className="bg-[#FDFBF7] min-h-screen py-12">
      <div className="container mx-auto px-4 max-w-6xl">
        <Link href="/shop" className="flex items-center gap-2 text-[#8C7B70] hover:text-[#4A3526] mb-8 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Shop
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="space-y-8">
            <section className="bg-white p-8 rounded-3xl border border-[#E5DCCA] shadow-sm">
              <h2 className="text-2xl font-serif font-bold text-[#4A3526] mb-6">Shipping Details</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input type="text" placeholder="First Name" className="p-3 border border-[#E5DCCA] rounded-xl focus:ring-2 focus:ring-[#D4AF37] outline-none" required />
                <input type="text" placeholder="Last Name" className="p-3 border border-[#E5DCCA] rounded-xl focus:ring-2 focus:ring-[#D4AF37] outline-none" required />
                <input type="email" placeholder="Email Address" className="p-3 border border-[#E5DCCA] rounded-xl focus:ring-2 focus:ring-[#D4AF37] outline-none md:col-span-2" required />
                <input type="text" placeholder="Street Address" className="p-3 border border-[#E5DCCA] rounded-xl focus:ring-2 focus:ring-[#D4AF37] outline-none md:col-span-2" required />
                <input type="text" placeholder="City" className="p-3 border border-[#E5DCCA] rounded-xl focus:ring-2 focus:ring-[#D4AF37] outline-none" required />
                <input type="text" placeholder="State" className="p-3 border border-[#E5DCCA] rounded-xl focus:ring-2 focus:ring-[#D4AF37] outline-none" required />
              </div>
            </section>

            <div className="flex items-center gap-4 text-sm text-[#8C7B70]">
              <div className="flex items-center gap-1"><ShieldCheck className="w-4 h-4 text-[#D4AF37]" /> Secure Checkout</div>
              <div className="flex items-center gap-1"><Truck className="w-4 h-4 text-[#D4AF37]" /> Insured Shipping</div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white p-8 rounded-3xl border border-[#E5DCCA] shadow-sm sticky top-24">
              <h2 className="text-2xl font-serif font-bold text-[#4A3526] mb-6">Order Summary</h2>
              
              <div className="space-y-4 mb-6 max-h-[40vh] overflow-y-auto pr-2 custom-scrollbar">
                {items.map((item) => (
                  <div key={item.id} className="flex gap-4 group">
                    <div className="relative w-16 h-16 rounded-lg overflow-hidden border border-[#E5DCCA] shrink-0">
                      <Image src={item.image} alt={item.title} fill className="object-cover group-hover:scale-110 transition-transform duration-500" />
                    </div>
                    <div className="grow">
                      <h4 className="text-sm font-bold text-[#4A3526] line-clamp-1">{item.title}</h4>
                      <p className="text-xs text-[#8C7B70]">Qty: {item.quantity}</p>
                    </div>
                    <p className="text-sm font-bold text-[#4A3526]">₹{(item.price * item.quantity).toLocaleString()}</p>
                  </div>
                ))}
              </div>

              <div className="border-t border-[#E5DCCA] pt-4 space-y-2">
                <div className="flex justify-between text-[#8C7B70]">
                  <span>Subtotal</span>
                  <span>₹{subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-[#8C7B70]">
                  <span>Shipping</span>
                  <span>{shipping === 0 ? "FREE" : `₹${shipping}`}</span>
                </div>
                <div className="flex justify-between text-xl font-bold text-[#4A3526] pt-2 border-t border-[#E5DCCA]">
                  <span>Total</span>
                  <span className="text-[#D97742]">₹{total.toLocaleString()}</span>
                </div>
              </div>

              <Button 
                onClick={handlePayment}
                disabled={loading}
                className="w-full h-14 bg-[#2F334F] hover:bg-[#1E2135] text-white text-lg font-bold rounded-2xl mt-8 shadow-lg transition-all active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <div className="flex items-center gap-2">
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Processing...
                  </div>
                ) : (
                  "Proceed to Payment"
                )}
              </Button>
              
              <p className="text-[10px] text-center text-[#8C7B70] mt-4 uppercase tracking-tighter">
                By clicking, you agree to our Terms of Service
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { CheckCircle, Package, ArrowRight, ShieldCheck, Loader2, AlertCircle } from "lucide-react";
import { useCartStore } from "@/store/useCartStore";

export default function SuccessPage() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const { clearCart } = useCartStore();
  const [verifying, setVerifying] = useState(true);
  const [verified, setVerified] = useState(false);
  const [orderId, setOrderId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Verify payment and create order
  useEffect(() => {
    if (!sessionId) {
      setVerifying(false);
      setError("No session found");
      return;
    }

    const verifyPayment = async () => {
      try {
        const res = await fetch("/api/verify-session", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ sessionId }),
        });

        const data = await res.json();

        if (res.ok && data.success) {
          setVerified(true);
          setOrderId(data.orderId);
          clearCart();
        } else {
          setError(data.error || "Verification failed");
        }
      } catch (err) {
        console.error("Verification error:", err);
        setError("Could not verify payment. Please check your orders.");
        // Still clear cart since Stripe already charged
        clearCart();
      } finally {
        setVerifying(false);
      }
    };

    verifyPayment();
  }, [sessionId, clearCart]);

  if (verifying) {
    return (
      <div className="min-h-screen bg-[#FDFBF7] flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white p-10 rounded-[3rem] border border-[#E5DCCA] shadow-xl text-center space-y-6">
          <Loader2 className="w-12 h-12 text-[#D4AF37] animate-spin mx-auto" />
          <h1 className="text-2xl font-serif font-bold text-[#4A3526]">Verifying Payment...</h1>
          <p className="text-[#8C7B70]">Please wait while we confirm your order.</p>
        </div>
      </div>
    );
  }

  if (error && !verified) {
    return (
      <div className="min-h-screen bg-[#FDFBF7] flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white p-10 rounded-[3rem] border border-[#E5DCCA] shadow-xl text-center space-y-6">
          <AlertCircle className="w-12 h-12 text-amber-500 mx-auto" />
          <h1 className="text-2xl font-serif font-bold text-[#4A3526]">Payment Received</h1>
          <p className="text-[#8C7B70]">Your payment was processed but order confirmation is pending. Please check your orders page.</p>
          <Link href="/customer/orders">
            <Button className="w-full h-12 bg-[#2F334F] hover:bg-[#1E2135] text-white font-bold rounded-xl gap-2">
              View My Orders <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FDFBF7] flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white p-10 rounded-[3rem] border border-[#E5DCCA] shadow-xl text-center space-y-6 animate-in zoom-in duration-500">
        <div className="flex justify-center">
          <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center">
            <CheckCircle className="w-12 h-12 text-green-500" />
          </div>
        </div>
        
        <div className="space-y-2">
          <h1 className="text-3xl font-serif font-bold text-[#4A3526]">Payment Successful!</h1>
          <p className="text-[#8C7B70]">Your handmade treasure is being prepared by the artisan.</p>
          {orderId && (
            <p className="text-xs text-[#8C7B70] font-mono">Order ID: {orderId}</p>
          )}
        </div>

        <div className="bg-[#FDFBF7] p-4 rounded-2xl border border-[#E5DCCA] flex items-center gap-4 text-left">
          <Package className="w-6 h-6 text-[#D4AF37]" />
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-[#8C7B70]">Estimated Delivery</p>
            <p className="text-sm font-bold text-[#4A3526]">7-10 Business Days</p>
          </div>
        </div>

        <div className="flex items-center justify-center gap-2">
          <ShieldCheck className="w-4 h-4 text-green-500" />
          <p className="text-xs text-green-700 font-medium">Payment verified via Stripe</p>
        </div>

        <div className="pt-4 space-y-3">
          <Link href="/customer/orders">
            <Button className="w-full h-12 bg-[#2F334F] hover:bg-[#1E2135] text-white font-bold rounded-xl gap-2">
              View My Orders <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
          <Link href="/shop">
            <Button variant="outline" className="w-full h-12 border-[#E5DCCA] text-[#4A3526] font-bold rounded-xl gap-2 mt-2">
              Continue Shopping
            </Button>
          </Link>
          <p className="text-xs text-[#8C7B70]">A confirmation email has been sent to your inbox.</p>
        </div>
      </div>
    </div>
  );
}
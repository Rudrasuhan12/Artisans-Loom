"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Gavel, Loader2, Package, ArrowRight } from "lucide-react";
import { startAuctionAction } from "@/app/actions/auction";
import { toast } from "sonner";
import SafeImage from "@/components/ui/safe-image";
import { motion } from "framer-motion";

interface Product {
  id: string;
  title: string;
  price: number;
  images: string[];
  stock: number;
  category: string;
}

export default function StartAuctionButton({ products }: { products: Product[] }) {
  const [open, setOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (formData: FormData) => {
    if (!selectedProduct) return;
    setLoading(true);
    formData.append("productId", selectedProduct.id);

    try {
      await startAuctionAction(formData);
      toast.success(`"${selectedProduct.title}" listed for auction!`);
      setOpen(false);
      setSelectedProduct(null);
    } catch (error: any) {
      const msg = error.message || "Failed to start auction";
      if (msg.includes("already live")) {
        toast.warning("This item is already in the auction house.");
      } else if (msg.includes("already been sold")) {
        toast.info("This item was already sold via auction.");
      } else if (msg.includes("previously auctioned")) {
        toast.error("This item was already auctioned and cannot be re-listed.");
      } else {
        toast.error(msg);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(v) => { setOpen(v); if (!v) setSelectedProduct(null); }}>
      <DialogTrigger asChild>
        <Button className="h-14 px-8 rounded-full bg-gradient-to-r from-[#2F334F] to-[#1A1D2E] text-[#D4AF37] border border-[#D4AF37]/30 shadow-xl hover:shadow-2xl transition-all group">
          <Gavel className="w-5 h-5 mr-3 group-hover:rotate-[-20deg] transition-transform" />
          <span className="text-lg font-serif tracking-wide">List Your Masterpiece</span>
        </Button>
      </DialogTrigger>

      <DialogContent className="bg-[#FFFBF5] border-[#D4AF37]/40 max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-[#4A3526] font-serif text-2xl flex items-center gap-2">
            <Gavel className="w-6 h-6 text-[#D4AF37]" />
            {selectedProduct ? "Set Auction Details" : "Choose a Masterpiece"}
          </DialogTitle>
        </DialogHeader>

        {!selectedProduct ? (
          /* Step 1: Product Selection */
          <div className="space-y-3 mt-2">
            {products.length === 0 ? (
              <div className="text-center py-12 text-[#8C7B70]">
                <Package className="w-12 h-12 mx-auto mb-4 opacity-40" />
                <p className="font-serif text-lg">No products available</p>
                <p className="text-sm mt-1">Add products from your dashboard first.</p>
              </div>
            ) : (
              products.map((product, idx) => (
                <motion.button
                  key={product.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  onClick={() => setSelectedProduct(product)}
                  className="w-full flex items-center gap-4 p-3 rounded-2xl border border-[#E5DCCA] bg-white hover:border-[#D4AF37] hover:shadow-md transition-all group text-left"
                >
                  <div className="relative w-16 h-16 rounded-xl overflow-hidden shrink-0">
                    <SafeImage src={product.images[0] || "/p1.png"} alt={product.title} fill className="object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-serif font-bold text-[#4A3526] truncate">{product.title}</p>
                    <p className="text-sm text-[#8C7B70]">
                      {product.category} · ₹{product.price.toLocaleString()} · {product.stock} in stock
                    </p>
                  </div>
                  <ArrowRight className="w-5 h-5 text-[#D4AF37] opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
                </motion.button>
              ))
            )}
          </div>
        ) : (
          /* Step 2: Auction Configuration */
          <div className="space-y-5 mt-2">
            <div className="flex items-center gap-4 p-4 rounded-2xl bg-[#FFF5E1] border border-[#D4AF37]/20">
              <div className="relative w-14 h-14 rounded-xl overflow-hidden shrink-0">
                <SafeImage src={selectedProduct.images[0] || "/p1.png"} alt={selectedProduct.title} fill className="object-cover" />
              </div>
              <div>
                <p className="font-serif font-bold text-[#4A3526]">{selectedProduct.title}</p>
                <p className="text-sm text-[#8C7B70]">Retail: ₹{selectedProduct.price.toLocaleString()}</p>
              </div>
              <button
                onClick={() => setSelectedProduct(null)}
                className="ml-auto text-xs text-[#D4AF37] underline hover:no-underline"
              >
                Change
              </button>
            </div>

            <form action={handleSubmit} className="space-y-4">
              <div>
                <Label className="text-[#8C7B70] text-sm">Base Price (₹)</Label>
                <Input
                  name="basePrice"
                  type="number"
                  required
                  min={1}
                  placeholder={`Suggested: ₹${Math.round(selectedProduct.price * 0.7).toLocaleString()}`}
                  className="bg-white border-[#E5DCCA] h-12 rounded-xl"
                />
                <p className="text-xs text-[#8C7B70] mt-1">Set lower than retail to attract bidders.</p>
              </div>
              <div>
                <Label className="text-[#8C7B70] text-sm">Duration (Days)</Label>
                <Input
                  name="days"
                  type="number"
                  defaultValue="3"
                  required
                  min={1}
                  max={14}
                  className="bg-white border-[#E5DCCA] h-12 rounded-xl"
                />
              </div>
              <Button
                disabled={loading}
                className="w-full h-12 bg-gradient-to-r from-[#2F334F] to-[#1A1D2E] text-[#D4AF37] hover:opacity-90 rounded-xl text-base font-serif"
              >
                {loading ? <Loader2 className="animate-spin mr-2" /> : <Gavel className="w-4 h-4 mr-2" />}
                {loading ? "Listing..." : "Launch Auction"}
              </Button>
            </form>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

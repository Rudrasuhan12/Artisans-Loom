"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Gavel, Loader2 } from "lucide-react";
import { startAuctionAction } from "@/app/actions/auction";
import { toast } from "sonner";

export default function AuctionModal({ productId }: { productId: string }) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (formData: FormData) => {
    setLoading(true);
    formData.append("productId", productId);
    
    try {
      await startAuctionAction(formData);
      toast.success("Product listed for Auction successfully!");
      setOpen(false);
    } catch (error: any) {
      const errorMessage = error.message || "Failed to start auction";
      
      if (errorMessage.includes("already live")) {
        toast.warning("This item is already in the auction house.");
      } else if (errorMessage.includes("already been sold")) {
        toast.info("This item is already sold. You cannot auction it again.");
      } else if (errorMessage.includes("previously auctioned")) {
        toast.error("One-Time Only: This item was already auctioned.");
      } else {
        toast.error(errorMessage);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="icon" className="h-10 w-10 rounded-full bg-white/20 border border-white/30 hover:bg-[#D4AF37] text-white" title="List for Auction">
          <Gavel className="w-4 h-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-[#FFFBF5] border-[#D4AF37]">
        <DialogHeader>
          <DialogTitle className="text-[#4A3526] font-serif text-2xl">Start Royal Auction</DialogTitle>
        </DialogHeader>
        <form action={handleSubmit} className="space-y-4">
          <div>
            <Label className="text-[#8C7B70]">Base Price (₹)</Label>
            <Input name="basePrice" type="number" required className="bg-white border-[#E5DCCA]" />
          </div>
          <div>
            <Label className="text-[#8C7B70]">Duration (Days)</Label>
            <Input name="days" type="number" defaultValue="3" required className="bg-white border-[#E5DCCA]" />
          </div>
          <Button disabled={loading} className="w-full bg-[#2F334F] text-[#D4AF37] hover:bg-[#1E2135]">
            {loading ? <Loader2 className="animate-spin" /> : "Launch Auction"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
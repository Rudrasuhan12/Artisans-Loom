"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Gavel, Sparkles, Trophy, Loader2, Zap } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { placeBidAction } from "@/app/actions/auction";
import { getAuctionInsight } from "@/app/actions/valuation";
import { toast } from "sonner";
import Confetti from "react-confetti";

function useWindowSize() {
  const [size, setSize] = useState({ width: 0, height: 0 });
  useEffect(() => {
    const handleResize = () => setSize({ width: window.innerWidth, height: window.innerHeight });
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  return size;
}

export default function BiddingInterface({ auctionId, currentBid, minBid, product, status }: any) {
  const [bidAmount, setBidAmount] = useState<string>("");
  const [isBidding, setIsBidding] = useState(false);
  const [showHammer, setShowHammer] = useState(false);
  const [insight, setInsight] = useState("");
  const [loadingInsight, setLoadingInsight] = useState(false);
  
  const { width, height } = useWindowSize();
  const isEnded = status !== "ACTIVE";

  const handleBid = async () => {
    const amount = parseFloat(bidAmount);
    if (!amount || amount < minBid) {
      toast.error(`Bid must be at least ₹${minBid}`);
      return;
    }

    setIsBidding(true);
    try {
      await placeBidAction(auctionId, amount);
      setShowHammer(true);
      setTimeout(() => setShowHammer(false), 5000);
      setBidAmount("");
      toast.success("Bid Accepted! You are in the lead!");
    } catch (error) {
      toast.error("Bid Failed.");
    } finally {
      setIsBidding(false);
    }
  };

  const fetchInsight = async () => {
    if (insight) return;
    setLoadingInsight(true);
    const text = await getAuctionInsight(product.title, product.category, product.price);
    setInsight(text);
    setLoadingInsight(false);
  };

  if (isEnded) {
    return (
      <div className="bg-white border-2 border-[#D4AF37] p-10 rounded-[2.5rem] text-center shadow-xl relative overflow-hidden">
         <div className="absolute inset-0 bg-linear-to-b from-[#FFF5E1] to-white opacity-50"></div>
         <div className="relative z-10">
           <div className="p-5 bg-white rounded-full inline-block mb-6 shadow-lg border border-[#E5DCCA]">
              <Trophy className="w-12 h-12 text-[#D4AF37] animate-bounce" />
           </div>
           <h2 className="text-4xl font-serif font-bold text-[#4A3526] mb-2">Auction Closed</h2>
           <p className="text-[#8C7B70] text-lg mb-6">
             {status === "SOLD" ? "This masterpiece has been sold." : "The item went unsold."}
           </p>
           {status === "SOLD" && (
             <div className="px-8 py-4 bg-[#2F334F] text-white rounded-2xl inline-block shadow-lg">
                <p className="text-xs uppercase tracking-widest opacity-70 mb-1">Winning Bid</p>
                <p className="font-bold text-2xl font-mono">₹{currentBid.toLocaleString()}</p>
             </div>
           )}
         </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 relative">

      <AnimatePresence>
        {showHammer && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-9999 flex flex-col items-center justify-center bg-[#2C1810]/95 backdrop-blur-md"
          >
            <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none' }}>
               <Confetti width={width} height={height} numberOfPieces={500} recycle={false} colors={['#D4AF37', '#FFFBF5', '#F3E5AB']} />
            </div>

            <motion.div
              initial={{ scale: 0, rotate: -45 }}
              animate={{ scale: 1.5, rotate: 0 }}
              transition={{ duration: 0.6, type: "spring", bounce: 0.5 }}
              className="bg-linear-to-br from-[#F3E5AB] to-[#D4AF37] p-12 rounded-full shadow-[0_0_100px_rgba(212,175,55,0.8)] border-8 border-white"
            >
              <Gavel className="w-32 h-32 text-[#2C1810]" />
            </motion.div>
            
            <motion.div 
              initial={{ y: 50, opacity: 0 }} 
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="mt-10 text-center"
            >
               <h1 className="text-6xl font-serif font-bold text-[#FDFBF7] drop-shadow-2xl mb-2">BID ACCEPTED!</h1>
               <p className="text-[#D4AF37] text-2xl font-mono tracking-widest font-bold">YOU ARE LEADING</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="relative group">
        <div className="absolute -inset-1 bg-linear-to-r from-[#D4AF37] via-[#F3E5AB] to-[#D4AF37] rounded-[2.5rem] opacity-40 blur-xl group-hover:opacity-60 transition-opacity duration-1000"></div>
        
        <div className="relative bg-white/90 backdrop-blur-xl border border-[#D4AF37]/30 p-8 md:p-10 rounded-[2.5rem] shadow-2xl overflow-hidden">
          
          <div className="flex justify-between items-end mb-8 relative z-10">
            <div>
              <div className="flex items-center gap-2 mb-2">
                 <span className="relative flex h-3 w-3">
                   <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#D4AF37] opacity-75"></span>
                   <span className="relative inline-flex rounded-full h-3 w-3 bg-[#D97742]"></span>
                 </span>
                 <p className="text-[#D4AF37] text-xs font-bold uppercase tracking-[0.2em]">Highest Bid</p>
              </div>
              <motion.p 
                key={currentBid}
                initial={{ scale: 1.2, color: "#D97742" }} 
                animate={{ scale: 1, color: "#4A3526" }}
                className="text-6xl md:text-7xl font-serif font-bold"
              >
                ₹{currentBid.toLocaleString()}
              </motion.p>
            </div>
            <div className="text-right hidden md:block">
               <p className="text-[#8C7B70] text-xs uppercase mb-1 font-bold">Next Minimum</p>
               <p className="text-2xl font-bold text-[#2F334F]">₹{minBid.toLocaleString()}</p>
            </div>
          </div>

          <div className="flex flex-col md:flex-row gap-4 relative z-10">
            <div className="relative flex-1 group/input">
              <span className="absolute left-6 top-1/2 -translate-y-1/2 text-[#D4AF37] font-serif text-3xl font-bold group-focus-within/input:scale-110 transition-transform">₹</span>
              <Input 
                type="number" 
                value={bidAmount}
                onChange={(e) => setBidAmount(e.target.value)}
                placeholder="Enter amount..."
                className="h-20 pl-14 bg-[#FDFBF7] border-2 border-[#E5DCCA] text-[#4A3526] text-3xl font-bold rounded-2xl focus-visible:ring-4 focus-visible:ring-[#D4AF37]/20 focus-visible:border-[#D4AF37] placeholder:text-[#8C7B70]/30 transition-all shadow-inner"
              />
            </div>
            
            <Button 
              onClick={handleBid}
              disabled={isBidding}
              className="h-20 px-10 bg-[#2F334F] hover:bg-[#1E2135] text-white text-xl font-bold rounded-2xl shadow-xl transition-all hover:scale-105 active:scale-95 disabled:opacity-80 disabled:scale-100"
            >
              {isBidding ? <Loader2 className="w-6 h-6 animate-spin" /> : <div className="flex flex-col items-center leading-tight"><Gavel className="w-6 h-6 mb-1" /><span className="text-xs uppercase tracking-widest font-normal">Place Bid</span></div>}
            </Button>
          </div>

          <div className="flex gap-3 mt-6 justify-center md:justify-start relative z-10 overflow-x-auto pb-2 custom-scrollbar">
             {[100, 500, 1000, 5000].map(amt => (
               <button 
                 key={amt}
                 onClick={() => setBidAmount((currentBid + amt).toString())}
                 className="px-5 py-2.5 rounded-xl border border-[#D4AF37]/50 bg-[#FDFBF7] text-[#D4AF37] text-xs font-bold hover:bg-[#D4AF37] hover:text-white transition-all shadow-sm active:scale-95 whitespace-nowrap"
               >
                 + ₹{amt}
               </button>
             ))}
          </div>

        </div>
      </div>

      <div className="bg-white/80 border border-[#D4AF37]/30 p-6 rounded-3xl shadow-sm backdrop-blur-md">
         <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-3 text-[#4A3526]">
               <div className="p-2 bg-linear-to-r from-[#F3E5AB] to-[#D4AF37] rounded-lg text-white shadow-md"><Sparkles className="w-5 h-5" /></div>
               <h3 className="font-bold text-sm uppercase tracking-wider">Mitra's Valuation</h3>
            </div>
            {!insight && (
              <Button size="sm" onClick={fetchInsight} disabled={loadingInsight} className="bg-[#FFFBF5] text-[#D4AF37] hover:bg-[#F3E5AB] border border-[#D4AF37]/30 rounded-full shadow-sm">
                 {loadingInsight ? <Loader2 className="w-3 h-3 animate-spin mr-1"/> : <Zap className="w-3 h-3 mr-1"/>}
                 Analyze
              </Button>
            )}
         </div>
         <AnimatePresence>
           {insight && (
             <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }}>
               <p className="text-[#5D4037] italic leading-relaxed text-lg border-l-4 border-[#D4AF37] pl-4 font-serif">
                 "{insight}"
               </p>
             </motion.div>
           )}
         </AnimatePresence>
      </div>

    </div>
  );
}
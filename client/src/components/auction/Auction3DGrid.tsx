"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import SafeImage from "@/components/ui/safe-image";
import Countdown from "@/components/auction/Countdown";
import { ArrowRight, Clock, Flame } from "lucide-react";

export default function Auction3DGrid({ auctions }: { auctions: any[] }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 perspective-1000">
      {auctions.map((auction, idx) => {
        const currentPrice = auction.currentBid > 0 ? auction.currentBid : auction.basePrice;

        return (
          <Link href={`/auction/${auction.id}`} key={auction.id}>
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1, duration: 0.6 }}
              whileHover={{ 
                scale: 1.03, 
                y: -10, 
                boxShadow: "0 0 50px -12px rgba(212, 175, 55, 0.4)" 
              }}
              className="group relative h-120 rounded-4xl bg-[#16121E] border border-[#D4AF37]/30 overflow-hidden cursor-pointer shadow-2xl transition-all duration-500"
            >
              
              <div className="relative h-[60%] w-full overflow-hidden">
                <SafeImage 
                  src={auction.product.images[0] || "/p1.png"} 
                  alt={auction.product.title} 
                  fill 
                  className="object-cover group-hover:scale-110 transition-transform duration-1000" 
                />
                
                <div className="absolute inset-0 bg-linear-to-t from-[#16121E] via-transparent to-transparent opacity-90"></div>
                
                <div className="absolute top-4 left-4">
                   <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/60 backdrop-blur-md border border-[#D4AF37]/50 shadow-[0_0_15px_rgba(212,175,55,0.3)]">
                      <Clock className="w-3 h-3 text-[#D4AF37] animate-pulse" />
                      <div className="text-[10px] font-bold font-mono text-[#E5DCCA]">
                         <Countdown targetDate={auction.endTime} />
                      </div>
                   </div>
                </div>

                <div className="absolute bottom-2 right-4 text-right transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                   <p className="text-[10px] text-[#D4AF37] font-bold uppercase tracking-widest mb-1 drop-shadow-md">Current Bid</p>
                   <p className="text-3xl font-bold text-white font-mono drop-shadow-[0_2px_10px_rgba(0,0,0,1)]">₹{currentPrice.toLocaleString()}</p>
                </div>
              </div>

              <div className="relative h-[40%] p-6 flex flex-col justify-between">
                 
                 <div className="absolute top-0 left-1/2 -translate-x-1/2 w-0 h-px bg-[#D4AF37] group-hover:w-[80%] transition-all duration-700 shadow-[0_0_10px_#D4AF37]"></div>

                 <div>
                    <div className="flex items-center gap-2 mb-3">
                       <Flame className="w-3 h-3 text-[#D97742]" />
                       <span className="text-[#D4AF37] text-[10px] font-bold uppercase tracking-widest">{auction.product.category}</span>
                    </div>
                    <h3 className="text-xl font-serif font-bold text-[#F3E5AB] line-clamp-2 leading-tight group-hover:text-white transition-colors">
                       {auction.product.title}
                    </h3>
                 </div>

                 <div className="flex items-center justify-between mt-4">
                    <div className="flex items-center gap-2">
                       <div className="w-8 h-8 rounded-full border border-[#D4AF37]/30 flex items-center justify-center bg-white/5">
                          <span className="text-xs text-[#D4AF37] font-bold">{auction.bids.length}</span>
                       </div>
                       <span className="text-[10px] text-[#8C7B70] uppercase tracking-wide">Active Bids</span>
                    </div>

                    <div className="w-10 h-10 rounded-full bg-[#D4AF37] flex items-center justify-center text-[#16121E] group-hover:scale-110 transition-transform shadow-[0_0_15px_#D4AF37]">
                       <ArrowRight className="w-5 h-5" />
                    </div>
                 </div>
              </div>
            </motion.div>
          </Link>
        );
      })}
    </div>
  );
}
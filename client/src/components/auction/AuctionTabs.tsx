"use client";

import { useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Gavel, History, Crown, AlertCircle } from "lucide-react";
import Auction3DGrid from "./Auction3DGrid";
import SafeImage from "../ui/safe-image";
import { motion } from "framer-motion";

export default function AuctionTabs({ activeAuctions, pastAuctions }: { activeAuctions: any[], pastAuctions: any[] }) {
  const [activeTab, setActiveTab] = useState("live");

  return (
    <Tabs defaultValue="live" className="w-full" onValueChange={setActiveTab}>
      
      <div className="flex justify-center mb-12">
        <TabsList className="bg-white/80 backdrop-blur-md border border-[#D4AF37]/30 p-1 rounded-full h-16 shadow-lg">
          <TabsTrigger 
            value="live" 
            className="rounded-full h-full px-8 text-lg font-serif data-[state=active]:bg-[#2F334F] data-[state=active]:text-[#D4AF37] text-[#8C7B70] transition-all"
          >
            <Gavel className="w-5 h-5 mr-2" /> Live Events
          </TabsTrigger>
          <TabsTrigger 
            value="past" 
            className="rounded-full h-full px-8 text-lg font-serif data-[state=active]:bg-[#2F334F] data-[state=active]:text-[#D4AF37] text-[#8C7B70] transition-all"
          >
            <History className="w-5 h-5 mr-2" /> The Archives
          </TabsTrigger>
        </TabsList>
      </div>

      <TabsContent value="live">
        {activeAuctions.length === 0 ? (
           <div className="flex flex-col items-center justify-center py-32 border-2 border-dashed border-[#D4AF37]/30 rounded-[3rem] bg-white/40 backdrop-blur-lg">
              <div className="p-8 bg-[#FFF5E1] rounded-full mb-6 text-[#D4AF37]">
                <Gavel className="w-12 h-12" />
              </div>
              <h3 className="text-3xl font-serif text-[#4A3526]">The Hall is Silent</h3>
              <p className="text-[#8C7B70] mt-2">Curators are preparing new masterpieces.</p>
           </div>
        ) : (
           <Auction3DGrid auctions={activeAuctions} />
        )}
      </TabsContent>

      <TabsContent value="past">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
           {pastAuctions.map((auction, idx) => {
             const isSold = auction.status === "SOLD";
             const winner = auction.bids[0]?.user.name || "Unknown";
             const finalPrice = auction.currentBid;

             return (
               <motion.div 
                 key={auction.id}
                 initial={{ opacity: 0, y: 20 }}
                 animate={{ opacity: 1, y: 0 }}
                 transition={{ delay: idx * 0.05 }}
                 className="group bg-white rounded-3xl border border-[#E5DCCA] overflow-hidden opacity-90 hover:opacity-100 transition-all hover:shadow-xl"
               >
                  <div className="relative h-48 w-full grayscale group-hover:grayscale-0 transition-all duration-500">
                     <SafeImage src={auction.product.images[0] || "/p1.png"} alt={auction.product.title} fill className="object-cover" />
                     
                     <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                        <div className={`px-4 py-1 rounded-full border-2 text-xs font-bold uppercase tracking-widest ${isSold ? 'border-green-400 text-green-100 bg-green-900/80' : 'border-red-400 text-red-100 bg-red-900/80'}`}>
                           {auction.status}
                        </div>
                     </div>
                  </div>

                  <div className="p-5">
                     <h4 className="font-serif font-bold text-[#4A3526] line-clamp-1">{auction.product.title}</h4>
                     
                     <div className="mt-4 flex items-center justify-between text-sm">
                        <div>
                           <p className="text-[10px] text-[#8C7B70] uppercase">Closed At</p>
                           <p className="font-bold text-[#2C1810]">₹{finalPrice.toLocaleString()}</p>
                        </div>
                        {isSold && (
                          <div className="text-right">
                             <p className="text-[10px] text-[#8C7B70] uppercase">Winner</p>
                             <div className="flex items-center gap-1 text-[#D4AF37] font-bold">
                                <Crown className="w-3 h-3" /> {winner.split(" ")[0]}
                             </div>
                          </div>
                        )}
                     </div>
                  </div>
               </motion.div>
             );
           })}
           {pastAuctions.length === 0 && (
             <div className="col-span-full text-center py-20 text-[#8C7B70]">No archival records found.</div>
           )}
        </div>
      </TabsContent>

    </Tabs>
  );
}
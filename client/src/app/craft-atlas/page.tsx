"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { allStatesData } from "@/lib/statesData";
import { ArrowRight, Search, Map, Compass } from "lucide-react";
import BackButton from "@/components/dashboard/BackButton";
import SafeImage from "@/components/ui/safe-image";
import { Input } from "@/components/ui/input";

export default function CraftAtlasGrid() {
  const [search, setSearch] = useState("");

  const filteredStates = allStatesData.filter(s => 
    s.name.toLowerCase().includes(search.toLowerCase()) || 
    s.microtext.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#FDFBF7] relative overflow-hidden pb-32">
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/paper.png')] opacity-40"></div>
      
      <div className="fixed top-20 left-0 w-full flex justify-center pointer-events-none z-0">
        <h1 className="text-[14vw] md:text-[9vw] font-serif font-bold text-[#4A3526] opacity-[0.03] tracking-widest whitespace-nowrap">
          INCREDIBLE INDIA
        </h1>
      </div>

      <div className="fixed -bottom-32 -right-32 w-150 h-150 opacity-[0.05] animate-spin-slow pointer-events-none z-0">
         <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className="w-full h-full fill-[#D4AF37]">
            <path d="M42.7,-62.9C50.9,-52.8,49.5,-34.4,53.7,-19.4C57.9,-4.3,67.7,7.3,68.6,20.4C69.6,33.5,61.7,48,49.8,56.6C37.9,65.2,22,67.9,7.6,66.4C-6.8,64.9,-19.7,59.2,-31.6,50.7C-43.5,42.2,-54.4,30.9,-61.1,16.8C-67.8,2.7,-70.3,-14.2,-63.9,-27.6C-57.5,-41,-42.2,-50.9,-28.3,-58.5C-14.4,-66.1,2,-71.4,15.7,-69.6C29.4,-67.8,40.3,-59,50,-50" transform="translate(100 100)" />
         </svg>
      </div>


      <div className="relative z-10 container mx-auto px-4 lg:px-8 pt-20">

        <div className="flex flex-col items-center text-center mb-24 space-y-6">
           <motion.div 
             initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
             className="inline-flex items-center gap-3 px-6 py-2 rounded-full border border-[#D4AF37]/40 bg-[#FFFBF5] shadow-sm"
           >
             <span className="w-2 h-2 rounded-full bg-[#D4AF37] animate-pulse"></span>
             <span className="text-[#8C7B70] text-xs font-bold uppercase tracking-[0.2em]">The Heritage Map</span>
           </motion.div>

           <motion.h2 
             initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
             transition={{ duration: 0.8 }}
             className="text-6xl md:text-8xl font-serif font-bold text-[#4A3526] relative"
           >
             Craft Atlas
             <span className="absolute -top-6 -right-8 text-4xl animate-bounce">✨</span>
           </motion.h2>

           <motion.div 
             initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.3 }}
             className="w-full max-w-lg relative group mt-8"
           >
              <div className="absolute -inset-1 bg-linear-to-r from-[#D4AF37] to-[#8B6508] rounded-full blur opacity-20 group-hover:opacity-40 transition duration-500"></div>
              <div className="relative flex items-center bg-white rounded-full h-16 px-6 shadow-xl border border-[#E5DCCA]">
                 <Search className="w-5 h-5 text-[#D4AF37] mr-3" />
                 <Input 
                   value={search}
                   onChange={(e) => setSearch(e.target.value)}
                   placeholder="Search state, craft, or culture..." 
                   className="flex-1 border-none shadow-none text-lg bg-transparent focus-visible:ring-0 placeholder:text-[#8C7B70]/50 text-[#4A3526]"
                 />
                 <div className="h-8 w-px bg-[#E5DCCA] mx-3"></div>
                 <div className="text-xs font-bold text-[#D4AF37] uppercase tracking-wider whitespace-nowrap">
                    {filteredStates.length} Regions
                 </div>
              </div>
           </motion.div>
        </div>

        <motion.div 
           layout
           className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-12"
        >
          <AnimatePresence>
            {filteredStates.map((state, idx) => (
              <Link href={`/craft-atlas/${encodeURIComponent(state.name)}`} key={state.name} className="block group">
                <motion.div
                  layout
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ delay: idx * 0.05, duration: 0.5 }}
                  className="relative h-112.5 w-full perspective-1000"
                >
                  
                  <div className="relative h-full w-full bg-white rounded-[20px] p-3 border border-[#E5DCCA] shadow-md hover:shadow-2xl transition-all duration-500 hover:-translate-y-3 group-hover:rotate-1">

                    <div className="relative h-[65%] w-full rounded-[15px] overflow-hidden">
                       <div className="absolute inset-0 bg-[#2C1810] z-0"></div>
                       <SafeImage 
                         src={state.image} 
                         alt={state.name} 
                         fill 
                         className="object-cover group-hover:scale-110 transition-transform duration-1000"
                       />
                       
                       <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent opacity-60 group-hover:opacity-40 transition-opacity"></div>
                       
                       <div className="absolute top-4 right-4 w-10 h-10 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-xl border border-white/30 shadow-lg">
                          {state.badge}
                       </div>
                    </div>

                    <div className="h-[35%] flex flex-col justify-between pt-4 px-2 pb-2">
                       
                       <div>
                          <p className="text-[10px] font-bold text-[#D97742] uppercase tracking-[0.2em] mb-1">
                             {state.microtext}
                          </p>
                          <h3 className="text-2xl font-serif font-bold text-[#2C1810] leading-tight group-hover:text-[#D4AF37] transition-colors">
                             {state.name}
                          </h3>
                       </div>

                       <div className="w-full h-px bg-[#E5DCCA] group-hover:bg-[#D4AF37] transition-colors duration-500 my-2"></div>

                       <div className="flex items-center justify-between">
                          <div className="flex -space-x-2">
                             {state.crafts.slice(0,3).map((c: any, i: number) => (
                                <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-gray-200 overflow-hidden relative shadow-sm">
                                   <SafeImage src={c.image} alt="" fill className="object-cover" />
                                </div>
                             ))}
                          </div>
                          
                          <div className="w-10 h-10 rounded-full border border-[#E5DCCA] flex items-center justify-center text-[#8C7B70] group-hover:bg-[#2F334F] group-hover:text-[#D4AF37] group-hover:border-[#2F334F] transition-all duration-300">
                             <ArrowRight className="w-4 h-4" />
                          </div>
                       </div>

                    </div>

                  </div>
                </motion.div>
              </Link>
            ))}
          </AnimatePresence>
        </motion.div>

      </div>
      <BackButton />
    </div>
  );
}
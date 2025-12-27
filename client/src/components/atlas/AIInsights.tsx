"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Lightbulb, BookOpen, Landmark, Sparkles, RefreshCw } from "lucide-react";
import { getSpecificInsight } from "@/app/actions/atlas";
import { Button } from "@/components/ui/button";

export default function AIInsights({ stateName }: { stateName: string }) {
  const [activeTab, setActiveTab] = useState<'fact' | 'story' | 'culture' | null>(null);
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);

  const handleFetch = async (type: 'fact' | 'story' | 'culture') => {
    if (loading) return;
    setActiveTab(type);
    setLoading(true);
    const text = await getSpecificInsight(stateName, type);
    setContent(text);
    setLoading(false);
  };

  return (
    <div className="py-12 relative z-20">
      <div className="text-center mb-10">
         <h2 className="text-3xl font-serif font-bold text-[#4A3526] flex items-center justify-center gap-2">
           <Sparkles className="w-6 h-6 text-[#D97742]" /> Hidden Secrets of {stateName}
         </h2>
         <p className="text-[#8C7B70] mt-2">Tap an orb to reveal ancient wisdom.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        <OrbCard 
          icon={Lightbulb} 
          label="Did You Know?" 
          color="bg-amber-100 text-amber-600"
          onClick={() => handleFetch('fact')}
          isActive={activeTab === 'fact'}
        />

        <OrbCard 
          icon={BookOpen} 
          label="Legend & Lore" 
          color="bg-rose-100 text-rose-600"
          onClick={() => handleFetch('story')}
          isActive={activeTab === 'story'}
        />

        <OrbCard 
          icon={Landmark} 
          label="Royal Heritage" 
          color="bg-indigo-100 text-indigo-600"
          onClick={() => handleFetch('culture')}
          isActive={activeTab === 'culture'}
        />

      </div>

      <AnimatePresence mode="wait">
        {activeTab && (
          <motion.div
            key={content}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="mt-8 max-w-3xl mx-auto"
          >
            <div className="bg-white/80 backdrop-blur-md rounded-4xl p-8 border border-[#E5DCCA] shadow-xl text-center relative overflow-hidden">
               <div className="absolute top-0 left-0 w-full h-1 bg-linear-to-r from-transparent via-[#D4AF37] to-transparent"></div>
               {loading ? (
                 <div className="flex justify-center py-4">
                   <RefreshCw className="w-8 h-8 text-[#D4AF37] animate-spin" />
                 </div>
               ) : (
                 <p className="text-xl font-serif text-[#4A3526] leading-relaxed italic">
                   "{content}"
                 </p>
               )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function OrbCard({ icon: Icon, label, color, onClick, isActive }: any) {
  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className={`relative group h-40 rounded-4xl border-2 transition-all duration-300 flex flex-col items-center justify-center gap-4 shadow-lg ${isActive ? 'border-[#D4AF37] bg-white' : 'border-transparent bg-white/50 hover:bg-white'}`}
    >
      <div className={`w-16 h-16 rounded-full flex items-center justify-center ${color} shadow-inner group-hover:scale-110 transition-transform duration-500`}>
        <Icon className="w-8 h-8" />
      </div>
      <span className="font-bold text-[#4A3526] uppercase tracking-widest text-sm">{label}</span>
    </motion.button>
  )
}
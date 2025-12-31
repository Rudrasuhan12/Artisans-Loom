"use client";

import { useState, useCallback } from "react";
import { Sparkles, RefreshCw, TrendingUp, Lightbulb, Megaphone, Loader2, X, Zap, Crown } from "lucide-react";
import { getMitraOracleInsights } from "@/app/actions/oracle";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";

const InsightCard = ({ icon: Icon, data, delay, gradient, shadowColor }: any) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 30, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ delay, duration: 0.5, type: "spring", bounce: 0.4 }}
      className="relative group h-full"
    >
      <div className="relative h-full bg-[#1A1D2E] border border-[#D4AF37]/20 rounded-4xl p-8 overflow-hidden hover:border-[#D4AF37]/50 transition-all duration-500 hover:-translate-y-2 shadow-xl">
        
        <div className={`absolute top-[-50%] right-[-50%] w-full h-full ${gradient} opacity-10 group-hover:opacity-20 blur-[80px] transition-opacity duration-700`}></div>
        <div className="mb-6 relative">
           <div className={`w-16 h-16 rounded-full ${gradient} flex items-center justify-center shadow-[0_0_30px_${shadowColor}] relative z-10 group-hover:scale-110 transition-transform duration-500 border border-white/10`}>
              <Icon className="w-8 h-8 text-white drop-shadow-md" />
           </div>
           <div className="absolute top-0 left-0 w-16 h-16 rounded-full border border-white/20 scale-125 opacity-0 group-hover:opacity-100 group-hover:scale-150 transition-all duration-700"></div>
        </div>

        <div className="relative z-10">
          <h4 className="text-[#D4AF37] text-xs font-bold uppercase tracking-[0.2em] mb-3 flex items-center gap-2">
            <Sparkles className="w-3 h-3" /> {data.type}
          </h4>
          
          <h3 className="text-2xl font-serif font-bold text-white mb-4 leading-tight group-hover:text-[#F3E5AB] transition-colors">
            {data.headline}
          </h3>
          
          <div className="w-12 h-0.5 bg-white/20 mb-4 group-hover:w-full group-hover:bg-linear-to-r group-hover:from-[#D4AF37] group-hover:to-transparent transition-all duration-700"></div>
          
          <p className="text-[#E5DCCA]/80 text-sm leading-relaxed font-light">
            {data.body}
          </p>
        </div>
        
      </div>
    </motion.div>
  );
};

export default function OracleInsightWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [insights, setInsights] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchInsights = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getMitraOracleInsights();
      setInsights(data.insights);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleOpen = () => {
    setIsOpen(true);
    if (insights.length === 0) fetchInsights();
  };

  return (
    <>
      <div className="flex justify-end mb-6">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleOpen}
          className="relative group h-14 px-8 rounded-full bg-linear-to-r from-[#2F334F] to-[#1A1D2E] border border-[#D4AF37]/50 shadow-[0_0_20px_rgba(212,175,55,0.3)] flex items-center gap-3 overflow-hidden"
        >
           <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20 animate-pulse"></div>
           <Crown className="w-5 h-5 text-[#D4AF37]" />
           <span className="font-serif font-bold text-[#FDFBF7] tracking-wide relative z-10">
             Consult Mitra's Oracle
           </span>
           <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
        </motion.button>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div 
             initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
             className="fixed inset-0 z-100 flex items-center justify-center bg-[#0F111A]/95 backdrop-blur-xl p-4"
          >
             <button 
               onClick={() => setIsOpen(false)}
               className="absolute top-8 right-8 text-white/50 hover:text-white transition-colors bg-white/5 p-3 rounded-full hover:bg-white/20 border border-white/10"
             >
               <X className="w-6 h-6" />
             </button>

             <div className="w-full max-w-6xl relative">
                
                <div className="text-center mb-16 space-y-4">
                   <motion.div 
                     initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
                     className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#D4AF37] bg-[#D4AF37]/10 text-[#D4AF37] text-xs font-bold uppercase tracking-[0.3em]"
                   >
                     <Zap className="w-3 h-3" /> Strategic Intelligence
                   </motion.div>
                   <h2 className="text-5xl md:text-7xl font-serif font-bold text-transparent bg-clip-text bg-linear-to-r from-[#F3E5AB] via-[#D4AF37] to-[#8B6508] drop-shadow-2xl">
                      The Oracle's Vision
                   </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
                  {loading ? (
                    Array(3).fill(0).map((_, i) => (
                      <div key={i} className="h-80 rounded-4xl bg-white/5 border border-white/10 animate-pulse flex flex-col items-center justify-center gap-4">
                        <Loader2 className="w-12 h-12 text-[#D4AF37] animate-spin" />
                        <p className="text-[#8C7B70] text-sm tracking-widest uppercase">Divining Future...</p>
                      </div>
                    ))
                  ) : (
                    <>
                      <InsightCard 
                        icon={TrendingUp} 
                        data={insights[0]} 
                        delay={0.1} 
                        gradient="bg-gradient-to-br from-cyan-500 to-emerald-600"
                        shadowColor="rgba(6,182,212,0.4)"
                      />
                      
                      <InsightCard 
                        icon={Lightbulb} 
                        data={insights[1]} 
                        delay={0.2} 
                        gradient="bg-gradient-to-br from-purple-500 to-pink-600"
                        shadowColor="rgba(168,85,247,0.4)"
                      />
                      
                      <InsightCard 
                        icon={Megaphone} 
                        data={insights[2]} 
                        delay={0.3} 
                        gradient="bg-gradient-to-br from-amber-500 to-red-600"
                        shadowColor="rgba(245,158,11,0.4)"
                      />
                    </>
                  )}
                </div>

                <div className="mt-16 flex justify-center">
                   <Button 
                     onClick={fetchInsights} 
                     disabled={loading}
                     className="h-16 px-10 rounded-full bg-[#D4AF37] hover:bg-[#B8860B] text-[#2C1810] font-bold text-lg shadow-[0_0_40px_rgba(212,175,55,0.3)] transition-all hover:scale-105 border-b-4 border-[#8B6508] active:border-b-0 active:translate-y-1"
                   >
                      {loading ? <Loader2 className="animate-spin mr-2" /> : <RefreshCw className="mr-2" />}
                      Generate New Insights
                   </Button>
                </div>

             </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
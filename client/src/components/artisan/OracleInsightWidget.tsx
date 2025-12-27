"use client";

import { useState, useEffect, useCallback } from "react";
import { Sparkles, RefreshCw, TrendingUp, Lightbulb, Megaphone, Loader2 } from "lucide-react";
import { getMitraOracleInsights } from "@/app/actions/oracle";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";

const InsightCard = ({ icon: Icon, text, delay, color }: any) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="bg-white/10 backdrop-blur-md border border-white/20 p-6 rounded-2xl flex flex-col gap-4 hover:bg-white/15 transition-all group"
    >
      <div className={`w-12 h-12 rounded-full flex items-center justify-center ${color} shadow-lg group-hover:scale-110 transition-transform`}>
        <Icon className="w-6 h-6 text-white" />
      </div>
      <p className="text-white/90 text-sm leading-relaxed font-medium">
        {text}
      </p>
    </motion.div>
  );
};

export default function OracleInsightWidget() {
  const [insights, setInsights] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

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

  useEffect(() => { fetchInsights(); }, [fetchInsights]);

  return (
    <section className="relative overflow-hidden rounded-[2.5rem] p-8 md:p-12 shadow-2xl bg-gradient-to-br from-[#1A1D2E] via-[#2F334F] to-[#4A3526]">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-[#D4AF37]/10 rounded-full blur-3xl -mr-32 -mt-32 animate-pulse" />
      
      <div className="relative z-10 space-y-10">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-[#D4AF37] rounded-lg">
              <Sparkles className="w-6 h-6 text-[#1A1D2E]" />
            </div>
            <h2 className="text-3xl font-serif font-bold text-white tracking-tight">Mitra's Oracle</h2>
          </div>
          <Button 
            variant="ghost" 
            onClick={fetchInsights} 
            disabled={loading}
            className="text-white/70 hover:text-white hover:bg-white/10 rounded-full h-12 w-12 p-0"
          >
            <RefreshCw className={`w-5 h-5 ${loading ? "animate-spin" : ""}`} />
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {loading ? (
            Array(3).fill(0).map((_, i) => (
              <div key={i} className="h-48 rounded-2xl bg-white/5 animate-pulse flex items-center justify-center">
                <Loader2 className="w-8 h-8 text-white/20 animate-spin" />
              </div>
            ))
          ) : (
            <>
              <InsightCard 
                icon={TrendingUp} 
                text={insights[0]} 
                delay={0.1} 
                color="bg-sky-500" 
                title="Trend Forecast" 
              />
              <InsightCard 
                icon={Lightbulb} 
                text={insights[1]} 
                delay={0.2} 
                color="bg-purple-500" 
                title="Design Prompt" 
              />
              <InsightCard 
                icon={Megaphone} 
                text={insights[2]} 
                delay={0.3} 
                color="bg-amber-500" 
                title="Marketing Tip" 
              />
            </>
          )}
        </div>

        <div className="pt-4 border-t border-white/10 flex items-center justify-center">
          <p className="text-white/40 text-[10px] uppercase tracking-[0.2em] font-bold">
            Insights powered by Platform Data & Gemini AI
          </p>
        </div>
      </div>
    </section>
  );
}
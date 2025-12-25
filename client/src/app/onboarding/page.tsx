"use client";

import { Button } from "@/components/ui/button";
import { Hammer, ShoppingBag, ArrowRight } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function OnboardingPage() {
  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-[#FDFBF7] relative overflow-hidden p-4">
      
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,var(--tw-gradient-stops))] from-amber-50/50 via-[#FDFBF7] to-[#F2E6D8]/30" />
      <div className="absolute top-[-10%] left-[-10%] w-[40vw] h-[40vw] bg-[#D4AF37]/10 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40vw] h-[40vw] bg-[#D97742]/5 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="relative z-10 max-w-5xl w-full">
        
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16 space-y-4"
        >
          <h1 className="text-4xl md:text-6xl font-serif font-bold text-[#4A3526]">
            Welcome to the <span className="text-[#D97742]">Loom</span>
          </h1>
          <p className="text-[#8C7B70] text-lg max-w-xl mx-auto font-medium">
            To curate your perfect experience, please tell us how you wish to participate in our heritage journey.
          </p>
        </motion.div>
        
        <div className="grid md:grid-cols-2 gap-8 lg:gap-12">

          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="group relative h-105 rounded-4xl p-0.75 bg-linear-to-b from-[#F3E5AB] via-[#D4AF37] to-[#8B6508] shadow-xl hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 cursor-pointer"
          >
            <div className="relative h-full bg-[#FFFBF5] rounded-[1.8rem] overflow-hidden flex flex-col items-center justify-center text-center p-8 border border-[#E5DCCA]">
              <div className="mb-6 w-24 h-24 rounded-full bg-[#FFF5E1] border border-[#D4AF37]/30 flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
                 <Hammer className="w-10 h-10 text-[#D97742]" />
              </div>
              
              <h2 className="text-3xl font-serif font-bold text-[#4A3526] mb-3 group-hover:text-[#D97742] transition-colors">
                Join as Artisan
              </h2>
              <p className="text-[#5D4037] text-sm leading-relaxed mb-8 px-4">
                Showcase your heritage, access AI-powered listing tools, and sell your handcrafted masterpieces to the world.
              </p>

              <Link href="/onboarding/artisan" className="w-full">
                <Button className="w-full h-12 rounded-xl bg-[#2F334F] hover:bg-[#1E2135] text-[#FDFBF7] font-serif shadow-lg">
                   Begin Journey <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </Link>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="group relative h-105 rounded-4xl p-0.75 bg-linear-to-b from-[#F3E5AB] via-[#D4AF37]/50 to-[#8B6508]/20 shadow-xl hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 cursor-pointer"
          >
            <div className="relative h-full bg-[#FFFBF5] rounded-[1.8rem] overflow-hidden flex flex-col items-center justify-center text-center p-8 border border-[#E5DCCA]">
              
              <div className="mb-6 w-24 h-24 rounded-full bg-[#F0F4FF] border border-[#2F334F]/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
                 <ShoppingBag className="w-10 h-10 text-[#2F334F]" />
              </div>
              
              <h2 className="text-3xl font-serif font-bold text-[#4A3526] mb-3 group-hover:text-[#2F334F] transition-colors">
                Join as Patron
              </h2>
              <p className="text-[#5D4037] text-sm leading-relaxed mb-8 px-4">
                Discover authentic crafts directly from India's finest artisans, support local talent, and own a piece of history.
              </p>

              <Link href="/onboarding/customer" className="w-full">
                <Button variant="outline" className="w-full h-12 rounded-xl border-[#D4AF37] text-[#4A3526] hover:bg-[#FFF5E1] font-serif">
                   Start Exploring
                </Button>
              </Link>
            </div>
          </motion.div>

        </div>
      </div>
    </div>
  );
}
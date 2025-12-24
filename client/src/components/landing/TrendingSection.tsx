"use client";

import { Button } from "@/components/ui/button";
import { ArrowRight, Flame, TrendingUp } from "lucide-react";
import Image from "next/image";
import { RoyalDivider } from "@/components/ui/royal-divider";

const trends = [
  {
    id: 1,
    title: "The Royal Wedding Edit",
    subtitle: "Banarasi & Kanjivaram Classics",
    image: "/p1.png", 
  },
  {
    id: 2,
    title: "Temple Architecture",
    subtitle: "Bronze & Stone Carvings",
    image: "/p2.png",
  },
  {
    id: 3,
    title: "Mountain Warmth",
    subtitle: "Pashmina & Kullu Weaves",
    image: "/p3.png",
  },
];

export default function TrendingSection() {
  return (
    <section className="relative w-full py-24 overflow-hidden bg-[#FDFBF7]">

      <div className="absolute inset-0 bg-linear-to-b from-[#FDFBF7] via-[#F2E6D8] to-[#FDFBF7]" />
      <div className="absolute top-[20%] right-[10%] w-[35vw] h-[35vw] bg-[#D4AF37]/10 rounded-full blur-[120px] pointer-events-none animate-pulse"></div>
      <div className="absolute bottom-[20%] left-[10%] w-[40vw] h-[40vw] bg-[#D97742]/5 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="absolute top-0 left-0 w-full h-64 bg-linear-to-b from-[#FDFBF7] via-[#FDFBF7]/60 to-transparent pointer-events-none" />

      <div className="absolute bottom-0 left-0 w-full h-32 bg-linear-to-t from-[#FDFBF7] to-transparent pointer-events-none" />

      <div className="relative z-10 container mx-auto px-4 lg:px-8">
        
        <div className="text-center mb-16 space-y-4">
          <div className="flex justify-center">
             <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/60 border border-[#D4AF37]/30 text-[#4A3526] text-xs lg:text-sm font-medium shadow-sm backdrop-blur-md">
                <Flame className="w-4 h-4 text-[#D97742] fill-[#D97742]" /> 
                <span>Trending Now</span>
             </div>
          </div>

          <h2 className="text-5xl md:text-6xl font-serif font-bold text-[#4A3526]">
            Hot on the <span className="bg-clip-text text-transparent bg-linear-to-r from-[#B8860B] via-[#FFD700] to-[#B8860B] animate-shine">Loom</span>
          </h2>
          <p className="text-[#5D4037] text-lg max-w-2xl mx-auto font-medium">
             See what’s capturing the hearts of our community this week.
          </p>
          
          <div className="flex justify-center scale-100 mt-6">
            <RoyalDivider />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {trends.map((trend) => (
            <div key={trend.id} className="group relative h-125 rounded-4xl p-1 bg-linear-to-b from-[#F3E5AB] via-[#D4AF37]/40 to-[#8B6508]/20 hover:from-[#FFD700] hover:via-[#D4AF37] hover:to-[#B8860B] transition-all duration-700 shadow-xl hover:shadow-2xl hover:-translate-y-3 cursor-pointer">
              
              <div className="relative h-full w-full bg-[#FFFBF5] rounded-[1.8rem] overflow-hidden">
                <Image
                  src={trend.image}
                  alt={trend.title}
                  fill
                  className="object-cover transition-transform duration-1000 group-hover:scale-110"
                />

                <div className="absolute inset-0 bg-linear-to-t from-[#2C1810]/90 via-[#2C1810]/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity"></div>
                <div className="absolute inset-0 shadow-[inset_0_0_40px_rgba(212,175,55,0.3)] pointer-events-none border border-white/10 rounded-[1.8rem]"></div>

                <div className="absolute bottom-0 left-0 w-full p-8 text-center">
                   <div className="mb-4 inline-flex items-center justify-center w-12 h-12 rounded-full bg-white/10 backdrop-blur-md border border-[#D4AF37]/50 text-[#D4AF37] shadow-lg group-hover:scale-110 transition-transform duration-500">
                      <TrendingUp className="w-6 h-6" />
                   </div>
                   <h3 className="text-3xl font-serif font-bold text-[#FDFBF7] mb-2 drop-shadow-md group-hover:text-[#D4AF37] transition-colors">
                     {trend.title}
                   </h3>
                   <p className="text-[#E5DCCA] font-medium text-sm tracking-wide uppercase">
                     {trend.subtitle}
                   </p>
                   
                   <div className="mt-6 opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500">
                      <Button className="h-10 px-6 rounded-full bg-white/20 hover:bg-white text-white hover:text-[#4A3526] backdrop-blur-md border border-white/30 font-serif text-sm">
                         Explore Collection <ArrowRight className="ml-2 w-4 h-4" />
                      </Button>
                   </div>
                </div>

              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
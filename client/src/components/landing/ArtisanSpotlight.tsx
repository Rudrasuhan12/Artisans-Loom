"use client";

import { Button } from "@/components/ui/button";
import { ArrowRight, Star } from "lucide-react";
import Image from "next/image";
import { RoyalDivider } from "@/components/ui/royal-divider";

const artisans = [
  {
    id: 1,
    name: "Karigar Amir Hussain",
    craft: "Master Brass Engraver, Moradabad",
    desc: "Renowned for his intricate brass engravings, Amir Hussain has honed his family craft for over 40 years.",
    image: "/avatar.png", 
  },
  {
    id: 2,
    name: "Lila Devi",
    craft: "Expert Pashmina Weaver, Kashmir",
    desc: "Weaving exquisite Pashmina shawls using centuries-old techniques passed down through generations.",
    image: "/avatar.png",
  },
  {
    id: 3,
    name: "Ravi Chitrakar",
    craft: "Pattachitra Artist, Odisha",
    desc: "A fifth-generation Pattachitra artist bringing mythological stories to life on canvas and cloth.",
    image: "/avatar.png",
  },
];

export default function ArtisanSpotlight() {
  return (
    <section className="relative w-full py-24 overflow-hidden bg-[#FDFBF7]">
      
      <div className="absolute inset-0 bg-linear-to-b from-[#FDFBF7] via-[#FFF8E7] to-[#F2E6D8]" />

      <div className="absolute top-[10%] left-[50%] -translate-x-1/2 w-[40vw] h-[40vw] bg-[#D4AF37]/10 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[10%] left-[10%] w-[30vw] h-[30vw] bg-[#D97742]/5 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="absolute top-0 left-0 w-full h-32 bg-linear-to-b from-[#FDFBF7] via-[#FDFBF7]/80 to-transparent z-10 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-full h-32 bg-linear-to-t from-[#FDFBF7] via-[#FDFBF7]/80 to-transparent z-10 pointer-events-none" />


      <div className="relative z-20 container mx-auto px-4 lg:px-8">

        <div className="text-center mb-16 space-y-4">

          <div className="flex justify-center">
             <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#FFFBF5] border border-[#D4AF37]/40 text-[#4A3526] text-xs lg:text-sm font-medium shadow-sm">
                <Star className="w-3.5 h-3.5 text-[#D4AF37] fill-[#D4AF37]" /> 
                <span>Featured Artisans</span>
             </div>
          </div>

          <h2 className="text-5xl md:text-6xl font-serif font-bold text-[#4A3526]">
            Meet the Masters Behind the <span className="bg-clip-text text-transparent bg-linear-to-r from-[#B8860B] via-[#FFD700] to-[#B8860B] animate-shine">Magic</span>
          </h2>
          <p className="text-[#5D4037] text-lg max-w-2xl mx-auto font-medium">
             Discover the incredible stories and heritage craftsmanship of India's most talented artists.
          </p>
          
          <div className="flex justify-center scale-100 mt-6">
            <RoyalDivider />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {artisans.map((artisan) => (
            <div key={artisan.id} className="group relative rounded-[20px] p-0.75 bg-linear-to-b from-[#F3E5AB] via-[#D4AF37] to-[#8B6508] shadow-xl hover:shadow-2xl hover:-translate-y-2 transition-all duration-500">

              <div className="relative h-full bg-[#FFFBF5] rounded-[18px] overflow-hidden flex flex-col items-center text-center p-6 border border-[#E5DCCA]">

                <div className="relative w-full aspect-4/3 rounded-xl overflow-hidden mb-6 border border-[#D4AF37]/30 shadow-inner group-hover:shadow-md transition-all">
                   <Image 
                     src={artisan.image} 
                     alt={artisan.name}
                     fill
                     className="object-cover transition-transform duration-1000 group-hover:scale-110 sepia-[.2] group-hover:sepia-0"
                   />
                   <div className="absolute inset-0 shadow-[inset_0_0_40px_rgba(74,53,38,0.2)] pointer-events-none"></div>
                </div>

                <h3 className="text-2xl font-serif font-bold text-[#4A3526] mb-2 group-hover:text-[#D97742] transition-colors">
                  {artisan.name}
                </h3>
                <p className="text-xs font-bold text-[#8C7B70] uppercase tracking-wider mb-4 border-b border-[#D4AF37]/30 pb-4 w-full">
                  {artisan.craft}
                </p>
                <p className="text-[#5D4037] text-sm leading-relaxed mb-6 px-2">
                  {artisan.desc}
                </p>

                <div className="mt-auto w-full p-0.5 rounded-lg bg-linear-to-r from-[#D4AF37] via-[#8B6508] to-[#D4AF37] opacity-80 group-hover:opacity-100 transition-opacity">
                   <Button className="w-full h-11 bg-[#2C1810] hover:bg-[#1a0f0a] text-[#FDFBF7] font-serif tracking-wide border-none relative overflow-hidden">
                      <span className="relative z-10 flex items-center justify-center gap-2">
                        View Profile <ArrowRight className="w-4 h-4 text-[#D4AF37]" />
                      </span>
                      <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                   </Button>
                </div>

                <div className="absolute top-3 left-3 w-4 h-4 border-t border-l border-[#D4AF37] rounded-tl-md opacity-50"></div>
                <div className="absolute top-3 right-3 w-4 h-4 border-t border-r border-[#D4AF37] rounded-tr-md opacity-50"></div>

              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-center">
           <div className="group relative rounded-full p-0.5 bg-linear-to-r from-[#F3E5AB] via-[#D4AF37] to-[#8B6508] shadow-xl hover:shadow-[#2F334F]/40 transition-shadow">
              <Button className="h-14 px-10 rounded-full bg-[#2F334F] hover:bg-[#1E2135] text-[#FDFBF7] text-lg font-serif font-medium border-none relative overflow-hidden">
                 <span className="relative z-10 flex items-center gap-3">
                    Discover All Artisans <ArrowRight className="w-5 h-5 text-[#D4AF37]" />
                 </span>
                 <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
              </Button>
           </div>
        </div>

      </div>
    </section>
  );
}
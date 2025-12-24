"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Camera, ArrowRight, Gift, Heart, Mic } from "lucide-react";
import Image from "next/image";
import { RoyalDivider } from "@/components/ui/royal-divider";

export default function HeroSection() {
  return (
    <section className="relative w-full h-screen overflow-hidden bg-[#FDFBF7] selection:bg-[#D4AF37] selection:text-white flex flex-col justify-between">

      <div className="absolute inset-0 bg-linear-to-br from-[#FFF8E7] via-[#FDFBF7] to-[#F2E6D8]" />
      <div className="absolute -top-[10%] -left-[10%] w-[40vw] h-[40vw] bg-[#D4AF37]/10 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute -bottom-[10%] -right-[10%] w-[35vw] h-[35vw] bg-[#D97742]/5 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="absolute top-[30%] left-[20%] w-[20vw] h-[20vw] bg-[#FFD700]/15 rounded-full blur-[80px] pointer-events-none animate-pulse"></div>
      <div className="absolute bottom-0 left-0 w-full h-32 bg-linear-to-t from-[#FDFBF7] via-[#FDFBF7]/80 to-transparent z-0 pointer-events-none" />
      <div className="relative z-10 container mx-auto px-4 lg:px-8 h-full flex flex-col">

        <header className="py-4 lg:py-6 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="relative w-10 h-10 lg:w-12 lg:h-12 rounded-full border-2 border-[#D4AF37] overflow-hidden shadow-sm bg-white">
              <Image src="/logo.png" alt="Logo" width={48} height={48} className="object-cover" />
            </div>
            <span className="font-serif text-xl lg:text-2xl font-bold text-[#4A3526] tracking-tight">
              The Artisan's Loom
            </span>
          </div>
          <nav className="hidden lg:flex items-center gap-8 text-[#4A3526] font-medium text-[15px]">
            {['Discover', 'Regions', 'Artisans', 'Stories', 'Auction'].map((item) => (
              <a key={item} href="#" className="hover:text-[#D97742] transition-colors relative group">
                {item}
                <span className="absolute -bottom-1 left-0 w-0 h-px bg-[#D97742] transition-all group-hover:w-full"></span>
              </a>
            ))}
          </nav>
          <div className="hidden md:flex items-center gap-3">
            <Button variant="outline" className="h-9 px-4 rounded-full border-[#D4AF37]/30 text-[#4A3526] hover:bg-white bg-white/40 backdrop-blur-sm text-sm">
              🌐 English
            </Button>
            <Button className="h-9 px-4 rounded-full bg-linear-to-r from-[#FFF9F0] to-[#FFF0E0] text-[#D97742] hover:shadow-md border border-[#FFE4CC] text-sm">
              <Gift className="w-3 h-3 mr-2" /> Gifting
            </Button>
            <div className="w-9 h-9 rounded-full bg-[#EBE5DA] flex items-center justify-center text-[#4A3526] cursor-pointer hover:bg-[#DDD5C5] transition border border-white/60">
               <span className="text-sm font-bold">👤</span>
            </div>
          </div>
        </header>

        <div className="hidden lg:block shrink-0 opacity-40 scale-75 -mt-2">
           <RoyalDivider />
        </div>

        <div className="flex-1 grid lg:grid-cols-12 gap-8 items-center min-h-0 pb-12 lg:pb-16"> 
          
          <div className="lg:col-span-6 flex flex-col justify-center space-y-5 lg:space-y-6">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-linear-to-r from-white/80 to-white/40 border border-[#D4AF37]/30 text-[#4A3526] text-xs lg:text-sm font-medium shadow-sm backdrop-blur-md">
                <span className="text-[#D97742] animate-spin-slow">✨</span> 
                <span>मिट्टी से | परम्परा हाट</span>
              </div>
            </div>

            <h1 className="text-5xl lg:text-6xl xl:text-[5rem] leading-[1.05] font-serif font-bold text-[#4A3526]">
              The Artisan’s <br/>
              <span className="bg-clip-text text-transparent bg-linear-to-r from-[#B8860B] via-[#FFFACD] to-[#B8860B] animate-shine bg-size-[200%_auto] drop-shadow-sm">
                Loom
              </span>
            </h1>

            <p className="text-base lg:text-lg text-[#5D4037] leading-relaxed max-w-lg font-medium">
              Empowering Indian artisans with AI-powered tools while connecting the world to authentic, handmade treasures.
            </p>

            <div className="relative max-w-lg shadow-[0_8px_30px_rgb(212,175,55,0.1)] rounded-full group w-full">
              <div className="absolute inset-0 bg-white/80 rounded-full border border-[#D4AF37]/30 transition-all group-hover:border-[#D4AF37] backdrop-blur-sm"></div>
              <Input 
                placeholder="Search for crafts, artisans..." 
                className="relative h-12 lg:h-14 pl-6 pr-24 rounded-full bg-transparent border-none text-base text-[#4A3526] placeholder:text-[#8C7B70]/80 focus-visible:ring-0"
              />
              <div className="absolute right-2 top-1 lg:top-1.5 flex gap-1">
                <Button size="icon" variant="ghost" className="h-10 w-10 rounded-full text-[#8C7B70] hover:bg-[#FBF7F2] hover:text-[#D97742]">
                  <Mic className="w-5 h-5" />
                </Button>
                <Button size="icon" variant="ghost" className="h-10 w-10 rounded-full text-[#8C7B70] hover:bg-[#FBF7F2] hover:text-[#D97742]">
                  <Camera className="w-5 h-5" />
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-xs lg:text-sm font-medium text-[#6D5D54]">
              {['Voice-powered listings', 'Regional discovery', 'Story-rich profiles', 'Multilingual support'].map((feat) => (
                <div key={feat} className="flex items-center gap-2 group cursor-default">
                  <Heart className="w-3.5 h-3.5 text-[#D4AF37] fill-[#D4AF37]" />
                  {feat}
                </div>
              ))}
            </div>

            <div className="flex flex-wrap gap-4 pt-3">
              <div className="group relative rounded-xl p-0.5 bg-linear-to-b from-[#F3E5AB] via-[#D4AF37] to-[#8B6508] shadow-xl hover:shadow-[#D97742]/40 transition-shadow duration-300">
                <Button className="relative h-12 lg:h-14 px-8 rounded-[10px] border-none text-white text-lg font-serif font-medium overflow-hidden bg-linear-to-b from-[#E68A53] to-[#C05621] shadow-[inset_0_1px_0_rgba(255,255,255,0.3)] hover:brightness-110 active:scale-95 transition-all">
                  <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]"></div>
                  <span className="relative z-10 drop-shadow-md">Discover Authentic Crafts</span>
                </Button>
              </div>
              
              <div className="group relative rounded-xl p-0.5 bg-linear-to-b from-[#F3E5AB] via-[#D4AF37] to-[#8B6508] shadow-xl hover:shadow-[#2F334F]/40 transition-shadow duration-300">
                <Button className="relative h-12 lg:h-14 px-8 rounded-[10px] border-none text-[#FDFBF7] text-lg font-serif font-medium overflow-hidden bg-linear-to-b from-[#3E4265] to-[#1A1D2E] shadow-[inset_0_1px_0_rgba(255,255,255,0.15)] hover:brightness-110 active:scale-95 transition-all">
                   <div className="absolute inset-0 opacity-30 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] animate-pulse"></div>
                   <span className="relative z-10 flex items-center gap-2 drop-shadow-md">
                      Join as Artisan <ArrowRight className="w-5 h-5 text-[#D4AF37]" />
                   </span>
                </Button>
              </div>
            </div>
          </div>

          <div className="hidden lg:flex lg:col-span-6 h-full items-center justify-end relative">
            <div className="relative w-full h-[85%] max-h-187.5 rounded-4xl overflow-hidden shadow-2xl shadow-[#4A3526]/10 border-[6px] border-white group">
               <Image 
                 src="/hero-image.jpg" 
                 alt="Artisan at work"
                 fill
                 className="object-cover transition-transform duration-1000 group-hover:scale-110"
                 priority
                 sizes="(max-width: 768px) 100vw, 50vw"
               />
               <div className="absolute inset-0 bg-linear-to-tr from-[#4A3526]/30 via-transparent to-[#FFF5E1]/20 mix-blend-overlay pointer-events-none"></div>
               <div className="absolute inset-0 shadow-[inset_0_0_80px_rgba(44,24,16,0.2)] pointer-events-none"></div>
            </div>
            <div className="absolute -z-10 bottom-20 -left-10 w-40 h-40 border border-[#D4AF37]/20 rounded-full animate-pulse"></div>
            <div className="absolute -z-10 top-20 -right-10 w-32 h-32 bg-[#D4AF37]/10 rounded-full blur-3xl"></div>
          </div>

        </div>
      </div>
    </section>
  );
}
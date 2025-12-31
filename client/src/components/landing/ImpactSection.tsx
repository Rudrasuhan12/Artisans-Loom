"use client";

import { Button } from "@/components/ui/button";
import { CheckCircle2 } from "lucide-react";
import Image from "next/image";
import { RoyalDivider } from "@/components/ui/royal-divider";
import { useEffect, useState, useRef } from "react";
import Link from "next/link";

function AnimatedCounter({ end, prefix = "", suffix = "" }: { end: number; prefix?: string; suffix?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          let start = 0;
          const duration = 2000;
          const increment = end / (duration / 16);
          const timer = setInterval(() => {
            start += increment;
            if (start >= end) {
              setCount(end);
              clearInterval(timer);
            } else {
              setCount(Math.ceil(start));
            }
          }, 16);
          return () => clearInterval(timer);
        } else {
          setCount(0);
        }
      },
      { threshold: 0.2 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [end]);

  return <span ref={ref}>{prefix}{count.toLocaleString()}{suffix}</span>;
}

export default function ImpactSection() {
  return (
    <section className="relative w-full py-24 overflow-hidden bg-[#FDFBF7]">

      <div className="absolute inset-0 bg-linear-to-b from-[#FDFBF7] via-[#FFF8E7] to-[#F2E6D8]" />

      <div className="absolute top-[40%] right-[5%] w-[45vw] h-[45vw] bg-[#D4AF37]/10 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[10%] left-[5%] w-[35vw] h-[35vw] bg-[#D97742]/5 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="absolute top-0 left-0 w-full h-32 bg-linear-to-b from-[#FDFBF7] via-[#FDFBF7]/80 to-transparent z-10 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-full h-32 bg-linear-to-t from-[#FDFBF7] via-[#FDFBF7]/80 to-transparent z-10 pointer-events-none" />


      <div className="relative z-20 container mx-auto px-4 lg:px-8">

        <div className="text-center mb-16 space-y-4">
          <h2 className="text-5xl md:text-6xl font-serif font-bold text-[#4A3526]">
            Stories Woven into <span className="bg-clip-text text-transparent bg-linear-to-r from-[#B8860B] via-[#FFD700] to-[#B8860B] animate-shine">Every Creation</span>
          </h2>
          <p className="text-[#5D4037] text-lg max-w-2xl mx-auto font-medium">
             Each product tells a unique story of heritage, craftsmanship, and the passionate artisan who created it.
          </p>
          
          <div className="flex justify-center scale-100 mt-6">
            <RoyalDivider />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-start">

          <div className="relative top-24"> 
             <div className="relative w-full aspect-4/3 rounded-4xl overflow-hidden border-[6px] border-white shadow-2xl shadow-[#D4AF37]/20 bg-[#2C1810]">
                <Image 
                  src="/p3.png"
                  alt="Raw Materials Texture"
                  fill
                  className="object-cover transition-transform duration-1000 hover:scale-105" 
                />

                <div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/40 to-transparent opacity-90"></div>

                <div className="absolute bottom-0 left-0 w-full p-8 md:p-10 flex flex-col items-start gap-4">

                   <p className="text-[#FFD700] font-bold uppercase tracking-widest text-sm font-sans mb-1">
                      Heritage Collection
                   </p>

                   <h3 className="text-4xl md:text-5xl font-serif font-bold text-white leading-tight drop-shadow-md">
                      Discover Authentic Handmade Treasures
                   </h3>
                   <p className="text-[#E5DCCA] text-base md:text-lg leading-relaxed max-w-md font-medium drop-shadow-sm">
                      From intricate textiles to stunning pottery, each piece carries the soul of traditional Indian craftsmanship.
                   </p>

                   <div className="pt-4">
                      <Link href="/shop">
                      <Button className="h-12 px-8 rounded-lg bg-[#FFFBF5] hover:bg-[#F2E6D8] text-[#2F334F] text-lg font-bold shadow-lg transition-transform active:scale-95">
                         Explore Collection
                      </Button>
                      </Link>
                   </div>
                </div>
             </div>
             
             <div className="absolute -z-10 -bottom-10 -left-10 w-64 h-64 bg-[#D4AF37]/20 rounded-full blur-3xl"></div>
          </div>

          <div className="space-y-12 pt-4">

             <div className="grid grid-cols-2 gap-5">
                {[
                   { val: 1200, prefix: "+", label: "Authentic Products" },
                   { val: 15, prefix: "", label: "Craft Categories" },
                   { val: 98, prefix: "", suffix: "%", label: "Customer Satisfaction" },
                   { val: 500, prefix: "+", label: "Happy Customers" }
                ].map((stat, i) => (
                   <div key={i} className="group relative p-0.5 rounded-xl bg-linear-to-b from-[#F3E5AB] via-[#D4AF37] to-[#8B6508] shadow-md hover:shadow-lg transition-all hover:-translate-y-1">
                      <div className="bg-[#FFFBF5] rounded-[10px] p-5 text-center h-full flex flex-col justify-center items-center border border-[#D4AF37]/20">
                         <h4 className="text-3xl lg:text-4xl font-serif font-bold text-[#4A3526] group-hover:text-[#D97742] transition-colors">
                            <AnimatedCounter end={stat.val} prefix={stat.prefix} suffix={stat.suffix} />
                         </h4>
                         <p className="text-[#8C7B70] text-[10px] md:text-xs font-bold uppercase tracking-wider mt-2">{stat.label}</p>
                      </div>
                      <div className="absolute top-0 right-0 w-8 h-8 bg-linear-to-bl from-white/40 to-transparent rounded-tr-xl pointer-events-none"></div>
                   </div>
                ))}
             </div>

             <div className="space-y-6">
                <h3 className="text-2xl font-serif font-bold text-[#4A3526]">
                   Why Choose Authentic Crafts?
                </h3>
                <ul className="space-y-5">
                   {[
                      "Each piece supports traditional artisan families directly.",
                      "Sustainable, eco-friendly materials and natural dyes.",
                      "Unique designs you won't find anywhere else.",
                      "Detailed stories about each artisan and technique."
                   ].map((item, i) => (
                      <li key={i} className="flex items-start gap-4 text-[#5D4037] text-base md:text-lg leading-relaxed group">
                         <div className="mt-1 w-6 h-6 rounded-full bg-[#FFFBF5] border border-[#D4AF37] flex items-center justify-center shrink-0 shadow-sm group-hover:bg-[#D4AF37] transition-colors">
                            <CheckCircle2 className="w-4 h-4 text-[#D97742] group-hover:text-white" />
                         </div>
                         {item}
                      </li>
                   ))}
                </ul>
             </div>

          </div>

        </div>

      </div>
    </section>
  );
}
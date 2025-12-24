"use client";

import { Button } from "@/components/ui/button";
import { ArrowRight, ShoppingCart, MapPin, Eye } from "lucide-react";
import Image from "next/image";
import { RoyalDivider } from "@/components/ui/royal-divider";
import { useEffect, useState, useRef } from "react";

const products = [
  { id: 1, region: "Uttar Pradesh", title: "Banarasi Silk Saree", artisan: "Ananya Devi", price: "$299", image: "/p1.png", avatar: "/avatar.png" },
  { id: 2, region: "Karnataka", title: "Bronze Ganesha Idol", artisan: "Ramesh Kulkarni", price: "$180", image: "/p2.png", avatar: "/avatar.png" },
  { id: 3, region: "Himachal Pradesh", title: "Kullu Wool Shawl", artisan: "Inder Singh", price: "$95", image: "/p3.png", avatar: "/avatar.png" },
  { id: 4, region: "Bihar", title: "Madhubani Painting", artisan: "Sita Das", price: "$120", image: "/p4.png", avatar: "/avatar.png" },
];

const stats = [
  { label: "Verified Artisans", value: 500, suffix: "+" },
  { label: "States Represented", value: 25, suffix: "" },
  { label: "Craft Traditions", value: 15, suffix: "+" },
];

function AnimatedCounter({ end, suffix }: { end: number; suffix: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);

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

  return <span ref={ref}>{count}{suffix}</span>;
}

export default function FeaturedSection() {
  return (
    <section className="relative w-full py-20 overflow-hidden bg-[#FDFBF7]">

      <div className="absolute inset-0 bg-linear-to-b from-[#FDFBF7] via-[#FFF8E7] to-[#F2E6D8]" />
      <div className="absolute top-[20%] -left-[10%] w-[40vw] h-[40vw] bg-[#D4AF37]/10 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[10%] -right-[10%] w-[35vw] h-[35vw] bg-[#D97742]/5 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 w-[50vw] h-[50vw] bg-white/40 blur-[100px] pointer-events-none rounded-full"></div>
      <div className="absolute bottom-0 left-0 w-full h-64 bg-linear-to-t from-[#FDFBF7] via-[#FDFBF7]/60 to-transparent z-10 pointer-events-none" />


      <div className="relative z-10 container mx-auto px-4 lg:px-8">
 
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20 relative z-20">
          {stats.map((stat, index) => (
            <div key={index} className="relative group">
              <div className="absolute inset-0 rounded-xl bg-linear-to-r from-[#F3E5AB] via-[#D4AF37] to-[#8B6508] opacity-60 blur-[1px] group-hover:opacity-100 transition-opacity"></div>
              <div className="relative h-full bg-[#FFFBF5]/80 backdrop-blur-md rounded-xl border border-[#D4AF37]/30 p-6 flex flex-col items-center justify-center text-center shadow-lg hover:-translate-y-1 transition-transform duration-300">
                <span className="text-4xl lg:text-5xl font-serif font-bold text-[#4A3526] mb-2 drop-shadow-sm min-w-30">
                  <AnimatedCounter end={stat.value} suffix={stat.suffix} />
                </span>
                <span className="text-[#8C7B70] font-medium uppercase tracking-widest text-xs lg:text-sm">
                  {stat.label}
                </span>
                <div className="absolute top-2 left-2 w-3 h-3 border-t border-l border-[#D4AF37]"></div>
                <div className="absolute top-2 right-2 w-3 h-3 border-t border-r border-[#D4AF37]"></div>
                <div className="absolute bottom-2 left-2 w-3 h-3 border-b border-l border-[#D4AF37]"></div>
                <div className="absolute bottom-2 right-2 w-3 h-3 border-b border-r border-[#D4AF37]"></div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mb-16 space-y-4">
          <h2 className="text-5xl md:text-6xl font-serif font-bold text-[#4A3526]">
            Discover Our Treasures
          </h2>
          <p className="text-[#5D4037] text-lg max-w-2xl mx-auto font-medium">
            Handpicked crafts from the heart of India, curated for you.
          </p>
          <div className="flex justify-center scale-100 mt-4">
            <RoyalDivider />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {products.map((product) => (
            <div key={product.id} className="group relative rounded-3xl p-0.75 bg-linear-to-b from-[#F3E5AB] via-[#D4AF37]/40 to-[#8B6508]/20 hover:from-[#FFD700] hover:via-[#D4AF37] hover:to-[#B8860B] transition-all duration-500 shadow-xl hover:shadow-2xl hover:-translate-y-2">
              <div className="relative h-full bg-[#FFFBF5] rounded-[1.3rem] overflow-hidden flex flex-col shadow-[inset_0_0_20px_rgba(212,175,55,0.05)]">
                <div className="relative h-60 w-full overflow-hidden border-b border-[#E5DCCA]">
                  <div className="absolute top-4 left-4 z-20">
                    <span className="inline-flex items-center gap-1 px-3 py-1.5 bg-[#2F334F]/90 backdrop-blur-md border border-[#D4AF37]/50 text-[#FDFBF7] font-sans text-xs font-semibold rounded-full shadow-md">
                      <MapPin className="w-3 h-3 text-[#D4AF37]" /> {product.region}
                    </span>
                  </div>
                  <Image src={product.image} alt={product.title} fill className="object-cover transition-transform duration-700 group-hover:scale-110" />
                  <div className="absolute inset-0 shadow-[inset_0_0_60px_rgba(74,53,38,0.2)]"></div>
                </div>
                <div className="absolute top-54 left-6 z-20">
                  <div className="w-14 h-14 rounded-full border-[3px] border-[#FFFBF5] shadow-lg p-0.5 bg-linear-to-br from-[#D4AF37] to-[#8B6508]">
                    <div className="relative w-full h-full rounded-full overflow-hidden bg-white">
                       <Image src={product.avatar} alt="artisan" fill className="object-cover" />
                    </div>
                  </div>
                </div>
                <div className="pt-9 pb-5 px-5 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-xl font-serif font-bold text-[#4A3526] mb-1 line-clamp-1">
                      {product.title}
                    </h3>
                    <p className="text-sm text-[#8C7B70] font-medium mb-3 ml-1">
                      By {product.artisan}
                    </p>
                    <div className="text-2xl font-bold text-[#D97742] mb-4 font-serif border-b border-[#E5DCCA] pb-3">
                      {product.price}
                    </div>
                  </div>
                  <div className="grid grid-cols-4 gap-2">
                    <div className="col-span-2 p-px rounded-lg bg-linear-to-r from-[#D4AF37] to-[#8B6508]">
                      <Button variant="ghost" className="w-full h-10 rounded-[7px] bg-[#FFFBF5] hover:bg-[#FFF5E1] text-[#4A3526] font-medium text-xs border-none flex items-center gap-1 justify-center">
                        <Eye className="w-3.5 h-3.5" /> Details
                      </Button>
                    </div>
                    <div className="col-span-2 p-px rounded-lg bg-linear-to-b from-[#F3E5AB] to-[#8B6508]">
                      <Button className="w-full h-10 rounded-[7px] bg-[#2F334F] hover:bg-[#1E2135] text-[#FDFBF7] font-medium text-xs border-none shadow-inner">
                        Buy Now
                      </Button>
                    </div>
                  </div>
                  <div className="mt-2 p-px rounded-lg bg-linear-to-r from-[#D4AF37]/50 to-[#8B6508]/50">
                     <Button className="w-full h-9 rounded-[7px] bg-white hover:bg-[#FDFBF7] text-[#D97742] font-medium text-xs border-none shadow-sm flex items-center justify-center gap-2">
                         <ShoppingCart className="w-4 h-4" /> Add to Cart
                     </Button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 text-center">
            <div className="inline-block p-0.5 rounded-full bg-linear-to-r from-transparent via-[#D4AF37] to-transparent">
                <Button variant="ghost" className="h-12 px-8 rounded-full text-lg font-medium text-[#4A3526] hover:bg-[#D4AF37]/10 border border-[#D4AF37]/50 hover:border-[#D4AF37] transition-all">
                    Browse All Products <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
            </div>
        </div>

      </div>
    </section>
  );
}
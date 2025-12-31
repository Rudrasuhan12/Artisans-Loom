import { Button } from "@/components/ui/button";
import { ArrowRight, Flame } from "lucide-react";
import { RoyalDivider } from "@/components/ui/royal-divider";
import Link from "next/link";
import { getTrendingProducts } from "@/app/actions/trending";
import TrendingCard from "@/components/trending/TrendingCard";

export default async function TrendingSection() {
  const trendingProducts = await getTrendingProducts("week", 3);

  return (
    <section className="relative w-full py-24 overflow-hidden bg-[#FDFBF7]">
      
      <div className="absolute inset-0 bg-linear-to-b from-[#FDFBF7] via-[#F2E6D8] to-[#FDFBF7]" />
      <div className="absolute top-[20%] right-[10%] w-[35vw] h-[35vw] bg-[#D4AF37]/10 rounded-full blur-[120px] pointer-events-none animate-pulse"></div>
      <div className="absolute bottom-[20%] left-[10%] w-[40vw] h-[40vw] bg-[#D97742]/5 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="relative z-10 container mx-auto px-4 lg:px-8">

        <div className="text-center mb-16 space-y-4">
          <div className="flex justify-center">
             <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/60 border border-[#D4AF37]/30 text-[#4A3526] text-xs lg:text-sm font-medium shadow-sm backdrop-blur-md">
                <Flame className="w-4 h-4 text-[#D97742] fill-[#D97742]" /> 
                <span>Top Picks of the Week</span>
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
          {trendingProducts.map((product: any, idx: number) => (
             <TrendingCard 
               key={product.id}
               id={product.id}
               title={product.title}
               category={product.category}
               price={product.price}
               image={product.images[0] || "/p1.png"}
               index={idx}
             />
          ))}
        </div>

        <div className="mt-16 text-center">
            <Link href="/trending">
              <Button className="h-14 px-10 rounded-full bg-[#2F334F] hover:bg-[#1E2135] text-[#D4AF37] text-lg font-serif font-bold shadow-lg transition-transform active:scale-95">
                  View All Trending <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
        </div>

      </div>
    </section>
  );
}
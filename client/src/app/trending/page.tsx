import { getTrendingProducts, TimeRange } from "@/app/actions/trending";
import TrendingCard from "@/components/trending/TrendingCard";
import BackButton from "@/components/dashboard/BackButton";
import { RoyalDivider } from "@/components/ui/royal-divider";
import TrendingFilters from "@/components/trending/TrendingFilters";
import { Flame } from "lucide-react";

export const dynamic = 'force-dynamic';

export default async function TrendingPage({ searchParams }: { searchParams: Promise<{ range?: string }> }) {
  const { range } = await searchParams;
  const selectedRange = (range as TimeRange) || "week";
  const products = await getTrendingProducts(selectedRange, 20);

  return (
    <div className="min-h-screen bg-[#FDFBF7] relative pb-20">
      
      <div className="absolute top-0 left-0 w-full h-[50vh] bg-linear-to-b from-[#FFF0E0] to-transparent pointer-events-none"></div>

      <div className="relative z-10 container mx-auto px-4 py-16">

        <div className="text-center mb-12">
          <div className="flex justify-center mb-4">
             <div className="w-16 h-16 bg-[#FFF5E1] rounded-full flex items-center justify-center border border-[#D4AF37]/30 shadow-sm">
                <Flame className="w-8 h-8 text-[#D97742] fill-[#D97742]" />
             </div>
          </div>
          <h1 className="text-5xl md:text-6xl font-serif font-bold text-[#4A3526]">
            Most Loved Treasures
          </h1>
          <p className="text-[#8C7B70] text-lg mt-3">
             Discover what the world is cherishing right now.
          </p>
          <div className="flex justify-center scale-100 pt-4"><RoyalDivider /></div>
        </div>

        <TrendingFilters />

        {products.length === 0 ? (
           <div className="text-center py-20 opacity-60">
              <p className="text-[#8C7B70] text-lg font-medium">No trending data available for this period yet.</p>
           </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map((product: any, idx: number) => (
              <TrendingCard 
                key={product.id} 
                id={product.id}
                index={idx}
                title={product.title}
                category={product.category}
                price={product.price}
                image={product.images[0] || "/p1.png"}
              />
            ))}
          </div>
        )}

      </div>
      <BackButton />
    </div>
  );
}
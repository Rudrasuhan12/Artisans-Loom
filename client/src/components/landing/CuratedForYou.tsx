"use client";

import { Button } from "@/components/ui/button";
import { ArrowRight, ShoppingCart, MapPin, Eye, Sparkles, RefreshCw } from "lucide-react";
import Image from "next/image";
import { RoyalDivider } from "@/components/ui/royal-divider";
import { useEffect, useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCartStore } from "@/store/useCartStore";
import { toast } from "sonner";
import { getPersonalizedRecommendations } from "@/app/actions/personalization";
import { motion, AnimatePresence } from "framer-motion";

interface Product {
  id: string;
  title: string;
  price: number;
  images: string[];
  category: string;
  artisan: {
    name: string | null;
    profile: {
      state: string | null;
    } | null;
  };
}

interface PersonalizationResult {
  products: Product[];
  isPersonalized: boolean;
  reasoning: string;
  recommendedCategories?: string[];
  recommendedTags?: string[];
}

export default function CuratedForYou() {
  const router = useRouter();
  const { addToCart, clearCart, setIsOpen } = useCartStore();
  const [data, setData] = useState<PersonalizationResult | null>(null);
  const [isPending, startTransition] = useTransition();
  const [isLoading, setIsLoading] = useState(true);

  const fetchRecommendations = () => {
    startTransition(async () => {
      try {
        const result = await getPersonalizedRecommendations(8);
        setData(result as PersonalizationResult);
      } catch (error) {
        console.error("Failed to fetch recommendations:", error);
      } finally {
        setIsLoading(false);
      }
    });
  };

  useEffect(() => {
    fetchRecommendations();
  }, []);

  const handleAddToCart = (product: Product) => {
    addToCart({
      id: product.id,
      title: product.title,
      price: product.price,
      image: product.images?.[0] || "/p1.png",
      quantity: 1,
    });
    toast.success(`${product.title} added to cart!`);
  };

  const handleBuyNow = (product: Product) => {
    clearCart();
    addToCart({
      id: product.id,
      title: product.title,
      price: product.price,
      image: product.images?.[0] || "/p1.png",
      quantity: 1,
    });
    setIsOpen(false);
    router.push("/checkout");
  };

  const handleRefresh = () => {
    setIsLoading(true);
    fetchRecommendations();
  };

  if (isLoading) {
    return (
      <section className="relative w-full py-20 overflow-hidden bg-[#FDFBF7]">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center mb-16 space-y-4">
            <div className="flex items-center justify-center gap-3 mb-2">
              <Sparkles className="w-6 h-6 text-[#D4AF37] animate-pulse" />
              <h2 className="text-5xl md:text-6xl font-serif font-bold text-[#4A3526]">
                Curated For You
              </h2>
              <Sparkles className="w-6 h-6 text-[#D4AF37] animate-pulse" />
            </div>
            <div className="flex justify-center scale-100 mt-4">
              <RoyalDivider />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="rounded-3xl bg-[#E5DCCA]/50 animate-pulse h-[420px]" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (!data || data.products.length === 0) {
    return null;
  }

  // Only show "Curated For You" section when recommendations are actually personalized
  // If user has no history, this section won't appear (they'll see FeaturedSection instead)
  if (!data.isPersonalized) {
    return null;
  }

  return (
    <section className="relative w-full py-20 overflow-hidden bg-gradient-to-b from-[#FDFBF7] via-[#FFF8E7] to-[#FDFBF7]">
      {/* Decorative Background Elements */}
      <div className="absolute top-[10%] -right-[10%] w-[40vw] h-[40vw] bg-[#D4AF37]/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[20%] -left-[10%] w-[35vw] h-[35vw] bg-[#6B4423]/5 rounded-full blur-[100px] pointer-events-none" />
      
      {/* Sparkle Decorations */}
      <div className="absolute top-20 left-[10%] w-2 h-2 bg-[#D4AF37] rounded-full animate-ping" />
      <div className="absolute top-40 right-[15%] w-1.5 h-1.5 bg-[#D4AF37] rounded-full animate-ping delay-300" />
      <div className="absolute bottom-32 left-[20%] w-2 h-2 bg-[#D4AF37] rounded-full animate-ping delay-500" />

      <div className="relative z-10 container mx-auto px-4 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12 space-y-4">
          <div className="flex items-center justify-center gap-3 mb-2">
            <Sparkles className="w-6 h-6 text-[#D4AF37]" />
            <h2 className="text-5xl md:text-6xl font-serif font-bold text-[#4A3526]">
              Curated For You
            </h2>
            <Sparkles className="w-6 h-6 text-[#D4AF37]" />
          </div>

          <div className="flex items-center justify-center gap-2">
            {data.isPersonalized && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#D4AF37]/10 border border-[#D4AF37]/30 rounded-full text-sm text-[#4A3526]">
                <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
                AI Personalized
              </span>
            )}
          </div>

          <p className="text-[#5D4037] text-lg max-w-2xl mx-auto font-medium">
            {data.reasoning}
          </p>

          {/* Recommended Tags */}
          {data.isPersonalized && data.recommendedTags && data.recommendedTags.length > 0 && (
            <div className="flex flex-wrap items-center justify-center gap-2 mt-4">
              {data.recommendedTags.slice(0, 5).map((tag, index) => (
                <Link
                  key={index}
                  href={`/shop?q=${encodeURIComponent(tag)}`}
                  className="px-3 py-1 bg-white border border-[#E5DCCA] hover:border-[#D4AF37] rounded-full text-sm text-[#8C7B70] hover:text-[#4A3526] transition-colors cursor-pointer"
                >
                  {tag}
                </Link>
              ))}
            </div>
          )}

          <div className="flex justify-center scale-100 mt-4">
            <RoyalDivider />
          </div>
        </div>

        {/* Product Grid */}
        <AnimatePresence mode="wait">
          <motion.div
            key={data.products.map((p) => p.id).join(",")}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
          >
            {data.products.slice(0, 8).map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="group relative rounded-3xl p-0.75 bg-gradient-to-b from-[#F3E5AB] via-[#D4AF37]/40 to-[#8B6508]/20 hover:from-[#FFD700] hover:via-[#D4AF37] hover:to-[#B8860B] transition-all duration-500 shadow-xl hover:shadow-2xl hover:-translate-y-2"
              >
                <div className="relative h-full bg-[#FFFBF5] rounded-[1.3rem] overflow-hidden flex flex-col shadow-[inset_0_0_20px_rgba(212,175,55,0.05)]">
                  {/* Image Container */}
                  <div className="relative h-60 w-full overflow-hidden border-b border-[#E5DCCA]">
                    {/* Category Badge */}
                    <div className="absolute top-4 left-4 z-20">
                      <span className="inline-flex items-center gap-1 px-3 py-1.5 bg-[#2F334F]/90 backdrop-blur-md border border-[#D4AF37]/50 text-[#FDFBF7] font-sans text-xs font-semibold rounded-full shadow-md">
                        <MapPin className="w-3 h-3 text-[#D4AF37]" /> {product.category || "India"}
                      </span>
                    </div>

                    {/* AI Picked Badge */}
                    {data.isPersonalized && (
                      <div className="absolute top-4 right-4 z-20">
                        <span className="inline-flex items-center gap-1 px-2 py-1 bg-[#D4AF37]/90 backdrop-blur-md text-[#2F334F] font-sans text-[10px] font-bold rounded-full shadow-md">
                          <Sparkles className="w-2.5 h-2.5" /> AI Pick
                        </span>
                      </div>
                    )}

                    <Image
                      src={product.images?.[0] || "/p1.png"}
                      alt={product.title}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 shadow-[inset_0_0_60px_rgba(74,53,38,0.2)]" />
                  </div>

                  {/* Content */}
                  <div className="pt-9 pb-5 px-5 flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="text-xl font-serif font-bold text-[#4A3526] mb-1 line-clamp-1">
                        {product.title}
                      </h3>
                      <p className="text-sm text-[#8C7B70] font-medium mb-3 ml-1">
                        By {product.artisan?.name || "Local Artisan"}
                      </p>
                      <div className="text-2xl font-bold text-[#D97742] mb-4 font-serif border-b border-[#E5DCCA] pb-3">
                        ₹{product.price.toLocaleString()}
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="grid grid-cols-4 gap-2">
                      <div className="col-span-2 p-px rounded-lg bg-gradient-to-r from-[#D4AF37] to-[#8B6508]">
                        <Link href={`/shop/${product.id}`} className="block w-full">
                          <Button
                            variant="ghost"
                            className="w-full h-10 rounded-[7px] bg-[#FFFBF5] hover:bg-[#FFF5E1] text-[#4A3526] font-medium text-xs border-none flex items-center gap-1 justify-center"
                          >
                            <Eye className="w-3.5 h-3.5" /> Details
                          </Button>
                        </Link>
                      </div>
                      <div className="col-span-2 p-px rounded-lg bg-gradient-to-b from-[#F3E5AB] to-[#8B6508]">
                        <Button
                          onClick={() => handleBuyNow(product)}
                          className="w-full h-10 rounded-[7px] bg-[#2F334F] hover:bg-[#1E2135] text-[#FDFBF7] font-medium text-xs border-none shadow-inner"
                        >
                          Buy Now
                        </Button>
                      </div>
                    </div>
                    <div className="mt-2 p-px rounded-lg bg-gradient-to-r from-[#D4AF37]/50 to-[#8B6508]/50">
                      <Button
                        onClick={() => handleAddToCart(product)}
                        className="w-full h-9 rounded-[7px] bg-white hover:bg-[#FDFBF7] text-[#D97742] font-medium text-xs border-none shadow-sm flex items-center justify-center gap-2"
                      >
                        <ShoppingCart className="w-4 h-4" /> Add to Cart
                      </Button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>

        {/* Footer Actions */}
        <div className="mt-16 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button
            onClick={handleRefresh}
            disabled={isPending}
            variant="ghost"
            className="h-11 px-6 rounded-full text-sm font-medium text-[#8C7B70] hover:text-[#4A3526] hover:bg-[#E5DCCA]/30 border border-[#E5DCCA] hover:border-[#D4AF37]/50 transition-all flex items-center gap-2"
          >
            <RefreshCw className={`w-4 h-4 ${isPending ? "animate-spin" : ""}`} />
            Refresh Recommendations
          </Button>

          <div className="inline-block p-0.5 rounded-full bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent">
            <Link href="/shop">
              <Button
                variant="ghost"
                className="h-12 px-8 rounded-full text-lg font-medium text-[#4A3526] hover:bg-[#D4AF37]/10 border border-[#D4AF37]/50 hover:border-[#D4AF37] transition-all"
              >
                Explore All Products <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

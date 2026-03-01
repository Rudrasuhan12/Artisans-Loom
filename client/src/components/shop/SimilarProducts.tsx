"use client";

import { useEffect, useState, useTransition } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Sparkles, Eye, ShoppingCart, MapPin, Loader2 } from "lucide-react";
import { useCartStore } from "@/store/useCartStore";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { motion } from "framer-motion";

interface Product {
  id: string;
  title: string;
  price: number;
  images: string[];
  category: string;
  similarity?: number;
  artisan: {
    name: string | null;
    profile: {
      state: string | null;
    } | null;
  } | null;
}

interface SimilarProductsProps {
  productId: string;
  currentCategory: string;
  currentMaterials: string[];
}

export default function SimilarProducts({
  productId,
  currentCategory,
  currentMaterials,
}: SimilarProductsProps) {
  const router = useRouter();
  const { addToCart, clearCart, setIsOpen } = useCartStore();
  const [products, setProducts] = useState<Product[]>([]);
  const [isPending, startTransition] = useTransition();
  const [isLoading, setIsLoading] = useState(true);
  const [usesSemantic, setUsesSemantic] = useState(false);

  useEffect(() => {
    const fetchSimilarProducts = async () => {
      startTransition(async () => {
        try {
          // Try semantic search first
          const { findSimilarProducts } = await import(
            "@/app/actions/embeddings"
          );
          const semanticResults = await findSimilarProducts(productId, 4);

          if (semanticResults && semanticResults.length > 0) {
            setProducts(semanticResults as Product[]);
            setUsesSemantic(true);
            setIsLoading(false);
            return;
          }
        } catch (error) {
          console.log("Semantic search unavailable, using category fallback");
        }

        // Fallback to category-based similar products
        try {
          const response = await fetch(`/api/products/similar?id=${productId}&category=${encodeURIComponent(currentCategory)}&materials=${encodeURIComponent(currentMaterials.join(","))}`);
          if (response.ok) {
            const data = await response.json();
            setProducts(data.products || []);
          }
        } catch (error) {
          console.error("Failed to fetch similar products:", error);
        }
        
        setIsLoading(false);
      });
    };

    fetchSimilarProducts();
  }, [productId, currentCategory, currentMaterials]);

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

  if (isLoading) {
    return (
      <div className="mt-20">
        <div className="flex items-center justify-center gap-3 mb-8">
          <Sparkles className="w-5 h-5 text-[#D4AF37]" />
          <h2 className="text-3xl font-serif font-bold text-[#4A3526]">
            You May Also Like
          </h2>
          <Sparkles className="w-5 h-5 text-[#D4AF37]" />
        </div>
        <div className="flex justify-center">
          <Loader2 className="w-8 h-8 text-[#D4AF37] animate-spin" />
        </div>
      </div>
    );
  }

  if (products.length === 0) {
    return null;
  }

  return (
    <div className="mt-20">
      <div className="flex items-center justify-center gap-3 mb-2">
        <Sparkles className="w-5 h-5 text-[#D4AF37]" />
        <h2 className="text-3xl font-serif font-bold text-[#4A3526]">
          You May Also Like
        </h2>
        <Sparkles className="w-5 h-5 text-[#D4AF37]" />
      </div>

      {usesSemantic && (
        <p className="text-center text-sm text-[#8C7B70] mb-8">
          AI-powered recommendations based on style and craftsmanship
        </p>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {products.map((product, index) => (
          <motion.div
            key={product.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="group relative rounded-2xl p-0.5 bg-gradient-to-b from-[#F3E5AB]/50 via-[#D4AF37]/20 to-transparent hover:from-[#D4AF37]/60 hover:via-[#D4AF37]/30 transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-1"
          >
            <div className="relative h-full bg-[#FFFBF5] rounded-[0.9rem] overflow-hidden flex flex-col">
              {/* Image */}
              <div className="relative h-48 w-full overflow-hidden">
                {/* Category Badge */}
                <div className="absolute top-3 left-3 z-20">
                  <span className="inline-flex items-center gap-1 px-2 py-1 bg-[#2F334F]/80 backdrop-blur-sm border border-[#D4AF37]/30 text-[#FDFBF7] font-sans text-[10px] font-semibold rounded-full">
                    <MapPin className="w-2.5 h-2.5 text-[#D4AF37]" /> {product.category}
                  </span>
                </div>

                {/* Similarity Badge */}
                {usesSemantic && product.similarity && (
                  <div className="absolute top-3 right-3 z-20">
                    <span className="inline-flex items-center gap-1 px-2 py-1 bg-[#D4AF37]/90 text-[#2F334F] text-[10px] font-bold rounded-full">
                      {Math.round(product.similarity * 100)}% Match
                    </span>
                  </div>
                )}

                <Image
                  src={product.images?.[0] || "/p1.png"}
                  alt={product.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>

              {/* Content */}
              <div className="p-4 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-lg font-serif font-bold text-[#4A3526] mb-1 line-clamp-1">
                    {product.title}
                  </h3>
                  <p className="text-xs text-[#8C7B70] mb-2">
                    By {product.artisan?.name || "Local Artisan"}
                  </p>
                  <div className="text-xl font-bold text-[#D97742] font-serif">
                    ₹{product.price.toLocaleString()}
                  </div>
                </div>

                {/* Actions */}
                <div className="grid grid-cols-2 gap-2 mt-4">
                  <Link href={`/shop/${product.id}`} className="block">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-full h-8 rounded-lg bg-white hover:bg-[#FFF5E1] text-[#4A3526] text-xs border border-[#E5DCCA] hover:border-[#D4AF37]"
                    >
                      <Eye className="w-3 h-3 mr-1" /> View
                    </Button>
                  </Link>
                  <Button
                    size="sm"
                    onClick={() => handleAddToCart(product)}
                    className="w-full h-8 rounded-lg bg-[#2F334F] hover:bg-[#1E2135] text-white text-xs"
                  >
                    <ShoppingCart className="w-3 h-3 mr-1" /> Add
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="mt-8 text-center">
        <Link href={`/shop?category=${encodeURIComponent(currentCategory)}`}>
          <Button
            variant="ghost"
            className="text-[#D4AF37] hover:text-[#B8860B] hover:bg-[#D4AF37]/5 font-medium"
          >
            Browse More {currentCategory} →
          </Button>
        </Link>
      </div>
    </div>
  );
}

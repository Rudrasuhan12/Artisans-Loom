"use client";

import { useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Sparkles, TrendingUp } from "lucide-react";
import { motion } from "framer-motion";
import { getQuickRecommendedTags } from "@/app/actions/personalization";

interface RecommendedTagsProps {
  onTagClick?: (tag: string) => void;
}

export default function RecommendedTags({ onTagClick }: RecommendedTagsProps) {
  const router = useRouter();
  const [tags, setTags] = useState<string[]>([]);
  const [isPending, startTransition] = useTransition();
  const [isLoading, setIsLoading] = useState(true);
  const [isPersonalized, setIsPersonalized] = useState(false);

  useEffect(() => {
    startTransition(async () => {
      try {
        const recommendedTags = await getQuickRecommendedTags();
        setTags(recommendedTags);
        // If tags are different from default, they're personalized
        const defaultTags = ["handcrafted", "traditional", "silk", "brass", "wooden"];
        setIsPersonalized(
          JSON.stringify(recommendedTags.sort()) !== JSON.stringify(defaultTags.sort())
        );
      } catch (error) {
        console.error("Failed to fetch recommended tags:", error);
        setTags(["handcrafted", "traditional", "silk", "brass", "wooden"]);
      } finally {
        setIsLoading(false);
      }
    });
  }, []);

  const handleTagClick = (tag: string) => {
    if (onTagClick) {
      onTagClick(tag);
    } else {
      router.push(`/shop?q=${encodeURIComponent(tag)}`);
    }
  };

  if (isLoading || tags.length === 0) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-wrap items-center gap-2 mb-6"
    >
      <div className="flex items-center gap-1.5 text-[#8C7B70] text-sm mr-2">
        {isPersonalized ? (
          <>
            <Sparkles className="w-4 h-4 text-[#D4AF37]" />
            <span className="font-medium">For You:</span>
          </>
        ) : (
          <>
            <TrendingUp className="w-4 h-4 text-[#D4AF37]" />
            <span className="font-medium">Popular:</span>
          </>
        )}
      </div>
      
      {tags.map((tag, index) => (
        <motion.button
          key={tag}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: index * 0.05 }}
          onClick={() => handleTagClick(tag)}
          className="px-3 py-1.5 bg-white hover:bg-[#FFF5E1] border border-[#E5DCCA] hover:border-[#D4AF37] rounded-full text-sm text-[#5D4037] hover:text-[#4A3526] transition-all cursor-pointer shadow-sm hover:shadow"
        >
          {tag}
        </motion.button>
      ))}

      {isPersonalized && (
        <span className="ml-2 px-2 py-0.5 bg-[#D4AF37]/10 border border-[#D4AF37]/20 rounded-full text-[10px] font-semibold text-[#D4AF37] uppercase tracking-wider">
          AI Picks
        </span>
      )}
    </motion.div>
  );
}

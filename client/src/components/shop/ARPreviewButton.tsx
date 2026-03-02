"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ScanEye } from "lucide-react";
import dynamic from "next/dynamic";

// Dynamic import to avoid SSR issues with camera APIs
const ARPreview = dynamic(() => import("@/components/shop/ARPreview"), {
  ssr: false,
});

interface ARPreviewButtonProps {
  productImage: string;
  productTitle: string;
  category: string;
}

export default function ARPreviewButton({
  productImage,
  productTitle,
  category,
}: ARPreviewButtonProps) {
  const [showAR, setShowAR] = useState(false);

  // Only show for applicable categories
  const applicableCategories = [
    "home decor", "textiles", "paintings", "pottery", 
    "rug", "carpet", "wall", "art", "decor", "tapestry",
    "sculpture", "metalwork", "woodwork", "stone carving"
  ];

  const isApplicable = applicableCategories.some((cat) =>
    category.toLowerCase().includes(cat)
  ) || true; // Show for all products but hint it works best for decor

  if (!isApplicable) return null;

  return (
    <>
      <Button
        onClick={() => setShowAR(true)}
        variant="outline"
        className="h-12 rounded-xl border-[#D4AF37] text-[#D4AF37] hover:bg-[#D4AF37]/10 font-serif flex items-center gap-2"
      >
        <ScanEye className="w-5 h-5" />
        View in Your Room
      </Button>

      {showAR && (
        <ARPreview
          productImage={productImage}
          productTitle={productTitle}
          category={category}
          onClose={() => setShowAR(false)}
        />
      )}
    </>
  );
}

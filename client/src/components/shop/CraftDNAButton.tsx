"use client";

import { useState } from "react";
import { Fingerprint, X } from "lucide-react";
import Link from "next/link";
import CraftDNAQR from "./CraftDNAQR";

interface CraftDNAButtonProps {
  productId: string;
  productTitle: string;
}

export default function CraftDNAButton({
  productId,
  productTitle,
}: CraftDNAButtonProps) {
  const [showQR, setShowQR] = useState(false);

  return (
    <>
      <button
        onClick={() => setShowQR(true)}
        className="group flex items-center gap-3 w-full px-5 py-3 rounded-2xl border-2 border-dashed border-[#D4AF37]/40 bg-[#D4AF37]/5 hover:border-[#D4AF37] hover:bg-[#D4AF37]/10 transition-all text-left cursor-pointer"
      >
        <div className="w-10 h-10 rounded-full bg-[#D4AF37]/10 flex items-center justify-center group-hover:bg-[#D4AF37]/20 transition-colors">
          <Fingerprint className="w-5 h-5 text-[#D4AF37]" />
        </div>
        <div>
          <p className="text-sm font-bold text-[#4A3526]">Craft DNA</p>
          <p className="text-xs text-[#8C7B70]">
            View product passport &amp; origin story
          </p>
        </div>
      </button>

      {/* QR Popup */}
      {showQR && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
          onClick={() => setShowQR(false)}
        >
          <div
            className="bg-white rounded-3xl shadow-2xl max-w-sm w-full p-8 relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setShowQR(false)}
              className="absolute top-4 right-4 p-1.5 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4 text-gray-500" />
            </button>
            <div className="text-center space-y-5">
              <div className="inline-flex items-center gap-2 text-[#D4AF37] text-xs font-bold uppercase tracking-widest">
                <Fingerprint className="w-4 h-4" />
                Craft DNA
              </div>
              <h3 className="text-lg font-serif font-bold text-[#4A3526]">
                {productTitle}
              </h3>
              <div className="flex justify-center">
                <CraftDNAQR productId={productId} size={180} />
              </div>
              <p className="text-xs text-[#8C7B70]">
                Scan this QR code to view the full product passport &mdash;
                artisan, origin, materials & techniques.
              </p>
              <Link
                href={`/craft-dna/${productId}`}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#D4AF37] text-white rounded-full text-sm font-bold hover:bg-[#b8962e] transition-colors"
              >
                <Fingerprint className="w-4 h-4" />
                View Full Passport
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

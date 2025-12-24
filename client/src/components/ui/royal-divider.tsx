import React from 'react';
import { cn } from "@/lib/utils";

export function RoyalDivider({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center justify-center w-full gap-4 py-8 opacity-80", className)}>
      <div className="h-px w-12 md:w-32 bg-linear-to-r from-transparent via-[#D4AF37] to-[#D4AF37]"></div>

      <div className="relative flex items-center justify-center">
        <div className="w-2 h-2 bg-[#D4AF37] rotate-45 transform"></div>
        <div className="absolute w-6 h-6 border border-[#D4AF37]/40 rotate-45 transform"></div>
      </div>

      <div className="h-px w-12 md:w-32 bg-linear-to-l from-transparent via-[#D4AF37] to-[#D4AF37]"></div>
    </div>
  );
}
"use client";
import Image, { ImageProps } from "next/image";
import { useState } from "react";
import { ImageOff, Loader2 } from "lucide-react";

export default function SafeImage(props: ImageProps) {
  const [error, setError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center w-full h-full bg-[#FFFBF5] text-[#D4AF37] p-4 text-center">
        <ImageOff className="w-8 h-8 mb-2 opacity-50" />
        <span className="text-[10px] font-bold uppercase tracking-widest opacity-50">
          Image Unavailable
        </span>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full">
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-[#F3E5AB]/20 z-0">
           <Loader2 className="w-6 h-6 text-[#D4AF37] animate-spin" />
        </div>
      )}
      <Image 
        {...props} 
        alt={props.alt || "Image"}
        onError={() => {
          setError(true);
          setIsLoading(false);
        }}
        onLoad={() => setIsLoading(false)}
        unoptimized={true} 
      />
    </div>
  );
}
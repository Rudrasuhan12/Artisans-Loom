"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

export default function PremiumAvatar({ src, name, size = "md", className }: { src?: string | null, name: string, size?: "sm" | "md" | "lg" | "xl", className?: string }) {
  const sizeClasses = {
    sm: "w-8 h-8 text-xs",
    md: "w-12 h-12 text-sm",
    lg: "w-24 h-24 text-2xl",
    xl: "w-40 h-40 text-4xl"
  };

  const initials = name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <Avatar className={cn(sizeClasses[size], "border-2 border-[#D4AF37]/20 shadow-xl", className)}>
      <AvatarImage src={src || ""} className="object-cover" />
      <AvatarFallback className="bg-linear-to-br from-[#FFF5E1] to-[#F3E5AB] text-[#4A3526] font-serif font-bold tracking-widest flex items-center justify-center">
        {initials}
      </AvatarFallback>
    </Avatar>
  );
}
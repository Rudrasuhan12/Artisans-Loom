"use client";

import { BadgeCheck, Crown, Shield } from "lucide-react";
import { motion } from "framer-motion";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface VerifiedBadgeProps {
  size?: "sm" | "md" | "lg";
  variant?: "default" | "gold" | "crown";
  showTooltip?: boolean;
  className?: string;
}

const sizeMap = {
  sm: "w-3.5 h-3.5",
  md: "w-4 h-4",
  lg: "w-5 h-5",
};

const badgeSizeMap = {
  sm: "p-0.5",
  md: "p-1",
  lg: "p-1.5",
};

export default function VerifiedBadge({
  size = "md",
  variant = "default",
  showTooltip = true,
  className = "",
}: VerifiedBadgeProps) {
  const iconSize = sizeMap[size];
  const badgePadding = badgeSizeMap[size];

  const Badge = () => {
    if (variant === "crown") {
      return (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className={`inline-flex items-center justify-center ${badgePadding} rounded-full bg-gradient-to-br from-[#F3E5AB] via-[#D4AF37] to-[#8B6508] shadow-md ${className}`}
        >
          <Crown className={`${iconSize} text-white drop-shadow-sm`} />
        </motion.div>
      );
    }

    if (variant === "gold") {
      return (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className={`inline-flex items-center justify-center ${badgePadding} rounded-full bg-[#D4AF37] shadow-md ${className}`}
        >
          <BadgeCheck className={`${iconSize} text-white`} />
        </motion.div>
      );
    }

    return (
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        className={`inline-flex items-center justify-center ${className}`}
      >
        <BadgeCheck className={`${iconSize} text-[#D4AF37] drop-shadow-sm`} />
      </motion.div>
    );
  };

  if (!showTooltip) {
    return <Badge />;
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <span className="cursor-help">
            <Badge />
          </span>
        </TooltipTrigger>
        <TooltipContent
          side="top"
          className="bg-[#2F334F] text-white border-none px-3 py-2"
        >
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-[#D4AF37]" />
            <span className="text-sm font-medium">Verified Artisan</span>
          </div>
          <p className="text-xs text-gray-300 mt-1">
            Authenticity confirmed by video verification
          </p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

/**
 * Inline verified badge with text
 */
export function VerifiedBadgeInline({
  size = "sm",
  className = "",
}: {
  size?: "sm" | "md";
  className?: string;
}) {
  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/30 ${className}`}
    >
      <BadgeCheck
        className={`${size === "sm" ? "w-3 h-3" : "w-3.5 h-3.5"} text-[#D4AF37]`}
      />
      <span
        className={`${
          size === "sm" ? "text-[10px]" : "text-xs"
        } font-semibold text-[#D4AF37] uppercase tracking-wider`}
      >
        Verified
      </span>
    </span>
  );
}

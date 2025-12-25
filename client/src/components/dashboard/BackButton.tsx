"use client";

import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function BackButton() {
  return (
    <div className="fixed bottom-8 right-8 z-50">
      <Link href="/shop">
        <motion.div
          whileHover={{ scale: 1.1, rotate: 5 }}
          whileTap={{ scale: 0.9 }}
          className="group relative w-16 h-16 rounded-full bg-linear-to-br from-[#F3E5AB] via-[#D4AF37] to-[#8B6508] p-1 shadow-2xl cursor-pointer"
        >
          <div className="w-full h-full rounded-full bg-[#2F334F] flex items-center justify-center">
            <ArrowLeft className="w-6 h-6 text-[#D4AF37] group-hover:text-white transition-colors" />
          </div>
        </motion.div>
      </Link>
    </div>
  );
}
"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import AutoTranslate from "@/components/ui/auto-translate";

interface TrendingCardProps {
  id: string;
  title: string;
  category: string;
  price: number;
  image: string;
  index: number;
}

export default function TrendingCard({ id, title, category, price, image, index }: TrendingCardProps) {
  return (
    <Link href={`/shop/${id}`}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.1, duration: 0.5 }}
        className="group relative h-112.5 rounded-4xl p-1 bg-linear-to-b from-[#F3E5AB] via-[#D4AF37]/40 to-[#8B6508]/20 hover:from-[#FFD700] hover:via-[#D4AF37] hover:to-[#B8860B] transition-all duration-700 shadow-xl hover:shadow-2xl hover:-translate-y-3 cursor-pointer"
      >
        <div className="relative h-full w-full bg-[#FFFBF5] rounded-[1.8rem] overflow-hidden">

          <Image
            src={image}
            alt={title}
            fill
            className="object-cover transition-transform duration-1000 group-hover:scale-110"
          />

          <div className="absolute inset-0 bg-linear-to-t from-[#2C1810]/90 via-[#2C1810]/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity"></div>

          <div className="absolute inset-0 shadow-[inset_0_0_40px_rgba(212,175,55,0.3)] pointer-events-none border border-white/10 rounded-[1.8rem]"></div>

          <div className="absolute bottom-0 left-0 w-full p-8 text-center">

             <div className="mb-4 inline-flex items-center justify-center w-12 h-12 rounded-full bg-white/10 backdrop-blur-md border border-[#D4AF37]/50 text-[#D4AF37] shadow-lg group-hover:scale-110 transition-transform duration-500">
                <TrendingUp className="w-6 h-6" />
             </div>

             <h3 className="text-2xl font-serif font-bold text-[#FDFBF7] mb-2 drop-shadow-md group-hover:text-[#D4AF37] transition-colors line-clamp-1">
               <AutoTranslate text={title} />
             </h3>
             <p className="text-[#E5DCCA] font-medium text-sm tracking-wide uppercase">
               <AutoTranslate text={category} /> • ₹{price}
             </p>
             
             <div className="mt-4 opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500">
                <Button className="h-10 px-6 rounded-full bg-white/20 hover:bg-white text-white hover:text-[#4A3526] backdrop-blur-md border border-white/30 font-serif text-sm">
                   View Details <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
             </div>
          </div>

        </div>
      </motion.div>
    </Link>
  );
}
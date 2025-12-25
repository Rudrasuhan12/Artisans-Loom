"use client";

import { Button } from "@/components/ui/button";
import { Plus, Search, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import ProductCard from "@/components/artisan/ProductCard";
import { RoyalDivider } from "@/components/ui/royal-divider";

const products = [
  { id: 1, title: "Royal Banarasi Saree", price: "12,500", stock: 4, category: "Textile", image: "/p1.png" },
  { id: 2, title: "Hand-carved Brass Idol", price: "4,200", stock: 12, category: "Metalwork", image: "/p2.png" },
  { id: 3, title: "Kullu Wool Shawl", price: "2,800", stock: 8, category: "Textile", image: "/p3.png" },
  { id: 4, title: "Madhubani Painting", price: "8,500", stock: 1, category: "Art", image: "/p4.png" },
];

export default function ProductsPage() {
  return (
    <div className="space-y-8 min-h-screen pb-20">

      <div className="flex flex-col md:flex-row justify-between items-end gap-6">
        <div>
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-[#4A3526]">
            My Masterpieces
          </h1>
          <p className="text-[#8C7B70] mt-2 text-lg">
            Manage your inventory and showcase your heritage.
          </p>
        </div>

        <Link href="/artisan/products/add">
          <Button className="h-14 px-8 rounded-full bg-linear-to-r from-[#2F334F] to-[#1A1D2E] text-[#D4AF37] border border-[#D4AF37]/30 shadow-xl hover:shadow-[#D4AF37]/20 transition-all hover:scale-105 group">
            <div className="w-8 h-8 rounded-full bg-[#D4AF37]/20 flex items-center justify-center mr-3 group-hover:bg-[#D4AF37] group-hover:text-[#2F334F] transition-colors">
               <Plus className="w-5 h-5" />
            </div>
            <span className="text-lg font-serif tracking-wide">Craft New Item</span>
          </Button>
        </Link>
      </div>

      <div className="scale-100 opacity-50"><RoyalDivider /></div>

      <div className="bg-white rounded-2xl p-4 shadow-sm border border-[#E5DCCA] flex flex-col md:flex-row gap-4 items-center">
         <div className="relative flex-1 w-full">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#8C7B70]" />
            <Input 
              placeholder="Search your collection..." 
              className="h-12 pl-12 rounded-xl border-[#E5DCCA] bg-[#FDFBF7] focus-visible:ring-[#D4AF37]"
            />
         </div>
         <Button variant="outline" className="h-12 px-6 rounded-xl border-[#E5DCCA] text-[#4A3526] hover:bg-[#FFF5E1] gap-2">
            <Filter className="w-4 h-4" /> Filter
         </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {products.map((product, idx) => (
          <ProductCard key={product.id} index={idx} {...product} />
        ))}
      </div>

    </div>
  );
}
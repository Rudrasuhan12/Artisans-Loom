import { Button } from "@/components/ui/button";
import { Plus, Search, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import ProductCard from "@/components/artisan/ProductCard";
import { RoyalDivider } from "@/components/ui/royal-divider";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation"; // Import redirect

export default async function ProductsPage() {
  const { userId } = await auth();
  
  // --- FIX: Redirect if user is not logged in instead of crashing ---
  if (!userId) {
    redirect("/sign-in");
  }
  
  // 1. Fetch User (Safe query now that we know userId exists)
  const user = await prisma.user.findUnique({ where: { clerkId: userId } });
  
  if (!user) return <div className="p-8 text-center text-red-500">User profile not found. Please contact support.</div>;
  
  // 2. Fetch Products
  const products = await prisma.product.findMany({ 
    where: { artisanId: user.id }, 
    orderBy: { createdAt: 'desc' } 
  });

  return (
    <div className="space-y-8 min-h-screen pb-20">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-end gap-6">
        <div>
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-[#4A3526]">My Masterpieces</h1>
          <p className="text-[#8C7B70] mt-2 text-lg">Manage your inventory and showcase your heritage.</p>
        </div>
        <Link href="/artisan/products/add">
          <Button className="h-14 px-8 rounded-full bg-gradient-to-r from-[#2F334F] to-[#1A1D2E] text-[#D4AF37] border border-[#D4AF37]/30 shadow-xl group hover:shadow-2xl transition-all">
            <div className="w-8 h-8 rounded-full bg-[#D4AF37]/20 flex items-center justify-center mr-3 group-hover:bg-[#D4AF37] group-hover:text-[#2F334F] transition-colors">
               <Plus className="w-5 h-5" />
            </div>
            <span className="text-lg font-serif tracking-wide">Craft New Item</span>
          </Button>
        </Link>
      </div>

      <div className="scale-100 opacity-50"><RoyalDivider /></div>

      {/* Controls Toolbar */}
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

      {/* Grid */}
      {products.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-[#D4AF37]/30">
           <p className="text-[#8C7B70] text-lg">Your loom is empty. Craft your first masterpiece!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {products.map((product, idx) => (
            <ProductCard 
              key={product.id} 
              id={product.id}
              index={idx}
              title={product.title}
              price={product.price.toString()}
              stock={product.stock}
              category={product.category}
              image={product.images[0] || "/p1.png"}
            />
          ))}
        </div>
      )}
    </div>
  );
}
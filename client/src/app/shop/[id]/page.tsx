import { prisma } from "@/lib/prisma"; //
import Image from "next/image";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, ShieldCheck, Truck, RefreshCw } from "lucide-react";
import AddToCartActions from "./AddToCartActions"; // [IMPORT THE NEW LOGIC]
import BackButton from "@/components/ui/BackButton"; // [NEW] Add back button
import SimilarProducts from "@/components/shop/SimilarProducts";

// Helper function to fetch product data
async function getProduct(id: string) {
  const product = await prisma.product.findUnique({
    where: { id },
    include: {
      artisan: {
        include: { profile: true }
      }
    }
  });
  return product;
}

export default async function ProductDetails({ 
  params 
}: { 
  params: Promise<{ id: string }> 
}) {
  const resolvedParams = await params;
  const id = resolvedParams.id;

  const product = await getProduct(id);

  if (!product) {
    notFound();
  }

  return (
    <main className="bg-[#FDFBF7] min-h-screen py-12">
      <div className="container mx-auto px-4 lg:px-8">
        <BackButton position="top-left" fallbackUrl="/shop" />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          
          {/* LEFT: IMAGE GALLERY */}
          <div className="space-y-4">
            <div className="relative h-[500px] w-full rounded-3xl overflow-hidden border-4 border-white shadow-xl">
              <Image 
                src={product.images?.[0] || "/p1.png"} 
                alt={product.title} 
                fill 
                className="object-cover"
                priority
              />
            </div>
            <div className="grid grid-cols-4 gap-4">
              {product.images?.map((img, idx) => (
                <div key={idx} className="relative h-24 rounded-xl overflow-hidden border-2 border-white shadow-sm cursor-pointer hover:border-[#D4AF37]">
                  <Image src={img} alt="Thumbnail" fill className="object-cover" />
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT: PRODUCT INFO */}
          <div className="flex flex-col">
            <div className="mb-6">
              <Badge className="bg-[#D4AF37]/10 text-[#D4AF37] border-[#D4AF37]/20 mb-4">
                {product.category}
              </Badge>
              <h1 className="text-4xl lg:text-5xl font-serif font-bold text-[#4A3526] mb-2">
                {product.title}
              </h1>
              <div className="flex items-center gap-2 text-[#8C7B70] font-medium">
                <MapPin className="w-4 h-4 text-[#D4AF37]" />
                {product.artisan?.profile?.state || "India"}
              </div>
            </div>

            <div className="text-3xl font-bold text-[#D97742] mb-8 font-serif">
              ₹{product.price.toLocaleString()}
            </div>

            <div className="space-y-6 mb-10">
              <div>
                <h3 className="text-sm font-bold text-[#8C7B70] uppercase tracking-widest mb-2">Materials Used</h3>
                <div className="flex flex-wrap gap-2">
                  {product.materials?.map((m, i) => (
                    <span key={i} className="px-3 py-1 bg-white border border-[#E5DCCA] rounded-full text-sm text-[#5D4037]">
                      {m}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-sm font-bold text-[#8C7B70] uppercase tracking-widest mb-2">The Story</h3>
                <p className="text-[#5D4037] leading-relaxed text-lg italic">
                  "{product.description}"
                </p>
              </div>
            </div>

            {/* ACTION BUTTONS - Now Active via the Client Component */}
            <AddToCartActions product={product} />

            {/* TRUST BADGES */}
            <div className="grid grid-cols-3 gap-4 py-6 border-y border-[#E5DCCA]">
              <div className="flex flex-col items-center text-center gap-1">
                <ShieldCheck className="w-6 h-6 text-[#D4AF37]" />
                <span className="text-[10px] font-bold uppercase text-[#8C7B70]">Authentic</span>
              </div>
              <div className="flex flex-col items-center text-center gap-1">
                <Truck className="w-6 h-6 text-[#D4AF37]" />
                <span className="text-[10px] font-bold uppercase text-[#8C7B70]">Free Shipping</span>
              </div>
              <div className="flex flex-col items-center text-center gap-1">
                <RefreshCw className="w-6 h-6 text-[#D4AF37]" />
                <span className="text-[10px] font-bold uppercase text-[#8C7B70]">Easy Returns</span>
              </div>
            </div>
          </div>
        </div>

        {/* ARTISAN SPOTLIGHT SECTION */}
        <div className="mt-20 p-10 bg-white rounded-[3rem] border border-[#E5DCCA] shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#D4AF37]/5 rounded-full blur-3xl -mr-32 -mt-32"></div>
          <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
            <div className="relative w-32 h-32 rounded-full border-4 border-[#D4AF37] overflow-hidden shadow-xl">
              <Image src="/avatar.png" alt="Artisan" fill className="object-cover" />
            </div>
            <div className="flex-1 text-center md:text-left">
              <h2 className="text-2xl font-serif font-bold text-[#4A3526] mb-2">
                Meet the Maker: {product.artisan?.name || "Traditional Artisan"}
              </h2>
              <p className="text-[#5D4037] max-w-2xl leading-relaxed">
                {product.artisan?.profile?.bio || "Dedicated to preserving the ancient craft traditions of their region for over a decade."}
              </p>
            </div>
            <Button variant="ghost" className="text-[#D4AF37] font-bold hover:bg-[#D4AF37]/5">
              View All Crafts by {product.artisan?.name?.split(' ')[0] || "Artisan"} →
            </Button>
          </div>
        </div>

        {/* SIMILAR PRODUCTS SECTION */}
        <SimilarProducts 
          productId={product.id}
          currentCategory={product.category}
          currentMaterials={product.materials || []}
        />
      </div>
    </main>
  );
}
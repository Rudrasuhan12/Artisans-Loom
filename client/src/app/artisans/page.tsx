import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { MapPin, ArrowRight } from "lucide-react";
import UniversalBackButton from "@/components/ui/BackButton";
import PremiumAvatar from "@/components/ui/premium-avatar";
import { RoyalDivider } from "@/components/ui/royal-divider";

export const dynamic = 'force-dynamic';

export default async function AllArtisansPage({ searchParams }: { searchParams: Promise<{ region?: string; craft?: string }> }) {
  const { region, craft } = await searchParams;

  const where: any = { role: "ARTISAN" };
  if (region && region !== "All") where.profile = { state: { contains: region, mode: 'insensitive' } };

  const artisans = await prisma.user.findMany({
    where,
    include: { profile: true, _count: { select: { products: true } } }
  });

  return (
    <div className="min-h-screen bg-[#FDFBF7] relative pb-20">
      
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/paper.png')] opacity-50"></div>

      <div className="container mx-auto px-4 py-16 relative z-10">
         <UniversalBackButton position="top-left" fallbackUrl="/" />

         <div className="text-center mb-20 space-y-3">
           <div className="inline-block px-4 py-1 bg-[#D4AF37]/10 text-[#D4AF37] text-[10px] font-bold uppercase tracking-[0.3em] rounded-full">
             The Guild
           </div>
           <h1 className="text-5xl font-serif font-medium text-[#2C1810]">
             Master Artisans
           </h1>
           <p className="text-[#8C7B70] font-light text-lg">
             The guardians of India's living heritage.
           </p>
         </div>

         <div className="flex justify-center gap-3 mb-16 flex-wrap">
            {["All", "Rajasthan", "Odisha", "Gujarat", "Kashmir", "Bengal"].map((r) => (
               <Link key={r} href={`/artisans?region=${r === "All" ? "" : r}`}>
                  <Button 
                    variant="ghost" 
                    className={`rounded-full px-6 h-10 border transition-all ${
                      (region === r) || (!region && r === "All")
                        ? "bg-[#2C1810] text-[#FDFBF7] border-[#2C1810]" 
                        : "bg-white text-[#5D4037] border-[#E5DCCA] hover:border-[#D4AF37]"
                    }`}
                  >
                     {r}
                  </Button>
               </Link>
            ))}
         </div>

         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {artisans.map((artisan) => (
               <Link key={artisan.id} href={`/profile/${artisan.id}`} className="group">
                  <div className="bg-white rounded-3xl p-6 border border-[#E5DCCA] shadow-sm hover:shadow-2xl hover:shadow-[#D4AF37]/10 transition-all duration-500 hover:-translate-y-2 relative overflow-hidden h-full flex flex-col">
                     
                     <div className="absolute top-0 left-0 w-full h-1 bg-linear-to-r from-transparent via-[#D4AF37] to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-500"></div>

                     <div className="flex flex-col items-center text-center flex-1">
                        <div className="mb-6 relative">
                           <PremiumAvatar src={artisan.email} name={artisan.name || "Artisan"} size="lg" className="border-4 border-white shadow-lg" />
                           <div className="absolute bottom-0 right-0 bg-[#D4AF37] text-white text-[10px] px-2 py-0.5 rounded-full font-bold shadow-sm">PRO</div>
                        </div>

                        <h3 className="text-xl font-serif font-bold text-[#2C1810] mb-1 group-hover:text-[#D97742] transition-colors">{artisan.name}</h3>
                        <p className="text-[#8C7B70] text-xs uppercase tracking-widest font-bold mb-4">{artisan.profile?.craftType || "Master Craftsman"}</p>
                        
                        <div className="w-full h-px bg-[#E5DCCA]/50 mb-4"></div>

                        <p className="text-sm text-[#5D4037]/80 line-clamp-2 leading-relaxed mb-4 flex-1">
                           {artisan.profile?.bio || "Preserving ancient traditions through dedication and skill."}
                        </p>
                     </div>

                     <div className="flex items-center justify-between mt-auto pt-2">
                        <div className="flex items-center gap-1 text-xs text-[#8C7B70]">
                           <MapPin className="w-3 h-3" /> {artisan.profile?.state || "India"}
                        </div>
                        <div className="flex items-center gap-1 text-[#2C1810] text-xs font-bold group-hover:translate-x-1 transition-transform">
                           View Portfolio <ArrowRight className="w-3 h-3" />
                        </div>
                     </div>

                  </div>
               </Link>
            ))}
         </div>

      </div>
    </div>
  );
}
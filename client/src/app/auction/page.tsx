import { prisma } from "@/lib/prisma";
import { Sparkles } from "lucide-react";
import BackButton from "@/components/dashboard/BackButton";
import AuctionTabs from "@/components/auction/AuctionTabs";
import { checkAndResolveAuctionAction } from "@/app/actions/auction";

export const dynamic = 'force-dynamic';

export default async function AuctionPage() {
  const activeAuctionsToCheck = await prisma.auctionItem.findMany({ where: { status: "ACTIVE" } });
  
  for (const auc of activeAuctionsToCheck) {
    if (new Date() > new Date(auc.endTime)) {
      await checkAndResolveAuctionAction(auc.id);
    }
  }

  const activeAuctions = await prisma.auctionItem.findMany({
    where: { status: "ACTIVE" },
    include: {
      product: { include: { artisan: { include: { profile: true } } } },
      bids: { orderBy: { amount: 'desc' }, take: 1, include: { user: true } } 
    },
    orderBy: { endTime: 'asc' }
  });

  const pastAuctions = await prisma.auctionItem.findMany({
    where: { status: { in: ["SOLD", "UNSOLD"] } },
    include: {
      product: true,
      bids: { orderBy: { amount: 'desc' }, take: 1, include: { user: true } }
    },
    orderBy: { endTime: 'desc' },
    take: 12
  });

  return (
    <div className="min-h-screen bg-[#FDFBF7] relative pb-20 overflow-hidden selection:bg-[#D4AF37] selection:text-white">

      <div className="fixed inset-0 z-0 bg-[#FDFBF7]">
        <div className="absolute top-[-10%] left-[-10%] w-[70vw] h-[70vw] bg-[#D4AF37]/20 rounded-full mix-blend-multiply filter blur-[100px] animate-blob"></div>
        <div className="absolute top-[-10%] right-[-10%] w-[70vw] h-[70vw] bg-[#F3E5AB] rounded-full mix-blend-multiply filter blur-[100px] animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-32 left-[20%] w-[60vw] h-[60vw] bg-[#FFD700]/10 rounded-full mix-blend-multiply filter blur-[120px] animate-blob animation-delay-4000"></div>
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cream-paper.png')] opacity-60"></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-16">
        
        <div className="text-center mb-16 space-y-6">
           <div className="inline-flex items-center gap-2 px-6 py-2 rounded-full border border-[#D4AF37] bg-white/80 backdrop-blur-md text-[#D4AF37] text-xs font-bold uppercase tracking-[0.3em] shadow-lg">
             <Sparkles className="w-3 h-3 animate-pulse" /> Live Heritage Events
           </div>
           
           <h1 className="text-7xl md:text-9xl font-serif font-bold text-[#4A3526] drop-shadow-sm tracking-tight">
             The Grand <span className="text-transparent bg-clip-text bg-linear-to-r from-[#B8860B] via-[#D4AF37] to-[#B8860B] animate-shine">Hall</span>
           </h1>
           
           <p className="text-[#8C7B70] text-lg max-w-2xl mx-auto font-light leading-relaxed">
             Acquire exclusive, one-of-a-kind masterpieces crafted by India's legendary artisans.
           </p>
        </div>

        <AuctionTabs 
          activeAuctions={activeAuctions} 
          pastAuctions={pastAuctions} 
        />
        
      </div>
      <BackButton />
    </div>
  );
}
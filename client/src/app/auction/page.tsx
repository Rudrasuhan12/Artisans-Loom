import { prisma } from "@/lib/prisma";
import { Gavel, Sparkles } from "lucide-react";
import BackButton from "@/components/dashboard/BackButton";
import Auction3DGrid from "@/components/auction/Auction3DGrid";
import { checkAndResolveAuctionAction } from "@/app/actions/auction";

export const dynamic = 'force-dynamic';

export default async function AuctionPage() {
  const auctions = await prisma.auctionItem.findMany({
    where: { status: "ACTIVE" },
    include: {
      product: { include: { artisan: { include: { profile: true } } } },
      bids: { orderBy: { amount: 'desc' }, take: 1, include: { user: true } } 
    }
  });

  const allAuctions = await prisma.auctionItem.findMany({ where: { status: 'ACTIVE' } });
  for (const auc of allAuctions) {
    if (new Date() > new Date(auc.endTime)) {
      await checkAndResolveAuctionAction(auc.id);
    }
  }

  return (
    <div className="min-h-screen bg-[#FDFBF7] relative pb-20 overflow-hidden selection:bg-[#D4AF37] selection:text-white">
      
      <div className="fixed inset-0 z-0 bg-[#FDFBF7]">
        <div className="absolute top-[-10%] left-[-10%] w-[70vw] h-[70vw] bg-[#D4AF37]/20 rounded-full mix-blend-multiply filter blur-[100px] animate-blob"></div>
        <div className="absolute top-[-10%] right-[-10%] w-[70vw] h-[70vw] bg-[#F3E5AB] rounded-full mix-blend-multiply filter blur-[100px] animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-32 left-[20%] w-[60vw] h-[60vw] bg-[#FFD700]/10 rounded-full mix-blend-multiply filter blur-[120px] animate-blob animation-delay-4000"></div>
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cream-paper.png')] opacity-60"></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-16">
        
        <div className="text-center mb-24 space-y-6">

           <div className="inline-flex items-center gap-2 px-6 py-2 rounded-full border border-[#D4AF37]/40 bg-white/80 backdrop-blur-md text-[#D4AF37] text-xs font-bold uppercase tracking-[0.3em] shadow-lg">
             <Sparkles className="w-3 h-3 animate-pulse" /> Live Heritage Events
           </div>

           <h1 className="text-6xl md:text-8xl font-serif font-bold text-[#4A3526] drop-shadow-sm tracking-tight leading-tight">
             The Grand <br className="md:hidden" />
             <span className="text-transparent bg-clip-text bg-linear-to-r from-[#B8860B] via-[#D4AF37] to-[#B8860B] animate-shine">
               Bidding Hall
             </span>
           </h1>
           
           <p className="text-[#8C7B70] text-lg md:text-xl max-w-2xl mx-auto font-light leading-relaxed pt-2">
             Participate in the live acquisition of India's finest, rarest, and most culturally significant masterpieces.
           </p>
        </div>

        {auctions.length === 0 ? (
           <div className="flex flex-col items-center justify-center py-32 border-2 border-dashed border-[#D4AF37]/30 rounded-[3rem] bg-white/40 backdrop-blur-lg shadow-xl">
              <div className="p-8 bg-linear-to-br from-[#FFF5E1] to-white rounded-full mb-6 shadow-inner border border-[#D4AF37]/20">
                <Gavel className="w-16 h-16 text-[#D4AF37]" />
              </div>
              <h3 className="text-3xl font-serif text-[#4A3526] font-bold">The Hall is Silent.</h3>
              <p className="text-[#8C7B70] mt-3 font-medium">Curators are selecting new masterpieces. Please return shortly.</p>
           </div>
        ) : (
          <Auction3DGrid auctions={auctions} />
        )}
        
      </div>
      <BackButton />
    </div>
  );
}
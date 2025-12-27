import { prisma } from "@/lib/prisma";
import SafeImage from "@/components/ui/safe-image";
import Countdown from "@/components/auction/Countdown";
import BiddingInterface from "@/components/auction/BiddingInterface";
import BackButton from "@/components/dashboard/BackButton";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Crown, ShieldCheck, MapPin, History } from "lucide-react";
import { checkAndResolveAuctionAction } from "@/app/actions/auction";

export const dynamic = 'force-dynamic';

export default async function AuctionRoom({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  await checkAndResolveAuctionAction(id);

  const auction = await prisma.auctionItem.findUnique({
    where: { id },
    include: {
      product: { include: { artisan: { include: { profile: true } } } },
      bids: { orderBy: { amount: 'desc' }, take: 5, include: { user: true } }
    }
  });

  if (!auction) return <div className="text-[#4A3526] text-center py-20">Auction Not Found</div>;

  const currentBid = auction.currentBid > 0 ? auction.currentBid : auction.basePrice;

  return (
    <div className="min-h-screen relative pb-20 overflow-x-hidden text-[#4A3526]">
      
      <div className="fixed inset-0 z-0 bg-[#FDFBF7]">
         <div className="absolute top-[-20%] left-[-10%] w-[80vw] h-[80vw] bg-linear-to-r from-[#F3E5AB] to-[#FFF5E1] rounded-full mix-blend-multiply filter blur-[80px] opacity-80 animate-blob"></div>
         <div className="absolute top-[-20%] right-[-10%] w-[80vw] h-[80vw] bg-linear-to-l from-[#D4AF37]/20 to-[#F3E5AB] rounded-full mix-blend-multiply filter blur-[80px] opacity-80 animate-blob animation-delay-2000"></div>
         <div className="absolute -bottom-32 left-1/2 -translate-x-1/2 w-[80vw] h-[80vw] bg-linear-to-t from-[#D4AF37]/10 to-transparent rounded-full mix-blend-multiply filter blur-[100px] opacity-70 animate-pulse"></div>

         <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/white-diamond.png')] opacity-30"></div>
      </div>

      <div className="container mx-auto px-4 py-12 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 relative z-10">

        <div className="space-y-8 sticky top-8 h-fit">
           
           <div className="relative h-150 w-full rounded-[3rem] overflow-hidden border-8 border-white shadow-[0_30px_60px_rgba(212,175,55,0.25)] group bg-white">
              <SafeImage 
                src={auction.product.images[0] || "/p1.png"} 
                alt={auction.product.title} 
                fill 
                className="object-cover group-hover:scale-105 transition-transform duration-[2s]"
              />
              <div className="absolute inset-0 bg-linear-to-t from-[#2C1810]/80 via-transparent to-transparent opacity-90"></div>

              <div className="absolute bottom-0 left-0 w-full p-10 text-white">
                 <div className="inline-flex items-center gap-2 px-4 py-1 mb-4 rounded-full bg-[#FDFBF7] text-[#4A3526] text-xs font-bold uppercase tracking-widest shadow-xl">
                    <Crown className="w-3 h-3 text-[#D4AF37]" /> {auction.product.category}
                 </div>
                 <h1 className="text-5xl md:text-6xl font-serif font-bold mb-4 leading-tight drop-shadow-lg">
                   {auction.product.title}
                 </h1>
                 
                 <div className="flex items-center gap-6 text-[#E5DCCA] text-sm font-medium backdrop-blur-md bg-white/10 p-3 rounded-2xl w-fit border border-white/20">
                    <span className="flex items-center gap-2"><MapPin className="w-4 h-4 text-[#D4AF37]" /> {auction.product.artisan.profile?.state || "India"}</span>
                    <span className="w-px h-4 bg-white/30"></span>
                    <span className="flex items-center gap-2"><ShieldCheck className="w-4 h-4 text-[#D4AF37]" /> Verified</span>
                 </div>
              </div>

              <div className="absolute top-6 right-6">
                 <div className="bg-white/95 backdrop-blur-xl border border-[#D4AF37]/30 rounded-full px-6 py-3 shadow-2xl flex items-center gap-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <Countdown targetDate={auction.endTime} />
                 </div>
              </div>
           </div>

           <div className="bg-white/70 backdrop-blur-md p-6 rounded-3xl border border-white/60 shadow-lg flex items-center gap-5 hover:bg-white transition-colors cursor-pointer">
              <div className="w-16 h-16 rounded-full border-2 border-[#D4AF37] p-1">
                 <div className="w-full h-full rounded-full overflow-hidden relative bg-[#F3E5AB]">
                    <div className="flex items-center justify-center w-full h-full text-2xl font-bold text-[#D4AF37]">
                       {auction.product.artisan.name?.[0]}
                    </div>
                 </div>
              </div>
              <div>
                 <p className="text-[#8C7B70] text-[10px] uppercase tracking-[0.2em] mb-1">Master Artisan</p>
                 <h3 className="text-xl font-bold text-[#4A3526]">{auction.product.artisan.name}</h3>
              </div>
           </div>
        </div>

        <div className="space-y-8 pt-4">

           <BiddingInterface 
             auctionId={auction.id} 
             currentBid={currentBid} 
             minBid={currentBid + 100} 
             product={auction.product}
             status={auction.status}
           />

           <div className="flex items-center gap-4 py-4">
              <div className="h-px flex-1 bg-linear-to-r from-transparent via-[#D4AF37]/50 to-transparent"></div>
              <span className="text-[#D4AF37] text-xs uppercase tracking-widest font-bold">Live History</span>
              <div className="h-px flex-1 bg-linear-to-r from-transparent via-[#D4AF37]/50 to-transparent"></div>
           </div>

           <div className="bg-white/50 backdrop-blur-xl rounded-[2.5rem] p-8 border border-white/60 shadow-xl">
              <h3 className="text-xl font-serif font-bold text-[#4A3526] mb-8 flex items-center gap-3">
                 <div className="p-2 bg-[#D4AF37]/10 rounded-full"><History className="w-5 h-5 text-[#D4AF37]" /></div>
                 Bid History
              </h3>
              
              <div className="space-y-4">
                 {auction.bids.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-8 opacity-60">
                       <p className="text-sm font-medium text-[#8C7B70]">No bids yet. Be the first!</p>
                    </div>
                 ) : (
                    auction.bids.map((bid, idx) => (
                       <div key={bid.id} className={`relative flex items-center justify-between p-4 rounded-2xl transition-all duration-300 ${idx === 0 ? 'bg-[#FFF5E1] border border-[#D4AF37]/30 shadow-md scale-105 z-10' : 'bg-white border border-[#E5DCCA]'}`}>
                          
                          <div className="flex items-center gap-4">
                             <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm shadow-sm ${idx === 0 ? 'bg-[#D4AF37] text-white' : 'bg-[#E5DCCA] text-[#4A3526]'}`}>
                                {idx === 0 ? <Crown className="w-5 h-5" /> : idx + 1}
                             </div>
                             <div>
                                <p className="font-bold text-[#4A3526] text-sm">{bid.user.name || "Anonymous"}</p>
                                <p className="text-[10px] text-[#8C7B70] uppercase tracking-wide">{new Date(bid.timestamp).toLocaleTimeString()}</p>
                             </div>
                          </div>
                          
                          <div className="text-right">
                             <p className={`font-mono font-bold text-lg ${idx === 0 ? 'text-[#D97742]' : 'text-[#4A3526]'}`}>₹{bid.amount.toLocaleString()}</p>
                             {idx === 0 && <span className="text-[9px] text-[#D97742] uppercase font-bold tracking-widest">Winning</span>}
                          </div>
                       </div>
                    ))
                 )}
              </div>
           </div>

        </div>

      </div>
      <BackButton />
    </div>
  );
}
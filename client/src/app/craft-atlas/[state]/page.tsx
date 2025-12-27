import { allStatesData } from "@/lib/statesData";
import SafeImage from "@/components/ui/safe-image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ShoppingBag } from "lucide-react";
import AIInsights from "@/components/atlas/AIInsights";

export default async function StatePage({ params }: { params: Promise<{ state: string }> }) {
  const { state } = await params;
  const decodedState = decodeURIComponent(state);
  
  const stateData = allStatesData.find(s => s.name === decodedState);
  if (!stateData) return <div className="h-screen flex items-center justify-center text-[#4A3526]">State not found</div>;

  return (
    <div className="min-h-screen bg-[#FDFBF7] pb-20">     
      <div className="relative h-[45vh] w-full overflow-hidden">
         <div className="absolute inset-0">
           <SafeImage 
             src={stateData.image} 
             alt={stateData.name} 
             fill 
             className="object-cover"
             priority
           />
         </div>

         <div className="absolute inset-0 bg-linear-to-t from-[#FDFBF7] via-black/40 to-black/30"></div>
         
         <div className="absolute top-6 left-6 z-20">
            <Link href="/craft-atlas">
               <Button variant="ghost" className="rounded-full bg-black/20 backdrop-blur-md text-white hover:bg-white hover:text-black gap-2 border border-white/20">
                 <ArrowLeft className="w-4 h-4" /> Back to Atlas
               </Button>
            </Link>
         </div>

         <div className="absolute bottom-0 left-0 w-full p-8 md:p-12 z-10 text-center md:text-left flex flex-col md:flex-row items-end justify-between gap-6">
            <div>
              <div className="inline-block px-3 py-1 rounded-md border border-[#D4AF37] text-[#D4AF37] bg-black/60 backdrop-blur-md text-xs font-bold uppercase tracking-[0.2em] mb-3">
                 {stateData.microtext}
              </div>
              <h1 className="text-5xl md:text-7xl font-serif font-bold text-[#FDFBF7] drop-shadow-2xl">
                 {stateData.name}
              </h1>
            </div>
            
            <div className="hidden md:block text-6xl opacity-80 drop-shadow-lg filter grayscale transition-all hover:scale-110">
               {stateData.badge}
            </div>
         </div>
      </div>

      <div className="container mx-auto px-4 relative z-20 -mt-8">
         
         <div className="mb-16">
            <AIInsights stateName={stateData.name} />
         </div>

         <div>
            <div className="flex items-center gap-4 mb-10 justify-center md:justify-start">
               <div className="h-0.5 w-12 bg-[#D4AF37]"></div>
               <h2 className="text-3xl md:text-4xl font-serif font-bold text-[#4A3526] uppercase tracking-wide">
                  Signature Crafts
               </h2>
               <div className="h-0.5 w-12 bg-[#D4AF37]"></div>
            </div>

            <div className="space-y-20">
              {stateData.crafts.map((craft: any, idx: number) => (
                 <div key={craft.name} className={`flex flex-col ${idx % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'} gap-8 md:gap-16 items-center`}>

                    <div className="w-full md:w-1/2 relative group">
                       <div className="absolute inset-0 bg-[#D4AF37] rounded-4xl transform translate-x-3 translate-y-3 group-hover:translate-x-1 group-hover:translate-y-1 transition-transform duration-500"></div>
                       <div className="relative h-87.5 w-full rounded-4xl overflow-hidden shadow-2xl border border-[#E5DCCA]">
                          <SafeImage src={craft.image} alt={craft.name} fill className="object-cover group-hover:scale-110 transition-transform duration-700" />
                       </div>
                    </div>

                    <div className="w-full md:w-1/2 text-center md:text-left space-y-6">
                       <h3 className="text-4xl font-serif font-bold text-[#2F334F]">{craft.name}</h3>
                       <p className="text-lg text-[#5D4037] leading-relaxed font-light">{craft.description}</p>
                       
                       <Link href={`/shop?q=${encodeURIComponent(craft.name)}&region=${encodeURIComponent(stateData.name)}`}>
                          <Button className="h-14 px-8 rounded-full bg-[#2F334F] hover:bg-[#1E2135] text-white text-lg shadow-xl gap-3 group/btn transition-all hover:shadow-2xl">
                             Shop {craft.name} <ShoppingBag className="w-5 h-5 text-[#D4AF37] group-hover/btn:-translate-y-1 transition-transform" />
                          </Button>
                       </Link>
                    </div>

                 </div>
              ))}
            </div>
         </div>

      </div>
    </div>
  );
}
"use client";

import { useState } from "react";
import InteractiveMap from "@/components/landing/InteractiveMap";
import { craftData } from "@/lib/craftData";
import { Button } from "@/components/ui/button";
import { Sparkles, MapPin, ArrowLeft, Loader2, ShoppingBag, Sparkle } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function AtlasPage() {
  const [selectedState, setSelectedState] = useState<string | null>(null);
  const [aiStory, setAiStory] = useState<string | null>(null);
  const [loadingStory, setLoadingStory] = useState(false);
  const [marketingCopies, setMarketingCopies] = useState<Record<string, string>>({});
  const [loadingCopy, setLoadingCopy] = useState<string | null>(null);

  const stateInfo = selectedState ? craftData[selectedState] : null;

  // Feature 1: AI Folk Tale Generator (from map.html generateStory)
  const fetchAiStory = async (craftName: string) => {
    setLoadingStory(true);
    setAiStory(null);
    try {
      const response = await fetch("/api/gemini", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productName: craftName,
          material: "handcrafted traditions",
          category: selectedState,
          promptOverride: `Tell me a short, engaging folk tale or story (around 150 words) related to the traditional craft of ${craftName} from the region of ${selectedState}.`
        }),
      });
      const data = await response.json();
      setAiStory(data.text);
    } catch (error) {
      setAiStory("The Craft Mitra is currently weaving new tales. Please try again.");
    } finally {
      setLoadingStory(false);
    }
  };

  // Feature 2: AI Marketing Description (from map.html ✨ button)
  const fetchMarketingCopy = async (craftName: string, index: number) => {
    const key = `${craftName}-${index}`;
    setLoadingCopy(key);
    try {
      const response = await fetch("/api/gemini", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productName: craftName,
          material: "authentic materials",
          category: selectedState,
          promptOverride: `Write a vivid and evocative 2-sentence marketing description for a handmade ${craftName} from ${selectedState}, perfect for an e-commerce site.`
        }),
      });
      const data = await response.json();
      setMarketingCopies(prev => ({ ...prev, [key]: data.text }));
    } catch (error) {
      console.error("Copy failed");
    } finally {
      setLoadingCopy(null);
    }
  };

  return (
    <main className="bg-[#FDFBF7] min-h-screen flex flex-col">
      <header className="bg-white border-b border-[#E5DCCA] py-4 px-6 shadow-sm sticky top-0 z-50">
        <div className="container mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center text-[#8C7B70] hover:text-[#D4AF37] transition-colors font-medium">
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Home
          </Link>
          <h1 className="text-2xl font-serif font-bold text-[#4A3526]">The Craft Atlas of India</h1>
          <div className="w-24 hidden md:block"></div>
        </div>
      </header>

      <section className="flex-grow container mx-auto py-8 px-4 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:h-[calc(100vh-80px)] overflow-hidden">
        
        {/* MAP PANEL */}
        <div className="lg:col-span-7 bg-white rounded-4xl p-6 shadow-xl border border-[#D4AF37]/20 flex flex-col h-full">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-[#4A3526] font-serif font-bold text-xl flex items-center gap-2">
               <MapPin className="text-[#D4AF37] w-5 h-5" /> Regional Exploration
            </h2>
          </div>
          <div className="flex-grow relative bg-[#FDFBF7] rounded-2xl border border-[#F3E5AB] overflow-hidden">
            <InteractiveMap onSelectState={(name) => { setSelectedState(name); setAiStory(null); setMarketingCopies({}); }} />
          </div>
        </div>

        {/* SIDEBAR PANEL */}
        <div className="lg:col-span-5 flex flex-col h-full overflow-y-auto pr-2 custom-scrollbar pb-10">
          {stateInfo ? (
            <div className="bg-[#FFFBF5] p-8 rounded-3xl border border-[#E5DCCA] shadow-sm animate-in fade-in slide-in-from-right-4 duration-500">
              <div className="inline-block px-3 py-1 bg-[#D4AF37]/10 text-[#D4AF37] rounded-full text-xs font-bold tracking-widest uppercase mb-3">
                Current Region
              </div>
              <h3 className="text-4xl font-serif font-bold text-[#4A3526] mb-3">{stateInfo.name}</h3>
              <p className="text-lg text-[#8C7B70] mb-8 leading-relaxed">{stateInfo.description}</p>

              <div className="space-y-6">
                <h4 className="text-[#4A3526] font-bold text-sm uppercase tracking-wider flex items-center gap-2">
                   Featured Crafts <div className="h-px bg-[#E5DCCA] flex-grow"></div>
                </h4>
                
                {stateInfo.crafts.map((craft: any, i: number) => {
                  const copyKey = `${craft.name}-${i}`;
                  return (
                    <div key={i} className="bg-white p-5 rounded-2xl border border-[#D4AF37]/10 hover:shadow-md transition-all group">
                      <div className="flex items-start gap-5">
                        <div className="w-24 h-24 relative rounded-xl overflow-hidden flex-shrink-0 border border-[#E5DCCA] bg-gray-50">
                          <Image
                            src={craft.image}
                            alt={craft.name}
                            fill
                            className="object-cover group-hover:scale-110 transition-transform duration-500"
                            onError={(e) => {
                               const target = e.target as HTMLImageElement;
                               if (!target.src.includes('placeholder-error')) {
                                 target.src = `https://placehold.co/400x300/F3E5AB/4A3526?text=${craft.name.replace(/\s+/g, '+')}&placeholder-error=true`;
                               }
                            }}
                          />
                        </div>
                        <div className="flex-grow">
                          <div className="flex justify-between items-start">
                            <h4 className="text-xl font-bold text-[#D97742] mb-1">{craft.name}</h4>
                            <Button 
                              variant="ghost" 
                              size="icon"
                              className="h-8 w-8 text-[#D4AF37] hover:bg-[#D4AF37]/10"
                              onClick={() => fetchMarketingCopy(craft.name, i)}
                              disabled={!!loadingCopy}
                            >
                              {loadingCopy === copyKey ? <Loader2 className="animate-spin w-4 h-4" /> : <Sparkle className="w-4 h-4" />}
                            </Button>
                          </div>
                          <p className="text-[#5D4037] text-sm mb-3">{craft.description}</p>
                          
                          {/* Marketing Copy Display */}
                          {marketingCopies[copyKey] && (
                            <p className="mb-4 text-sm text-[#B8860B] bg-[#D4AF37]/5 p-3 rounded-lg border-l-2 border-[#D4AF37] italic animate-in fade-in zoom-in-95">
                              {marketingCopies[copyKey]}
                            </p>
                          )}

                          <Button 
                            variant="ghost" 
                            className="text-[#D4AF37] hover:text-[#B8860B] p-0 h-auto font-medium transition-colors"
                            onClick={() => fetchAiStory(craft.name)}
                            disabled={loadingStory}
                          >
                            <Sparkles className="w-4 h-4 mr-2" />
                            {loadingStory ? "Weaving tale..." : "Tell me its story"}
                          </Button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* AI Narrative Section */}
              {aiStory && (
                <div className="mt-8 p-6 bg-[#F3E5AB]/30 rounded-2xl border-l-4 border-[#D4AF37]">
                  <h5 className="flex items-center font-bold text-[#4A3526] mb-2">
                    <Sparkles className="w-4 h-4 mr-2 text-[#D4AF37]" /> A Tale from the Loom
                  </h5>
                  <p className="italic text-[#5D4037] leading-relaxed">"{aiStory}"</p>
                </div>
              )}

              {/* Buy Button (from map.html) */}
              <Link href={`/shop?region=${selectedState}`}>
                <Button className="w-full mt-8 bg-[#4A3526] hover:bg-[#2C1810] text-white py-6 rounded-xl font-bold gap-2 shadow-lg">
                  <ShoppingBag className="w-5 h-5" /> Buy from this Region
                </Button>
              </Link>
            </div>
          ) : (
            <div className="text-center p-12 border-2 border-dashed border-[#D4AF37]/30 rounded-3xl h-full flex flex-col items-center justify-center bg-white/50">
              <MapPin className="w-16 h-16 text-[#D4AF37]/50 animate-bounce mb-6" />
              <h3 className="text-2xl font-serif font-bold text-[#4A3526] mb-2">Discover India's Heritage</h3>
              <p className="text-lg text-[#8C7B70] max-w-md">Select a state on the map to reveal its unique crafts and stories.</p>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
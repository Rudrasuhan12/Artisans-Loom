"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Sparkles, Gift, Home, Search, Loader2, IndianRupee } from "lucide-react";
import { getGiftingSuggestions, getDecorSuggestions } from "@/app/actions/assistants";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { RoyalDivider } from "@/components/ui/royal-divider";
import BackButton from "@/components/dashboard/BackButton";

const OCCASIONS = [
  "Wedding (Shaadi)", "Diwali", "Housewarming (Griha Pravesh)", "Anniversary", 
  "Raksha Bandhan", "Eid", "Durga Puja", "Baby Shower (Godh Bharai)", 
  "Corporate Gift", "Birthday", "Retirement", "Just Because", "Other" 
];

const ROOMS = ["Living Room", "Bedroom", "Puja Room", "Dining Area", "Entryway/Foyer", "Balcony", "Office"];
const VIBES = ["Royal Heritage", "Modern Minimalist", "Bohemian", "Rustic Village", "Spiritual/Zen", "Vintage Colonial"];

export default function AssistantsPage() {
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState("gifting"); 
  
  const [city, setCity] = useState("");
  const [occasion, setOccasion] = useState("");
  const [customOccasion, setCustomOccasion] = useState(""); // Track manual typing
  const [giftType, setGiftType] = useState("");

  const [room, setRoom] = useState("");
  const [vibe, setVibe] = useState("");
  const [color, setColor] = useState("");
  const [budget, setBudget] = useState("");

  const handleGiftSubmit = async () => {
    const finalOccasion = occasion === "Other" ? customOccasion : occasion;

    if (!city || !finalOccasion) return;
    
    setLoading(true);
    const results = await getGiftingSuggestions(city, finalOccasion, giftType);
    setSuggestions(results);
    setLoading(false);
  };

  const handleDecorSubmit = async () => {
    if (!room || !vibe) return;
    setLoading(true);
    const results = await getDecorSuggestions(room, vibe, color);
    setSuggestions(results);
    setLoading(false);
  };

  const tabVariants: Variants = {
    hidden: { opacity: 0, y: 10, scale: 0.98 },
    visible: { 
      opacity: 1, 
      y: 0, 
      scale: 1, 
      transition: { duration: 0.4, ease: "easeOut" } 
    },
    exit: { 
      opacity: 0, 
      y: -10, 
      scale: 0.98, 
      transition: { duration: 0.2 } 
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7] relative overflow-x-hidden pb-20">
      
      <div className="absolute inset-0 bg-linear-to-b from-[#FFF8E7] via-[#FDFBF7] to-[#F2E6D8]" />
      <div className="absolute top-0 left-0 w-full h-2 bg-linear-to-r from-[#2F334F] via-[#D4AF37] to-[#2F334F]"></div>
      <div className="absolute top-[20%] right-[10%] w-[30vw] h-[30vw] bg-[#D4AF37]/10 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="relative z-10 container mx-auto px-4 py-12 max-w-5xl">
        
        <div className="text-center mb-12 space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/60 border border-[#D4AF37]/30 text-[#4A3526] text-sm font-medium shadow-sm backdrop-blur-md">
             <Sparkles className="w-4 h-4 text-[#D97742]" /> 
             <span>AI-Powered Concierge</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-serif font-bold text-[#4A3526]">
            The Royal <span className="text-transparent bg-clip-text bg-linear-to-r from-[#B8860B] via-[#FFD700] to-[#B8860B] animate-shine">Advisor</span>
          </h1>
          <p className="text-[#8C7B70] text-lg">
            Let our intelligent assistant curate the perfect artifact for your need.
          </p>
          <div className="flex justify-center scale-100 pt-4"><RoyalDivider /></div>
        </div>

        <Tabs defaultValue="gifting" className="w-full" onValueChange={setActiveTab}>
          <div className="flex justify-center mb-10">
            <TabsList className="bg-[#FFFBF5] border border-[#D4AF37]/30 p-1 rounded-full shadow-lg h-16 w-full max-w-md grid grid-cols-2">
              <TabsTrigger 
                value="gifting" 
                className="rounded-full h-full data-[state=active]:bg-[#2F334F] data-[state=active]:text-[#D4AF37] text-[#8C7B70] font-serif text-lg transition-all"
                onClick={() => setSuggestions([])} 
              >
                <Gift className="w-5 h-5 mr-2" /> Gifting
              </TabsTrigger>
              <TabsTrigger 
                value="decor" 
                className="rounded-full h-full data-[state=active]:bg-[#2F334F] data-[state=active]:text-[#D4AF37] text-[#8C7B70] font-serif text-lg transition-all"
                onClick={() => setSuggestions([])}
              >
                <Home className="w-5 h-5 mr-2" /> Decor
              </TabsTrigger>
            </TabsList>
          </div>

          <div className="min-h-125 relative"> 
            <AnimatePresence mode="wait">

              {activeTab === "gifting" && (
                <TabsContent value="gifting" asChild>
                  <motion.div
                    key="gifting"
                    variants={tabVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    className="w-full"
                  >
                    <div className="bg-[#FFFBF5]/80 backdrop-blur-md border border-[#E5DCCA] p-8 md:p-10 rounded-4xl shadow-xl relative overflow-hidden group">
                       <div className="absolute top-4 left-4 w-6 h-6 border-t-2 border-l-2 border-[#D4AF37]/50 rounded-tl-lg"></div>
                       <div className="absolute top-4 right-4 w-6 h-6 border-t-2 border-r-2 border-[#D4AF37]/50 rounded-tr-lg"></div>
                       
                       <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                          
                          <div className="space-y-4">
                             <label className="text-[#4A3526] font-medium ml-1 text-lg">Occasion <span className="text-red-400">*</span></label>
                             <Select onValueChange={setOccasion}>
                                <SelectTrigger className="h-14 bg-white border-[#D4AF37]/30 focus:ring-[#D4AF37] rounded-xl text-base px-4 shadow-sm">
                                   <SelectValue placeholder="Select Occasion" />
                                </SelectTrigger>
                                <SelectContent className="bg-[#FFFBF5] border border-[#D4AF37]/50 shadow-xl max-h-75 z-50">
                                   {OCCASIONS.map(occ => (
                                     <SelectItem 
                                       key={occ} 
                                       value={occ} 
                                       className="text-[#4A3526] focus:bg-[#F3E5AB] focus:text-[#2F334F] py-3 cursor-pointer"
                                     >
                                       {occ}
                                     </SelectItem>
                                   ))}
                                </SelectContent>
                             </Select>

                             {occasion === "Other" && (
                                <motion.div 
                                  initial={{ opacity: 0, height: 0 }} 
                                  animate={{ opacity: 1, height: "auto" }}
                                  className="pt-2"
                                >
                                  <Input 
                                    placeholder="Type your specific occasion..." 
                                    className="h-14 bg-white border-[#D4AF37]/50 focus-visible:ring-[#D4AF37] rounded-xl text-base shadow-inner"
                                    onChange={(e) => setCustomOccasion(e.target.value)}
                                    autoFocus
                                  />
                                </motion.div>
                             )}
                          </div>

                          <div className="space-y-4">
                             <label className="text-[#4A3526] font-medium ml-1 text-lg">City / State <span className="text-red-400">*</span></label>
                             <Input 
                                placeholder="e.g. Jaipur, Kerala, Mumbai" 
                                className="h-14 bg-white border-[#D4AF37]/30 focus-visible:ring-[#D4AF37] rounded-xl text-base shadow-sm"
                                onChange={(e) => setCity(e.target.value)}
                             />
                          </div>

                          <div className="space-y-4 md:col-span-2">
                             <label className="text-[#4A3526] font-medium ml-1 text-lg">Specific Preference (Optional)</label>
                             <Input 
                                placeholder="e.g. Something in Silk, Brass Idol, Under ₹5000" 
                                className="h-14 bg-white border-[#D4AF37]/30 focus-visible:ring-[#D4AF37] rounded-xl text-base shadow-sm"
                                onChange={(e) => setGiftType(e.target.value)}
                             />
                          </div>
                       </div>

                       <div className="mt-10 flex justify-center">
                          <Button 
                            onClick={handleGiftSubmit} 
                            disabled={loading || !city || !occasion || (occasion === "Other" && !customOccasion)}
                            className="h-14 px-12 rounded-full bg-[#D97742] hover:bg-[#C26635] text-white text-lg font-serif shadow-lg transition-transform active:scale-95 disabled:opacity-70 border border-[#D97742]"
                          >
                            {loading ? <Loader2 className="animate-spin mr-2" /> : <Sparkles className="mr-2" />}
                            Curate Royal Gifts
                          </Button>
                       </div>
                    </div>
                  </motion.div>
                </TabsContent>
              )}

              {activeTab === "decor" && (
                <TabsContent value="decor" asChild>
                  <motion.div
                    key="decor"
                    variants={tabVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    className="w-full"
                  >
                    <div className="bg-[#FFFBF5]/80 backdrop-blur-md border border-[#E5DCCA] p-8 md:p-10 rounded-4xl shadow-xl relative overflow-hidden min-h-100">
                       <div className="absolute bottom-4 left-4 w-6 h-6 border-b-2 border-l-2 border-[#D4AF37]/50 rounded-bl-lg"></div>
                       <div className="absolute bottom-4 right-4 w-6 h-6 border-b-2 border-r-2 border-[#D4AF37]/50 rounded-br-lg"></div>

                       <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                          <div className="space-y-4">
                             <label className="text-[#4A3526] font-medium ml-1 text-lg">Room</label>
                             <Select onValueChange={setRoom}>
                                <SelectTrigger className="h-14 bg-white border-[#D4AF37]/30 rounded-xl text-base px-4 shadow-sm">
                                   <SelectValue placeholder="Select Room" />
                                </SelectTrigger>
                                <SelectContent className="bg-[#FFFBF5] border border-[#D4AF37]/50 shadow-xl z-50">
                                   {ROOMS.map(r => (
                                     <SelectItem key={r} value={r} className="text-[#4A3526] focus:bg-[#F3E5AB] focus:text-[#2F334F] py-3 cursor-pointer">
                                       {r}
                                     </SelectItem>
                                   ))}
                                </SelectContent>
                             </Select>
                          </div>

                          <div className="space-y-4">
                             <label className="text-[#4A3526] font-medium ml-1 text-lg">Vibe / Theme</label>
                             <Select onValueChange={setVibe}>
                                <SelectTrigger className="h-14 bg-white border-[#D4AF37]/30 rounded-xl text-base px-4 shadow-sm">
                                   <SelectValue placeholder="Desired Vibe" />
                                </SelectTrigger>
                                <SelectContent className="bg-[#FFFBF5] border border-[#D4AF37]/50 shadow-xl z-50">
                                   {VIBES.map(v => (
                                     <SelectItem key={v} value={v} className="text-[#4A3526] focus:bg-[#F3E5AB] focus:text-[#2F334F] py-3 cursor-pointer">
                                       {v}
                                     </SelectItem>
                                   ))}
                                </SelectContent>
                             </Select>
                          </div>

                          <div className="space-y-4">
                             <label className="text-[#4A3526] font-medium ml-1 text-lg">Budget (Approx)</label>
                             <div className="relative">
                               <IndianRupee className="absolute left-4 top-4 w-5 h-5 text-[#D4AF37]" />
                               <Input 
                                  placeholder="e.g. 15000" 
                                  className="h-14 pl-12 bg-white border-[#D4AF37]/30 rounded-xl text-base shadow-sm"
                                  onChange={(e) => setBudget(e.target.value)}
                               />
                             </div>
                          </div>

                          <div className="space-y-4">
                             <label className="text-[#4A3526] font-medium ml-1 text-lg">Color Palette</label>
                             <Input 
                                placeholder="e.g. Earthy, Pastel, Gold" 
                                className="h-14 bg-white border-[#D4AF37]/30 rounded-xl text-base shadow-sm"
                                onChange={(e) => setColor(e.target.value)}
                             />
                          </div>
                       </div>

                       <div className="mt-10 flex justify-center">
                          <Button 
                            onClick={handleDecorSubmit} 
                            disabled={loading || !room || !vibe}
                            className="h-14 px-12 rounded-full bg-[#2F334F] hover:bg-[#1E2135] text-[#D4AF37] text-lg font-serif shadow-lg transition-transform active:scale-95 disabled:opacity-70"
                          >
                            {loading ? <Loader2 className="animate-spin mr-2" /> : <Home className="mr-2" />}
                            Design My Space
                          </Button>
                       </div>
                    </div>
                  </motion.div>
                </TabsContent>
              )}
            </AnimatePresence>
          </div>
        </Tabs>

        {suggestions.length > 0 && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-16 space-y-8"
          >
             <div className="text-center">
                <h2 className="text-3xl font-serif font-bold text-[#4A3526]">Royal Recommendations</h2>
                <div className="w-24 h-1 bg-[#D4AF37] mx-auto mt-3 rounded-full"></div>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {suggestions.map((item, idx) => (
                   <div key={idx} className="group bg-white rounded-2xl p-4 border border-[#E5DCCA] shadow-lg hover:shadow-xl hover:-translate-y-2 transition-all duration-300">
                      
                      <div className="relative h-64 w-full rounded-xl overflow-hidden mb-4 bg-gray-100">
                         <Image 
                           src={`/p${(idx % 4) + 1}.png`} 
                           alt={item.title} 
                           fill 
                           className="object-cover group-hover:scale-110 transition-transform duration-700" 
                         />
                         <div className="absolute top-3 right-3 bg-[#FFFBF5]/90 backdrop-blur px-3 py-1 rounded-full text-xs font-bold text-[#D97742] shadow-sm">
                            AI Pick
                         </div>
                      </div>

                      <h3 className="text-xl font-bold text-[#4A3526] font-serif mb-2">{item.title}</h3>
                      <p className="text-[#8C7B70] text-sm leading-relaxed mb-6 h-12 overflow-hidden">{item.desc}</p>

                      <Link href={`/shop?q=${item.searchQuery}`} className="block">
                         <Button className="w-full h-12 bg-[#F3E5AB] hover:bg-[#D4AF37] text-[#4A3526] font-medium rounded-xl border border-[#D4AF37]/50 transition-colors">
                            Search Collection <Search className="w-4 h-4 ml-2" />
                         </Button>
                      </Link>
                   </div>
                ))}
             </div>
          </motion.div>
        )}

      </div>
      
      <BackButton />
    </div>
  );
}
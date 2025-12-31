"use client";

import { useState, useEffect, useRef, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, ShoppingCart, Filter, Search, MapPin, X, Check, ChevronDown, Camera } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { motion, AnimatePresence } from "framer-motion";
import BackButton from "@/components/dashboard/BackButton";
import AutoTranslate from "@/components/ui/auto-translate";

export const dynamic = 'force-dynamic';

const CATEGORIES = ["All", "Home Decor", "Textiles", "Jewelry", "Pottery", "Metalwork", "Paintings", "Woodwork", "Stone Carving"];
const REGIONS = ["All", "Odisha", "Rajasthan", "Uttar Pradesh", "Karnataka", "Bihar", "Kashmir", "Gujarat", "West Bengal", "Tamil Nadu", "Maharashtra", "Assam"];

function SearchableDropdown({ label, options, value, onChange }: { label: string; options: string[]; value: string; onChange: (val: string) => void; }) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredOptions = options.filter(opt => opt.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="space-y-2 relative" ref={dropdownRef}>
      <label className="text-xs font-bold text-[#8C7B70] uppercase tracking-wider ml-1">{label}</label>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full h-12 px-4 flex items-center justify-between bg-white border rounded-xl text-left transition-all ${isOpen ? 'border-[#D4AF37] ring-1 ring-[#D4AF37] shadow-md' : 'border-[#E5DCCA] hover:border-[#D4AF37]/50'}`}
      >
        <span className={`text-sm ${value && value !== 'All' ? 'text-[#4A3526] font-medium' : 'text-[#8C7B70]'}`}>
          {value || `Select ${label}`}
        </span>
        <ChevronDown className={`w-4 h-4 text-[#D4AF37] transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.15 }}
            className="absolute top-full left-0 w-full mt-2 bg-[#FFFBF5] border border-[#D4AF37]/30 rounded-xl shadow-2xl z-50 overflow-hidden"
          >
            <div className="p-2 border-b border-[#E5DCCA] bg-white sticky top-0">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#8C7B70]" />
                <input 
                  type="text" placeholder={`Search...`} value={search} onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-sm bg-[#FDFBF7] border border-[#E5DCCA] rounded-lg focus:outline-none focus:border-[#D4AF37] text-[#4A3526]"
                  autoFocus
                />
              </div>
            </div>

            <div className="max-h-56 overflow-y-auto custom-scrollbar p-1">
              {filteredOptions.length > 0 ? (
                filteredOptions.map((opt) => (
                  <button
                    key={opt}
                    onClick={() => { onChange(opt); setIsOpen(false); setSearch(""); }}
                    className={`w-full flex items-center justify-between px-4 py-2.5 text-sm rounded-lg transition-colors text-left ${value === opt ? 'bg-[#D4AF37]/10 text-[#2F334F] font-semibold' : 'text-[#5D4037] hover:bg-[#F3E5AB]/30'}`}
                  >
                    {opt}
                    {value === opt && <Check className="w-4 h-4 text-[#D4AF37]" />}
                  </button>
                ))
              ) : (
                <div className="p-4 text-center text-xs text-[#8C7B70]">No results found.</div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function ShopContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const initialQuery = searchParams.get("q") || "";
  const searchMode = searchParams.get("mode") || "text";
  
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const [sort, setSort] = useState(searchParams.get("sort") || "newest");
  const [category, setCategory] = useState(searchParams.get("category") || "All");
  const [region, setRegion] = useState(searchParams.get("region") || "All");
  const [minPrice, setMinPrice] = useState(searchParams.get("min") || "");
  const [maxPrice, setMaxPrice] = useState(searchParams.get("max") || "");

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (sort !== "newest") params.append("sort", sort);
      if (category !== "All") params.append("category", category);
      if (region !== "All") params.append("region", region);
      if (minPrice) params.append("min", minPrice);
      if (maxPrice) params.append("max", maxPrice);
      if (initialQuery) params.append("q", initialQuery); 

      const query = params.toString();
      const res = await fetch(`/api/products?${query}`);
      const data = await res.json();
      setProducts(data);
      
      router.push(`/shop?${query}${searchMode === 'visual' ? '&mode=visual' : ''}`, { scroll: false });
    } catch (err) {
      console.error("Shop Error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [sort, category, region, initialQuery]);

  const containerVariants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.05 } }
  };
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <main className="min-h-screen bg-[#FDFBF7] relative overflow-hidden">
      
      <div className="absolute top-0 right-0 w-150 h-150 bg-[#D4AF37]/5 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-125 h-125 bg-[#D97742]/5 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="container mx-auto py-12 px-4 lg:px-8 relative z-10">
        
        <BackButton />

        <div className="flex flex-col md:flex-row justify-between items-end mb-10 gap-4 mt-8">
          <div>
            {initialQuery ? (
              <motion.div 
                initial={{ opacity: 0, x: -20 }} 
                animate={{ opacity: 1, x: 0 }}
                className="space-y-2"
              >
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#D4AF37]/10 text-[#D4AF37] text-xs font-bold uppercase tracking-wider border border-[#D4AF37]/20">
                   {searchMode === 'visual' ? <Camera className="w-3 h-3" /> : <Search className="w-3 h-3" />}
                   {searchMode === 'visual' ? "Visual Match Results" : "Search Results"}
                </div>
                <h1 className="text-4xl md:text-5xl font-serif font-bold text-[#4A3526]">
                  "{decodeURIComponent(initialQuery)}"
                </h1>
                <p className="text-[#8C7B70]">We found these treasures matching your quest.</p>
              </motion.div>
            ) : (
              <>
                <h1 className="text-4xl md:text-5xl font-serif font-bold text-[#4A3526]">Royal Marketplace</h1>
                <p className="text-[#8C7B70] mt-2 text-lg">Curated treasures from the heart of India.</p>
              </>
            )}
          </div>
          
          <Button className="md:hidden bg-[#2F334F] text-white" onClick={() => setIsFilterOpen(!isFilterOpen)}>
            <Filter className="w-4 h-4 mr-2" /> Filters
          </Button>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 items-start">
          
          <motion.aside 
            initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }}
            className={`w-full lg:w-72 bg-white/80 backdrop-blur-md p-6 rounded-4xl border border-[#E5DCCA] shadow-xl sticky top-24 z-30 ${isFilterOpen ? 'block' : 'hidden lg:block'}`}
          >
            <div className="flex items-center justify-between mb-6 border-b border-[#E5DCCA] pb-4">
              <div className="flex items-center gap-2 text-[#4A3526]"><Filter className="w-5 h-5 text-[#D4AF37]" /><h2 className="text-xl font-serif font-bold">Refine</h2></div>
              <button onClick={() => { setCategory("All"); setRegion("All"); setMinPrice(""); setMaxPrice(""); setSort("newest"); router.push('/shop'); }} className="text-xs text-[#D97742] hover:underline">Reset</button>
            </div>

            <div className="space-y-6">

              <div className="space-y-2">
                <label className="text-xs font-bold text-[#8C7B70] uppercase tracking-wider ml-1">Sort By</label>
                <Select value={sort} onValueChange={setSort}>
                   <SelectTrigger className="w-full h-12 bg-white border-[#E5DCCA] rounded-xl text-[#4A3526] focus:ring-[#D4AF37]">
                      <SelectValue placeholder="Sort" />
                   </SelectTrigger>
                   <SelectContent className="bg-[#FFFBF5] border-[#D4AF37]/20">
                      <SelectItem value="newest">Newest Arrivals</SelectItem>
                      <SelectItem value="price-low">Price: Low to High</SelectItem>
                      <SelectItem value="price-high">Price: High to Low</SelectItem>
                   </SelectContent>
                </Select>
              </div>

              <SearchableDropdown label="Category" options={CATEGORIES} value={category} onChange={setCategory} />
              <SearchableDropdown label="Region" options={REGIONS} value={region} onChange={setRegion} />

              <div className="space-y-2">
                <label className="text-xs font-bold text-[#8C7B70] uppercase tracking-wider ml-1">Price (₹)</label>
                <div className="flex gap-3">
                  <Input type="number" placeholder="Min" value={minPrice} onChange={(e) => setMinPrice(e.target.value)} className="bg-white border-[#E5DCCA] rounded-xl h-12" />
                  <Input type="number" placeholder="Max" value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)} className="bg-white border-[#E5DCCA] rounded-xl h-12" />
                </div>
              </div>

              <Button onClick={fetchProducts} className="w-full h-14 bg-[#2F334F] hover:bg-[#1E120B] text-white rounded-xl font-serif tracking-wide shadow-lg mt-4 text-lg">
                Apply Filters
              </Button>
            </div>
          </motion.aside>

          <section className="grow min-h-[80vh] w-full">
            {loading ? (
              <div className="h-96 flex flex-col items-center justify-center gap-4">
                <Loader2 className="w-12 h-12 animate-spin text-[#D4AF37]" />
                <p className="text-[#8C7B70] font-serif animate-pulse">Curating collection...</p>
              </div>
            ) : (
              <>
                <div className="flex justify-between items-center mb-6 px-2">
                  <p className="text-[#8C7B70] text-sm">Showing <strong className="text-[#4A3526]">{products.length}</strong> masterpieces</p>
                </div>

                {products.length === 0 ? (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-20 bg-white/50 rounded-4xl border border-dashed border-[#D4AF37]/30">
                    <Search className="w-16 h-16 text-[#E5DCCA] mx-auto mb-4" />
                    <h3 className="text-2xl font-serif font-bold text-[#4A3526]">No treasures found</h3>
                    <p className="text-[#8C7B70] mt-2">Try adjusting your filters or search terms.</p>
                    <Button 
                      onClick={() => router.push('/shop')} 
                      variant="link" 
                      className="text-[#D97742] mt-2 font-bold"
                    >
                      Clear Search
                    </Button>
                  </motion.div>
                ) : (
                  <motion.div 
                    variants={containerVariants}
                    initial="hidden"
                    animate="show"
                    className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6"
                  >
                    {products.map((product: any) => (
                      <motion.div 
                        key={product.id} 
                        variants={itemVariants}
                        className="group bg-white rounded-3xl border border-[#E5DCCA] overflow-hidden hover:shadow-2xl hover:border-[#D4AF37]/50 transition-all duration-500 hover:-translate-y-2 flex flex-col h-full"
                      >
                        <div className="relative h-64 w-full overflow-hidden bg-[#F9F5F0]">
                          <Image src={product.images[0] || "/p1.png"} alt={product.title} fill className="object-cover group-hover:scale-110 transition-transform duration-700" />
                          <div className="absolute top-4 left-4"><Badge className="bg-white/90 backdrop-blur text-[#4A3526] border border-[#E5DCCA] shadow-sm hover:bg-white"><AutoTranslate text={product.category} /></Badge></div>
                          <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        </div>

                        <div className="p-6 flex flex-col grow">
                          <div className="mb-4 grow">
                            <div className="flex justify-between items-start mb-2 gap-2">
                              <h3 className="font-serif font-bold text-lg text-[#4A3526] line-clamp-1 group-hover:text-[#D97742] transition-colors"> <AutoTranslate text={product.title} /></h3>
                              <p className="text-lg font-bold text-[#2F334F] whitespace-nowrap">₹{product.price}</p>
                            </div>
                            
                            <div className="flex items-center gap-1 text-xs text-[#8C7B70] mb-3">
                              <MapPin className="w-3 h-3 text-[#D4AF37]" /> {product.artisan?.profile?.state || "India"}
                            </div>
                            
                            <p className="text-sm text-[#5D4037]/80 line-clamp-2 leading-relaxed"><AutoTranslate text={product.description} /></p>
                          </div>
                          
                          <Link href={`/shop/${product.id}`} className="block mt-auto">
                            <Button className="w-full h-12 bg-[#FDFBF7] border-2 border-[#D4AF37] text-[#D4AF37] hover:bg-[#D4AF37] hover:text-white font-bold rounded-xl gap-2 transition-all shadow-sm hover:shadow-md">
                              <ShoppingCart className="w-4 h-4" /> View Details
                            </Button>
                          </Link>
                        </div>
                      </motion.div>
                    ))}
                  </motion.div>
                )}
              </>
            )}
          </section>
        </div>
      </div>
    </main>
  );
}

export default function ShopPage() {
  return (
    <Suspense fallback={<div className="h-screen flex items-center justify-center bg-[#FDFBF7]"><Loader2 className="w-10 h-10 animate-spin text-[#D4AF37]" /></div>}>
      <ShopContent />
    </Suspense>
  );
}
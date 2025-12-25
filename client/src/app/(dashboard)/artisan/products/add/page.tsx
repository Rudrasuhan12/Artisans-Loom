"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Mic, Image as ImageIcon, Sparkles, Loader2, X, Upload } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

export default function AddProductPage() {
  const [isListening, setIsListening] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const toggleVoiceMode = () => {
    setIsListening(!isListening);
    if (!isListening) {
      setTimeout(() => {
        setIsListening(false);
        setIsGenerating(true);
        setTimeout(() => {
          setTitle("Handwoven Banarasi Silk Saree");
          setPrice("15000");
          setCategory("Textile");
          setDescription("A magnificent crimson saree woven with pure gold zari threads, featuring traditional floral motifs inspired by Mughal gardens.");
          setIsGenerating(false);
        }, 2000);
      }, 4000);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setPreviewImage(url);
    }
  };

  return (
    <div className="min-h-screen relative pb-20">
      
      <div className="absolute top-0 right-0 w-125 h-125 bg-[#D4AF37]/5 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="flex justify-between items-center mb-8">
        <div>
           <h1 className="text-4xl font-serif font-bold text-[#4A3526]">Creation Studio</h1>
           <p className="text-[#8C7B70]">Add a new masterpiece to your collection.</p>
        </div>
        
        <Button 
          onClick={toggleVoiceMode}
          className={`h-12 px-6 rounded-full transition-all duration-500 border ${
            isListening 
              ? "bg-red-500 hover:bg-red-600 border-red-400 animate-pulse text-white" 
              : "bg-white hover:bg-[#FFF5E1] text-[#D97742] border-[#D97742]"
          }`}
        >
          {isListening ? (
             <><Mic className="w-5 h-5 mr-2 animate-bounce" /> Listening...</>
          ) : (
             <><Mic className="w-5 h-5 mr-2" /> Voice Listing</>
          )}
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        
        <motion.div 
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          className="lg:col-span-7 space-y-8"
        >
          <div className="bg-white rounded-4xl p-8 border border-[#E5DCCA] shadow-xl relative overflow-hidden">
             
             <AnimatePresence>
               {isGenerating && (
                 <motion.div 
                   initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                   className="absolute inset-0 bg-white/80 backdrop-blur-sm z-50 flex flex-col items-center justify-center text-[#D97742]"
                 >
                    <Sparkles className="w-12 h-12 mb-4 animate-spin-slow" />
                    <p className="font-serif text-xl">Crafting details from your voice...</p>
                 </motion.div>
               )}
             </AnimatePresence>

             <div className="space-y-6">
                <div>
                   <label className="text-sm font-bold text-[#4A3526] ml-1">Product Title</label>
                   <Input 
                     value={title}
                     onChange={(e) => setTitle(e.target.value)}
                     className="h-14 mt-2 bg-[#FDFBF7] border-[#E5DCCA] focus-visible:ring-[#D4AF37] text-lg rounded-xl"
                     placeholder="e.g. Royal Blue Pottery Vase"
                   />
                </div>

                <div className="grid grid-cols-2 gap-6">
                   <div>
                      <label className="text-sm font-bold text-[#4A3526] ml-1">Price (₹)</label>
                      <Input 
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        className="h-14 mt-2 bg-[#FDFBF7] border-[#E5DCCA] focus-visible:ring-[#D4AF37] text-lg rounded-xl"
                        placeholder="2500"
                        type="number"
                      />
                   </div>
                   <div>
                      <label className="text-sm font-bold text-[#4A3526] ml-1">Category</label>
                      <Input 
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className="h-14 mt-2 bg-[#FDFBF7] border-[#E5DCCA] focus-visible:ring-[#D4AF37] text-lg rounded-xl"
                        placeholder="Pottery, Textile..."
                      />
                   </div>
                </div>

                <div>
                   <label className="text-sm font-bold text-[#4A3526] ml-1">The Story (Description)</label>
                   <Textarea 
                     value={description}
                     onChange={(e) => setDescription(e.target.value)}
                     className="min-h-37.5 mt-2 bg-[#FDFBF7] border-[#E5DCCA] focus-visible:ring-[#D4AF37] text-base rounded-xl leading-relaxed resize-none"
                     placeholder="Describe the heritage, materials, and process..."
                   />
                </div>
             </div>
          </div>

          <div className="flex justify-end gap-4">
             <Button variant="ghost" className="h-14 px-8 rounded-xl text-[#8C7B70] hover:bg-white">
               Cancel
             </Button>
             <Button className="h-14 px-10 rounded-xl bg-[#2F334F] hover:bg-[#1E2135] text-[#FDFBF7] text-lg font-serif shadow-lg">
               Publish Masterpiece
             </Button>
          </div>
        </motion.div>

        <motion.div 
          initial={{ x: 20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-5 space-y-6"
        >
           <p className="text-sm font-bold text-[#8C7B70] uppercase tracking-wider text-center">Live Preview</p>
           
           <div className="relative w-full aspect-3/4 bg-white rounded-4xl border-8 border-white shadow-2xl overflow-hidden group">

              <div className="relative h-2/3 w-full bg-[#F5F5F5] flex flex-col items-center justify-center cursor-pointer hover:bg-[#F0F0F0] transition-colors overflow-hidden">
                 
                 {previewImage ? (
                    <>
                      <Image src={previewImage} alt="Preview" fill className="object-cover" />
                      <button 
                        onClick={() => setPreviewImage(null)}
                        className="absolute top-4 right-4 bg-black/50 p-2 rounded-full text-white hover:bg-red-500 transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </>
                 ) : (
                    <label className="flex flex-col items-center cursor-pointer w-full h-full justify-center">
                       <div className="w-16 h-16 rounded-full bg-[#D4AF37]/10 flex items-center justify-center mb-4">
                          <Upload className="w-8 h-8 text-[#D4AF37]" />
                       </div>
                       <span className="text-[#8C7B70] font-medium">Click to upload image</span>
                       <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
                    </label>
                 )}
              </div>

              <div className="absolute bottom-0 left-0 w-full h-1/3 bg-[#FFFBF5] p-6 flex flex-col justify-between border-t border-[#E5DCCA]">
                 <div>
                    <span className="px-3 py-1 rounded-full bg-[#2F334F] text-[#D4AF37] text-[10px] font-bold uppercase tracking-wider">
                       {category || "Category"}
                    </span>
                    <h3 className="text-2xl font-serif font-bold text-[#4A3526] mt-2 line-clamp-1">
                       {title || "Product Title"}
                    </h3>
                 </div>
                 <div className="flex justify-between items-end">
                    <p className="text-3xl font-serif font-bold text-[#D97742]">
                       ₹{price || "0"}
                    </p>
                    <div className="text-right">
                       <p className="text-xs text-[#8C7B70]">Stock</p>
                       <p className="font-bold text-[#2F334F]">In Stock</p>
                    </div>
                 </div>
              </div>

           </div>
        </motion.div>

      </div>
    </div>
  );
}
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Sparkles, Loader2, Image as ImageIcon, X, Upload } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { updateProductAction, generateDescriptionAction } from "@/app/actions/products";
import { toast } from "sonner";

export default function EditProductForm({ product }: { product: any }) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [title, setTitle] = useState(product.title);
  const [price, setPrice] = useState(product.price.toString());
  const [stock, setStock] = useState(product.stock.toString());
  const [category, setCategory] = useState(product.category);
  const [description, setDescription] = useState(product.description);

  const [previewImage, setPreviewImage] = useState<string | null>(product.images[0] || null);
  const [imageBase64, setImageBase64] = useState<string>(product.images[0] || "");

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setPreviewImage(result);
        setImageBase64(result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAutoGenerate = async () => {
    setIsProcessing(true);
    try {
      const desc = await generateDescriptionAction(title, category);
      setDescription(desc);
      toast.success("Description refreshed!");
    } catch (error) {
      toast.error("Failed to generate description.");
    }
    setIsProcessing(false);
  };

  const handleSubmit = async (formData: FormData) => {
    setIsSaving(true);

    formData.set("id", product.id);
    formData.set("image", imageBase64);

    try {
      await updateProductAction(formData);
      toast.success("Masterpiece updated successfully!");
    } catch (error) {
      console.error(error);
      toast.error("Failed to update product.");
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen relative pb-20">
      
      <div className="absolute top-0 right-0 w-125 h-125 bg-[#D4AF37]/5 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="mb-8">
         <h1 className="text-4xl font-serif font-bold text-[#4A3526]">Refine Masterpiece</h1>
         <p className="text-[#8C7B70]">Update details or stock for your existing item.</p>
      </div>

      <form action={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-12">

        <motion.div initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="lg:col-span-7 space-y-8">
          <div className="bg-white rounded-4xl p-8 border border-[#E5DCCA] shadow-xl relative overflow-hidden">

             <AnimatePresence>
               {isProcessing && (
                 <motion.div 
                   initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                   className="absolute inset-0 bg-white/80 backdrop-blur-sm z-50 flex flex-col items-center justify-center text-[#D97742]"
                 >
                    <Sparkles className="w-12 h-12 mb-4 animate-spin-slow" />
                    <p className="font-serif text-xl">Polishing details...</p>
                 </motion.div>
               )}
             </AnimatePresence>

             <div className="space-y-6">
                <div>
                   <label className="text-sm font-bold text-[#4A3526] ml-1">Product Title</label>
                   <Input name="title" value={title} onChange={(e) => setTitle(e.target.value)} className="h-14 mt-2 bg-[#FDFBF7] border-[#E5DCCA] focus-visible:ring-[#D4AF37] text-lg rounded-xl" required />
                </div>

                <div className="grid grid-cols-3 gap-4">
                   <div>
                      <label className="text-sm font-bold text-[#4A3526] ml-1">Price (₹)</label>
                      <Input name="price" value={price} onChange={(e) => setPrice(e.target.value)} className="h-14 mt-2 bg-[#FDFBF7] border-[#E5DCCA] focus-visible:ring-[#D4AF37] text-lg rounded-xl" type="number" required />
                   </div>
                   <div>
                      <label className="text-sm font-bold text-[#4A3526] ml-1">Stock</label>
                      <Input name="stock" value={stock} onChange={(e) => setStock(e.target.value)} className="h-14 mt-2 bg-[#FDFBF7] border-[#E5DCCA] focus-visible:ring-[#D4AF37] text-lg rounded-xl" type="number" min="0" required />
                   </div>
                   <div>
                      <label className="text-sm font-bold text-[#4A3526] ml-1">Category</label>
                      <Input name="category" value={category} onChange={(e) => setCategory(e.target.value)} className="h-14 mt-2 bg-[#FDFBF7] border-[#E5DCCA] focus-visible:ring-[#D4AF37] text-lg rounded-xl" required />
                   </div>
                </div>

                <div>
                   <div className="flex justify-between items-center mb-2">
                      <label className="text-sm font-bold text-[#4A3526] ml-1">The Story</label>
                      <Button type="button" onClick={handleAutoGenerate} variant="ghost" className="h-8 text-xs text-[#D97742] hover:bg-[#FFF5E1]">
                         <Sparkles className="w-3 h-3 mr-1" /> Re-Write
                      </Button>
                   </div>
                   <Textarea name="description" value={description} onChange={(e) => setDescription(e.target.value)} className="min-h-37.5 bg-[#FDFBF7] border-[#E5DCCA] focus-visible:ring-[#D4AF37] text-base rounded-xl resize-none" required />
                </div>
             </div>
          </div>

          <div className="flex justify-end gap-4">
             <Button 
                type="submit" 
                disabled={isSaving}
                className="h-14 px-10 rounded-xl bg-[#2F334F] hover:bg-[#1E2135] text-[#FDFBF7] text-lg font-serif shadow-lg w-full transition-all"
             >
               {isSaving ? (
                 <>
                   <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                   Saving Changes...
                 </>
               ) : (
                 "Save Changes"
               )}
             </Button>
          </div>
        </motion.div>

        <motion.div initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="lg:col-span-5 space-y-6">
           <p className="text-sm font-bold text-[#8C7B70] uppercase tracking-wider text-center">Live Preview</p>
           
           <div className="relative w-full aspect-3/4 bg-white rounded-4xl border-8 border-white shadow-2xl overflow-hidden group">
              <div className="relative h-2/3 w-full bg-[#F5F5F5] flex flex-col items-center justify-center cursor-pointer hover:bg-[#F0F0F0] transition-colors overflow-hidden">
                 {previewImage ? (
                    <>
                      <Image src={previewImage} alt="Preview" fill className="object-cover" />
                      <button 
                        type="button"
                        onClick={() => { setPreviewImage(null); setImageBase64(""); }}
                        className="absolute top-4 right-4 bg-black/50 p-2 rounded-full text-white hover:bg-red-500 transition-colors z-10"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </>
                 ) : (
                    <label className="flex flex-col items-center cursor-pointer w-full h-full justify-center">
                       <div className="w-16 h-16 rounded-full bg-[#D4AF37]/10 flex items-center justify-center mb-4">
                          <Upload className="w-8 h-8 text-[#D4AF37]" />
                       </div>
                       <span className="text-[#8C7B70] font-medium">Change Photo</span>
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
                       <p className="font-bold text-[#2F334F]">{stock || 0} Units</p>
                    </div>
                 </div>
              </div>
           </div>
        </motion.div>

      </form>
    </div>
  );
}
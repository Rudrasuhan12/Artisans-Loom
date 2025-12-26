"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Mic, StopCircle, Upload, X, Sparkles, Loader2, Image as ImageIcon } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { createProductAction, generateDescriptionAction, processVoiceListingAction } from "@/app/actions/products";
import { toast } from "sonner";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function AddProductPage() {
  const [isListening, setIsListening] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("1");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [language, setLanguage] = useState("Hindi"); 

  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [imageBase64, setImageBase64] = useState<string>(""); 

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

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      const chunks: BlobPart[] = [];

      mediaRecorder.ondataavailable = (e) => chunks.push(e.data);
      
      mediaRecorder.onstop = async () => {
        setIsProcessing(true);
        const blob = new Blob(chunks, { type: 'audio/mp3' });
        const reader = new FileReader();
        reader.readAsDataURL(blob);
        
        reader.onloadend = async () => {
          const base64Audio = (reader.result as string).split(',')[1];
          const data = await processVoiceListingAction(base64Audio, language);
          
          if (data) {
            setTitle(data.title || "");
            setPrice(data.price?.toString() || "");
            setStock(data.stock?.toString() || "1");
            setCategory(data.category || "");
            setDescription(data.description || "");
            toast.success("Voice listing processed successfully!");
          } else {
            toast.error("Could not understand audio. Please try again.");
          }
          setIsProcessing(false);
        };
      };

      mediaRecorder.start();
      setIsListening(true);
    } catch (err) {
      console.error("Mic Error:", err);
      toast.error("Microphone access denied. Check browser permissions.");
    }
  };

  const stopRecording = () => {
    mediaRecorderRef.current?.stop();
    setIsListening(false);
  };

  const handleAutoGenerate = async () => {
    if (!title || !category) {
      toast.error("Please enter a Title and Category first.");
      return;
    }
    setIsProcessing(true);
    try {
      const desc = await generateDescriptionAction(title, category);
      setDescription(desc);
      toast.success("Description woven by AI!");
    } catch (error) {
      toast.error("Failed to generate description.");
    }
    setIsProcessing(false);
  };

  const handleSubmit = async (formData: FormData) => {
    if (!title || !price || !category) {
      toast.error("Please fill in all required fields.");
      return;
    }

    setIsPublishing(true);
    
    formData.set("image", imageBase64);

    try {
      await createProductAction(formData);
      toast.success("Masterpiece published successfully!");
    } catch (error) {
      console.error(error);
      toast.error("Failed to publish product.");
      setIsPublishing(false);
    }
  };

  return (
    <div className="min-h-screen relative pb-20">
      
      <div className="absolute top-0 right-0 w-125 h-125 bg-[#D4AF37]/5 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
           <h1 className="text-4xl font-serif font-bold text-[#4A3526]">Creation Studio</h1>
           <p className="text-[#8C7B70]">Add a new masterpiece to your collection.</p>
        </div>
        
        <div className="flex items-center gap-3 bg-white p-2 rounded-full border border-[#D4AF37]/30 shadow-sm pl-4">
           <Select value={language} onValueChange={setLanguage}>
              <SelectTrigger className="h-10 w-27.5 rounded-full border border-[#E5DCCA] bg-[#FDFBF7] focus:ring-[#D4AF37] text-[#4A3526] text-sm">
                 <SelectValue placeholder="Language" />
              </SelectTrigger>
              <SelectContent className="bg-white border-[#D4AF37]/20">
                 <SelectItem value="Hindi">Hindi</SelectItem>
                 <SelectItem value="Bengali">Bengali</SelectItem>
                 <SelectItem value="Tamil">Tamil</SelectItem>
                 <SelectItem value="English">English</SelectItem>
                 <SelectItem value="Odia">Odia</SelectItem>
              </SelectContent>
           </Select>

           <Button 
             onClick={isListening ? stopRecording : startRecording}
             className={`h-10 px-6 rounded-full transition-all duration-300 shadow-md ${
               isListening 
                 ? "bg-red-500 hover:bg-red-600 animate-pulse text-white border-2 border-red-200" 
                 : "bg-[#2F334F] hover:bg-[#1E2135] text-[#D4AF37] border border-[#2F334F]"
             }`}
           >
             {isListening ? (
                <><StopCircle className="w-4 h-4 mr-2" /> Stop Recording</>
             ) : (
                <><Mic className="w-4 h-4 mr-2" /> Voice Listing</>
             )}
           </Button>
        </div>
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
                    <p className="font-serif text-xl">Weaving magic with AI...</p>
                 </motion.div>
               )}
             </AnimatePresence>

             <div className="space-y-6">
                <div>
                   <label className="text-sm font-bold text-[#4A3526] ml-1">Product Title</label>
                   <Input 
                     name="title" 
                     value={title} 
                     onChange={(e) => setTitle(e.target.value)} 
                     className="h-14 mt-2 bg-[#FDFBF7] border-[#E5DCCA] focus-visible:ring-[#D4AF37] text-lg rounded-xl" 
                     required 
                   />
                </div>

                <div className="grid grid-cols-3 gap-4">
                   <div>
                      <label className="text-sm font-bold text-[#4A3526] ml-1">Price (₹)</label>
                      <Input 
                        name="price" 
                        value={price} 
                        onChange={(e) => setPrice(e.target.value)} 
                        className="h-14 mt-2 bg-[#FDFBF7] border-[#E5DCCA] focus-visible:ring-[#D4AF37] text-lg rounded-xl" 
                        type="number" 
                        required 
                      />
                   </div>
                   <div>
                      <label className="text-sm font-bold text-[#4A3526] ml-1">Stock</label>
                      <Input 
                        name="stock" 
                        value={stock} 
                        onChange={(e) => setStock(e.target.value)} 
                        className="h-14 mt-2 bg-[#FDFBF7] border-[#E5DCCA] focus-visible:ring-[#D4AF37] text-lg rounded-xl" 
                        type="number" 
                        min="1" 
                        required 
                      />
                   </div>
                   <div>
                      <label className="text-sm font-bold text-[#4A3526] ml-1">Category</label>
                      <Input 
                        name="category" 
                        value={category} 
                        onChange={(e) => setCategory(e.target.value)} 
                        className="h-14 mt-2 bg-[#FDFBF7] border-[#E5DCCA] focus-visible:ring-[#D4AF37] text-lg rounded-xl" 
                        required 
                      />
                   </div>
                </div>

                <div>
                   <div className="flex justify-between items-center mb-2">
                      <label className="text-sm font-bold text-[#4A3526] ml-1">The Story (Description)</label>
                      <Button type="button" onClick={handleAutoGenerate} variant="ghost" className="h-8 text-xs text-[#D97742] hover:bg-[#FFF5E1]">
                         <Sparkles className="w-3 h-3 mr-1" /> Auto-Write
                      </Button>
                   </div>
                   <Textarea 
                     name="description" 
                     value={description} 
                     onChange={(e) => setDescription(e.target.value)} 
                     className="min-h-37.5 bg-[#FDFBF7] border-[#E5DCCA] focus-visible:ring-[#D4AF37] text-base rounded-xl leading-relaxed resize-none" 
                     required 
                   />
                </div>
             </div>
          </div>

          <div className="flex justify-end gap-4">
             <Button 
                type="submit" 
                disabled={isPublishing}
                className="h-14 px-10 rounded-xl bg-[#2F334F] hover:bg-[#1E2135] text-[#FDFBF7] text-lg font-serif shadow-lg w-full transition-all"
             >
               {isPublishing ? (
                 <>
                   <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                   Publishing Masterpiece...
                 </>
               ) : (
                 "Publish Masterpiece"
               )}
             </Button>
          </div>
        </motion.div>

        <motion.div initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.2 }} className="lg:col-span-5 space-y-6">
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
                       <span className="text-[#8C7B70] font-medium">Click to upload photo</span>
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
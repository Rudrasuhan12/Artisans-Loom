"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { Edit, Trash2, Sparkles, Video, Gavel } from "lucide-react";
import { Button } from "@/components/ui/button";
import { deleteProductAction } from "@/app/actions/products";
import PremiumAlert from "@/components/ui/premium-alert";
import MarketingGeneratorModal from "./MarketingGeneratorModal";
import ReelScriptModal from "./ReelScriptModal"; 
import AuctionModal from "./AuctionModal";
import { generateReelScript } from "@/app/actions/marketing"; 
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface ProductProps {
  id: string;
  title: string;
  price: string;
  stock: number;
  image: string;
  category: string;
  index: number;
  description: string;   
  materials: string[];  
}

export default function ProductCard({ 
  id, title, price, stock, image, category, index, description, materials 
}: ProductProps) {
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [isMarketingOpen, setIsMarketingOpen] = useState(false);
  const [isReelOpen, setIsReelOpen] = useState(false);
  const [isGeneratingReel, setIsGeneratingReel] = useState(false);
  const [reelScript, setReelScript] = useState<any>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await deleteProductAction(id);
      toast.success("Product deleted successfully");
      setIsAlertOpen(false);
    } catch (error) {
      toast.error("Failed to delete product");
      setIsDeleting(false);
    }
  };

  const handleCreateReel = async () => {
    setIsReelOpen(true);
    setIsGeneratingReel(true);
    try {
      const script = await generateReelScript({ title, category, materials, description });
      setReelScript(script);
    } catch (err) {
      toast.error("Could not generate script. Please try again.");
      setIsReelOpen(false);
    } finally {
      setIsGeneratingReel(false);
    }
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ delay: index * 0.1, duration: 0.5 }}
        className="group relative bg-[#FFFBF5] rounded-3xl overflow-hidden border border-[#E5DCCA] shadow-md hover:shadow-2xl transition-all duration-500 hover:-translate-y-2"
      >
        <div className="relative h-64 w-full overflow-hidden">
          <Image 
            src={image} 
            alt={title} 
            fill 
            className="object-cover transition-transform duration-700 group-hover:scale-110" 
          />
          
          <div className="absolute inset-0 bg-linear-to-t from-[#2C1810]/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

          <div className="absolute bottom-4 right-4 flex gap-2 translate-y-10 group-hover:translate-y-0 transition-transform duration-300">
            
            <AuctionModal productId={id} />

            <Button 
              size="icon" 
              onClick={handleCreateReel}
              className="h-10 w-10 rounded-full bg-white/20 backdrop-blur-md border border-white/30 hover:bg-[#D97742] text-white shadow-lg"
              title="Create AI Reel Script"
            >
              <Video className="w-4 h-4" />
            </Button>

            <Button 
              size="icon" 
              onClick={() => setIsMarketingOpen(true)}
              className="h-10 w-10 rounded-full bg-white/20 backdrop-blur-md border border-white/30 hover:bg-[#D4AF37] hover:border-[#D4AF37] text-white shadow-lg"
              title="AI Marketing Studio"
            >
              <Sparkles className="w-4 h-4" />
            </Button>

            <Link href={`/artisan/edit/${id}`}>
              <Button 
                size="icon" 
                className="h-10 w-10 rounded-full bg-white/20 backdrop-blur-md border border-white/30 hover:bg-[#D4AF37] hover:border-[#D4AF37] text-white"
              >
                <Edit className="w-4 h-4" />
              </Button>
            </Link>

            <Button 
              size="icon" 
              onClick={() => setIsAlertOpen(true)}
              className="h-10 w-10 rounded-full bg-white/20 backdrop-blur-md border border-white/30 hover:bg-red-500 hover:border-red-500 text-white"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>

          <div className="absolute top-4 left-4">
             <span className="px-3 py-1 rounded-full bg-[#FFFBF5]/90 backdrop-blur border border-[#D4AF37]/30 text-[#4A3526] text-xs font-bold uppercase tracking-wider shadow-sm">
               {category}
             </span>
          </div>
        </div>

        <div className="p-6 relative">
          <div className="absolute top-0 left-6 right-6 h-px bg-linear-to-r from-transparent via-[#D4AF37]/50 to-transparent"></div>

          <h3 className="text-xl font-serif font-bold text-[#4A3526] mb-1 line-clamp-1">{title}</h3>
          
          <div className="flex justify-between items-end mt-4">
             <div>
               <p className="text-xs text-[#8C7B70] uppercase tracking-wide">Price</p>
               <p className="text-2xl font-serif font-bold text-[#D97742]">₹{price}</p>
             </div>
             <div className="text-right">
               <p className="text-xs text-[#8C7B70] uppercase tracking-wide">Stock</p>
               <p className={`text-lg font-bold ${stock < 5 ? 'text-red-500' : 'text-[#2F334F]'}`}>
                 {stock} <span className="text-xs font-normal text-[#8C7B70]">units</span>
               </p>
             </div>
          </div>
        </div>
      </motion.div>

      <MarketingGeneratorModal 
        isOpen={isMarketingOpen}
        onClose={() => setIsMarketingOpen(false)}
        product={{ title, category, materials, description }}
      />

      <ReelScriptModal 
        isOpen={isReelOpen}
        onClose={() => setIsReelOpen(false)}
        script={reelScript}
        isLoading={isGeneratingReel}
        productName={title}
      />

      <PremiumAlert 
        isOpen={isAlertOpen}
        onClose={() => setIsAlertOpen(false)}
        onConfirm={handleDelete}
        isLoading={isDeleting}
        title="Delete Masterpiece?"
        description="Are you sure you want to remove this item? This action cannot be undone and it will be removed from the marketplace."
      />
    </>
  );
}
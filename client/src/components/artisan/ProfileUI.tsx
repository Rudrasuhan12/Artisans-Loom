"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { MapPin, Calendar, UserPlus, Check, Award, Star } from "lucide-react";
import PremiumAvatar from "@/components/ui/premium-avatar";
import SafeImage from "@/components/ui/safe-image";
import Link from "next/link";
import { format } from "date-fns";
import { toggleFollowAction } from "@/app/actions/forum";
import { useState } from "react";
import { toast } from "sonner";
import ReviewSection from "./ReviewSection";
import AutoTranslate from "@/components/ui/auto-translate";

export default function ProfileUI({ artisan, currentUser, isFollowing, isMe }: any) {
  const [following, setFollowing] = useState(isFollowing);

  const handleFollow = async () => {
    setFollowing(!following);
    await toggleFollowAction(artisan.id);
    toast.success(following ? "Unfollowed" : "Following Artisan");
  };

  const reviews = artisan.reviewsReceived || [];
  const totalRating = reviews.reduce((acc: number, r: any) => acc + r.rating, 0);
  const averageRating = reviews.length > 0 ? (totalRating / reviews.length).toFixed(1) : "New";

  return (
    <div className="min-h-screen bg-[#FDFBF7] relative overflow-x-hidden pb-20 selection:bg-[#D4AF37] selection:text-white">
      
      <div className="relative h-[45vh] w-full overflow-hidden bg-[#2C1810]">
         <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/black-scales.png')] opacity-30 animate-pulse-slow"></div>
         <div className="absolute inset-0 bg-linear-to-t from-[#2C1810] via-transparent to-transparent opacity-90"></div>
         <motion.div 
            animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
            transition={{ duration: 5, repeat: Infinity }}
            className="absolute top-[-20%] left-[20%] w-125 h-125 bg-[#D4AF37]/20 rounded-full blur-[100px]"
         />
      </div>

      <div className="container mx-auto px-4 relative z-10 -mt-32">
        
        <motion.div 
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="bg-white/80 backdrop-blur-xl border border-white/50 rounded-[3rem] shadow-[0_20px_60px_rgba(44,24,16,0.1)] p-8 md:p-12 flex flex-col md:flex-row items-center md:items-start gap-8 md:gap-12"
        >
           
           <div className="relative group">
              <div className="absolute -inset-1 bg-linear-to-br from-[#D4AF37] via-[#F3E5AB] to-[#8B6508] rounded-full blur opacity-40 group-hover:opacity-70 transition-opacity"></div>
              <div className="relative p-1 bg-white rounded-full">
                 
                 <PremiumAvatar 
                   src={artisan.image}
                   name={artisan.name || "Artisan"} 
                   size="xl" 
                   className="w-40 h-40 border-4 border-white shadow-inner" 
                 />

              </div>
              <div className="absolute bottom-2 right-2 bg-[#2F334F] text-[#D4AF37] p-2 rounded-full border-4 border-white shadow-lg">
                 <Award className="w-5 h-5" />
              </div>
           </div>

           <div className="flex-1 text-center md:text-left space-y-4">
              <div>
                 <div className="flex flex-col md:flex-row items-center md:items-baseline gap-3 mb-2">
                    <h1 className="text-4xl md:text-5xl font-serif font-bold text-[#2C1810]">
                      {artisan.name}
                    </h1>
                    <span className="px-3 py-1 bg-[#F3E5AB]/50 border border-[#D4AF37]/30 text-[#4A3526] text-xs font-bold uppercase tracking-widest rounded-full">
                      <AutoTranslate text={artisan.profile?.craftType || "Master Artisan"} />
                    </span>
                 </div>
                 
                 <div className="flex flex-wrap justify-center md:justify-start gap-6 text-[#8C7B70] text-sm font-medium">
                    <span className="flex items-center gap-1"><MapPin className="w-4 h-4 text-[#D4AF37]" /> {artisan.profile?.location || "India"}</span>
                    <span className="flex items-center gap-1"><Calendar className="w-4 h-4 text-[#D4AF37]" /> Since {format(new Date(artisan.createdAt), 'yyyy')}</span>
                 </div>
              </div>

              <div className="flex justify-center md:justify-start gap-8 md:gap-12 pt-4 border-t border-[#E5DCCA]/50">
                 <div className="text-center md:text-left">
                    <p className="text-2xl font-serif font-bold text-[#2C1810]">{artisan._count.products}</p>
                    <p className="text-[10px] text-[#8C7B70] uppercase tracking-wider">Creations</p>
                 </div>
                 <div className="text-center md:text-left">
                    <p className="text-2xl font-serif font-bold text-[#2C1810]">{artisan._count.followedBy}</p>
                    <p className="text-[10px] text-[#8C7B70] uppercase tracking-wider">Patrons</p>
                 </div>
                 <div className="text-center md:text-left">
                    <p className="text-2xl font-serif font-bold text-[#2C1810] flex items-center justify-center md:justify-start gap-1">
                      {averageRating} <Star className="w-4 h-4 fill-[#D4AF37] text-[#D4AF37]" />
                    </p>
                    <p className="text-[10px] text-[#8C7B70] uppercase tracking-wider">{reviews.length} Reviews</p>
                 </div>
              </div>
           </div>

           {!isMe && currentUser && (
              <div className="flex flex-col gap-3 min-w-40">
                 <Button 
                   onClick={handleFollow}
                   className={`h-12 rounded-full text-sm font-bold shadow-lg transition-all ${following ? "bg-white text-[#2C1810] border border-[#E5DCCA] hover:bg-gray-50" : "bg-[#2C1810] text-white hover:bg-[#1a0f0a] hover:scale-105"}`}
                 >
                    {following ? <><Check className="w-4 h-4 mr-2" /> Following</> : <><UserPlus className="w-4 h-4 mr-2" /> Follow Studio</>}
                 </Button>
              </div>
           )}

        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mt-16">
           
           <motion.div 
             initial={{ opacity: 0, x: -20 }}
             animate={{ opacity: 1, x: 0 }}
             transition={{ delay: 0.2 }}
             className="lg:col-span-4 space-y-12"
           >
              <div>
                 <h3 className="text-2xl font-serif font-bold text-[#2C1810] mb-4 relative inline-block">
                    The Story
                    <span className="absolute -bottom-1 left-0 w-1/2 h-1 bg-[#D4AF37] rounded-full"></span>
                 </h3>
                 <div className="prose prose-brown text-[#5D4037] leading-relaxed text-lg">
                     <p>
                        <AutoTranslate text={artisan.profile?.bio || "An artist dedicated to preserving the ancient traditions of their ancestors."} />
                     </p>
                 </div>
              </div>
              
              <ReviewSection 
                artisanId={artisan.id} 
                reviews={reviews} 
                currentUser={currentUser} 
              />
           </motion.div>

           <div className="lg:col-span-8">
              <div className="flex items-center justify-between mb-8">
                 <h3 className="text-3xl font-serif font-bold text-[#2C1810]">Masterpieces</h3>
                 <span className="text-[#8C7B70] text-sm">{artisan.products.length} Items Available</span>
              </div>

              {artisan.products.length === 0 ? (
                 <div className="text-center py-20 border-2 border-dashed border-[#E5DCCA] rounded-3xl opacity-50">
                    <p className="text-[#8C7B70]">This studio is currently curating new work.</p>
                 </div>
              ) : (
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {artisan.products.map((product: any, idx: number) => (
                       <Link href={`/shop/${product.id}`} key={product.id}>
                          <motion.div 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 * idx }}
                            whileHover={{ y: -5 }}
                            className="group bg-white rounded-3xl overflow-hidden border border-[#E5DCCA] shadow-sm hover:shadow-xl transition-all duration-300"
                          >
                             <div className="relative h-64 w-full bg-[#F9F5F0] overflow-hidden">
                                <SafeImage 
                                  src={product.images[0] || "/p1.png"} 
                                  alt={product.title} 
                                  fill 
                                  className="object-cover group-hover:scale-110 transition-transform duration-700" 
                                />
                                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-xs font-bold text-[#2C1810] shadow-md">
                                   ₹{product.price}
                                </div>
                             </div>
                             <div className="p-5">
                                <h4 className="font-serif font-bold text-lg text-[#2C1810] group-hover:text-[#D97742] transition-colors">{product.title}</h4>
                                <p className="text-xs text-[#8C7B70] mt-1">{product.category}</p>
                             </div>
                          </motion.div>
                       </Link>
                    ))}
                 </div>
              )}
           </div>

        </div>

      </div>
    </div>
  );
}
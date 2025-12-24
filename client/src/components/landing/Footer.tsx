"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Facebook, Instagram, Twitter, Linkedin, Youtube, ArrowRight, MapPin, Mail, Phone } from "lucide-react";
import Image from "next/image";

export default function Footer() {
  return (
    <footer className="relative w-full pt-20 pb-10 overflow-hidden bg-[#1A1D2E] text-[#FDFBF7]">

      <div className="absolute top-0 left-0 w-full h-1.5 bg-linear-to-r from-[#1A1D2E] via-[#D4AF37] to-[#1A1D2E]"></div>

      <div className="absolute top-0 right-0 w-200 h-200 opacity-[0.03] animate-spin-slow pointer-events-none">
         <Image 
           src="https://www.transparenttextures.com/patterns/stardust.png" 
           alt="Mandala"
           fill
           className="object-cover"
         />
         <div className="absolute inset-0 border-40 border-dashed border-white rounded-full"></div>
      </div>

      <div className="absolute inset-0 bg-linear-to-t from-[#0F111A] to-transparent pointer-events-none"></div>


      <div className="relative z-10 container mx-auto px-4 lg:px-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 border-b border-[#D4AF37]/20 pb-16 mb-12">
          
          <div className="lg:col-span-5 space-y-6">
             <div className="flex items-center gap-3">
                <div className="relative w-12 h-12 rounded-full border-2 border-[#D4AF37] overflow-hidden bg-[#FFFBF5]">
                   <Image src="/logo.png" alt="Logo" width={48} height={48} className="object-cover" />
                </div>
                <span className="font-serif text-3xl font-bold text-[#FDFBF7] tracking-tight">
                   The Artisan's Loom
                </span>
             </div>
             <p className="text-[#8C7B70] text-lg leading-relaxed max-w-md">
                Bridging the gap between India’s master artisans and the world. Empowering heritage through technology.
             </p>

             <div className="flex gap-4">
                {[Facebook, Instagram, Twitter, Linkedin, Youtube].map((Icon, i) => (
                   <div key={i} className="w-10 h-10 rounded-full border border-[#D4AF37]/30 flex items-center justify-center text-[#D4AF37] hover:bg-[#D4AF37] hover:text-[#1A1D2E] transition-all cursor-pointer">
                      <Icon className="w-5 h-5" />
                   </div>
                ))}
             </div>
          </div>

          <div className="lg:col-span-7 bg-[#FFFBF5]/5 backdrop-blur-sm rounded-2xl p-8 border border-[#D4AF37]/20 flex flex-col md:flex-row items-center gap-6">
             <div className="flex-1">
                <h4 className="text-2xl font-serif font-bold text-[#FDFBF7] mb-2">
                   Join the Community
                </h4>
                <p className="text-[#8C7B70] text-sm">
                   Get stories of artisans, new collection drops, and exclusive offers directly to your inbox.
                </p>
             </div>
             <div className="w-full md:w-auto flex flex-col sm:flex-row gap-3">
                <Input 
                   placeholder="Enter email address" 
                   className="h-12 bg-white/10 border-white/10 text-white placeholder:text-white/40 focus:border-[#D4AF37] min-w-62.5"
                />
                <Button className="h-12 px-8 bg-[#D97742] hover:bg-[#C26635] text-white font-bold">
                   Subscribe
                </Button>
             </div>
          </div>

        </div>


        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 lg:gap-12 mb-16">

           <div className="space-y-6">
              <h5 className="text-lg font-serif font-bold text-[#D4AF37]">Shop</h5>
              <ul className="space-y-3 text-[#E5DCCA]/80">
                 {["New Arrivals", "Best Sellers", "Home Decor", "Fashion & Textiles", "Accessories", "Gift Cards"].map(link => (
                    <li key={link} className="hover:text-[#D97742] transition-colors cursor-pointer w-fit">{link}</li>
                 ))}
              </ul>
           </div>

           <div className="space-y-6">
              <h5 className="text-lg font-serif font-bold text-[#D4AF37]">Company</h5>
              <ul className="space-y-3 text-[#E5DCCA]/80">
                 {["Our Story", "The Artisans", "Impact Report", "Careers", "Press & Media", "Contact Us"].map(link => (
                    <li key={link} className="hover:text-[#D97742] transition-colors cursor-pointer w-fit">{link}</li>
                 ))}
              </ul>
           </div>

           <div className="space-y-6">
              <h5 className="text-lg font-serif font-bold text-[#D4AF37]">Support</h5>
              <ul className="space-y-3 text-[#E5DCCA]/80">
                 {["Help Center", "Shipping & Delivery", "Returns & Exchanges", "Track Order", "Size Guide", "Privacy Policy"].map(link => (
                    <li key={link} className="hover:text-[#D97742] transition-colors cursor-pointer w-fit">{link}</li>
                 ))}
              </ul>
           </div>

           <div className="space-y-6">
              <h5 className="text-lg font-serif font-bold text-[#D4AF37]">Contact</h5>
              <ul className="space-y-4 text-[#E5DCCA]/80">
                 <li className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-[#D97742] shrink-0" />
                    <span>123 Heritage Lane, Connaught Place, New Delhi, India 110001</span>
                 </li>
                 <li className="flex items-center gap-3">
                    <Phone className="w-5 h-5 text-[#D97742] shrink-0" />
                    <span>+91 98765 43210</span>
                 </li>
                 <li className="flex items-center gap-3">
                    <Mail className="w-5 h-5 text-[#D97742] shrink-0" />
                    <span>hello@artisansloom.in</span>
                 </li>
              </ul>
           </div>

        </div>


        <div className="flex flex-col md:flex-row items-center justify-between pt-8 border-t border-[#D4AF37]/20 text-sm text-[#8C7B70]">
           <p>© 2025 The Artisan's Loom. All Rights Reserved.</p>
           <div className="flex gap-6 mt-4 md:mt-0">
              <span className="hover:text-[#FDFBF7] cursor-pointer">Terms of Service</span>
              <span className="hover:text-[#FDFBF7] cursor-pointer">Privacy Policy</span>
              <span className="hover:text-[#FDFBF7] cursor-pointer">Cookie Policy</span>
           </div>
        </div>

      </div>
    </footer>
  );
}
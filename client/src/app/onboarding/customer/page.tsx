import { onboardCustomerAction } from "@/app/actions/onboarding";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { ShoppingBag } from "lucide-react";

export default function CustomerOnboarding() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#FDFBF7] p-4 relative overflow-hidden">
      
      <div className="absolute top-0 left-0 w-full h-2 bg-linear-to-r from-[#2F334F] via-[#D4AF37] to-[#2F334F]"></div>
      <div className="absolute -bottom-[10%] -right-[10%] w-[50vw] h-[50vw] bg-[#D97742]/5 rounded-full blur-[100px]"></div>

      <div className="w-full max-w-2xl relative z-10">
        
        <div className="relative rounded-4xl p-0.75 bg-linear-to-b from-[#F3E5AB] via-[#D4AF37]/50 to-[#8B6508]/20 shadow-2xl">
          <Card className="border-none shadow-none bg-[#FFFBF5] rounded-[1.8rem]">
            <CardContent className="p-8 md:p-12">
              
              <div className="text-center mb-10">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#F0F4FF] border border-[#2F334F]/20 mb-4 shadow-sm">
                   <ShoppingBag className="w-7 h-7 text-[#2F334F]" />
                </div>
                <h1 className="text-3xl md:text-4xl font-serif font-bold text-[#4A3526] mb-2">
                  Join as a Patron
                </h1>
                <p className="text-[#8C7B70]">
                  Help us curate your experience and deliver treasures to your doorstep.
                </p>
              </div>

              <form action={onboardCustomerAction} className="space-y-6">
                
                <div className="space-y-4">
                   <h3 className="text-sm font-bold text-[#D97742] uppercase tracking-widest">Contact Details</h3>
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Input name="phoneNumber" placeholder="Phone Number" required className="h-12 bg-white border-[#E5DCCA] focus-visible:ring-[#D4AF37] rounded-xl" />
                      <Input name="city" placeholder="City" required className="h-12 bg-white border-[#E5DCCA] focus-visible:ring-[#D4AF37] rounded-xl" />
                   </div>
                   <Input name="streetAddress" placeholder="Street Address" required className="h-12 bg-white border-[#E5DCCA] focus-visible:ring-[#D4AF37] rounded-xl" />
                   <div className="grid grid-cols-2 gap-4">
                      <Input name="state" placeholder="State" required className="h-12 bg-white border-[#E5DCCA] focus-visible:ring-[#D4AF37] rounded-xl" />
                      <Input name="pincode" placeholder="Pincode" required className="h-12 bg-white border-[#E5DCCA] focus-visible:ring-[#D4AF37] rounded-xl" />
                   </div>
                </div>

                <div className="space-y-4 pt-4 border-t border-[#E5DCCA]">
                   <h3 className="text-sm font-bold text-[#D97742] uppercase tracking-widest">Interests</h3>
                   <Input name="craftTypes" placeholder="Favorite Crafts (e.g. Silk, Pottery)" className="h-12 bg-white border-[#E5DCCA] focus-visible:ring-[#D4AF37] rounded-xl" />
                   <Input name="budget" type="number" placeholder="Monthly Budget for Crafts (₹)" className="h-12 bg-white border-[#E5DCCA] focus-visible:ring-[#D4AF37] rounded-xl" />
                </div>

                <div className="pt-4">
                  <Button type="submit" className="w-full h-14 text-lg font-serif bg-[#2F334F] hover:bg-[#1E2135] text-[#FDFBF7] shadow-xl rounded-xl">
                    Start Exploring
                  </Button>
                </div>

              </form>

            </CardContent>
          </Card>
        </div>

      </div>
    </div>
  );
}
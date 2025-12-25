import { Card, CardContent } from "@/components/ui/card";
import { Hammer } from "lucide-react";
import ArtisanOnboardingForm from "@/components/onboarding/ArtisanOnboardingForm";

export default function ArtisanOnboardingPage() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#FDFBF7] p-4 lg:p-8 relative overflow-hidden">
      
      <div className="absolute top-0 left-0 w-full h-2 bg-linear-to-r from-[#2F334F] via-[#D4AF37] to-[#2F334F]"></div>
      <div className="absolute -top-[10%] -left-[10%] w-[50vw] h-[50vw] bg-[#D4AF37]/5 rounded-full blur-[100px]"></div>

      <div className="w-full max-w-2xl relative z-10">
        
        <div className="relative rounded-4xl p-0.75 bg-linear-to-b from-[#F3E5AB] via-[#D4AF37]/50 to-[#8B6508]/20 shadow-2xl">
          <Card className="border-none shadow-none bg-[#FFFBF5] rounded-[1.8rem]">
            <CardContent className="p-8 md:p-12">
              
              <div className="text-center mb-10">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#FFF5E1] border border-[#D4AF37]/30 mb-4 shadow-sm">
                   <Hammer className="w-7 h-7 text-[#D97742]" />
                </div>
                <h1 className="text-3xl md:text-4xl font-serif font-bold text-[#4A3526] mb-2">
                  Craft Your Identity
                </h1>
                <p className="text-[#8C7B70]">
                  Share your story with the world.
                </p>
              </div>

              <ArtisanOnboardingForm />

            </CardContent>
          </Card>
        </div>

        <p className="text-center text-[#8C7B70]/60 text-xs mt-6">
          By joining, you agree to our Artisan Guidelines and Values.
        </p>

      </div>
    </div>
  );
}
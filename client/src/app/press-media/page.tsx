import { Button } from "@/components/ui/button";
import { RoyalDivider } from "@/components/ui/royal-divider";
import UniversalBackButton from "@/components/ui/BackButton";
import { Newspaper, Camera, Calendar, Users, Star } from "lucide-react";

export default function PressMediaPage() {
  return (
    <div className="min-h-screen bg-[#FDFBF7] py-12">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex items-center mb-8">
          <UniversalBackButton position="top-left" fallbackUrl="/" />
        </div>
        
        <div className="text-center mb-16 space-y-4">
          <h1 className="text-5xl md:text-6xl font-serif font-bold text-[#4A3526]">
            Press & Media
          </h1>
          <p className="text-[#5D4037] text-lg max-w-2xl mx-auto font-medium">
            Resources for journalists, bloggers, and media professionals
          </p>
          <div className="flex justify-center scale-75 mt-6">
            <RoyalDivider />
          </div>
        </div>

        <div className="max-w-6xl mx-auto">
          {/* Press Kit Section */}
          <div className="bg-white/80 backdrop-blur-md p-10 rounded-3xl border border-[#E5DCCA] shadow-lg mb-16">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-14 h-14 rounded-full bg-[#F3E5AB]/30 flex items-center justify-center">
                <Newspaper className="w-7 h-7 text-[#D4AF37]" />
              </div>
              <h2 className="text-3xl font-serif font-bold text-[#4A3526]">Press Kit</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-bold text-[#4A3526] mb-4">About The Artisan's Loom</h3>
                <p className="text-[#5D4037] mb-6 leading-relaxed">
                  The Artisan's Loom is a platform dedicated to preserving and promoting India's rich heritage of traditional crafts. 
                  We connect talented artisans with conscious consumers worldwide, ensuring fair compensation and preserving cultural traditions.
                </p>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Star className="w-5 h-5 text-[#D4AF37]" />
                    <span className="text-[#4A3526]">Founded: 2023</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Users className="w-5 h-5 text-[#D4AF37]" />
                    <span className="text-[#4A3526]">500+ Artisans Supported</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Calendar className="w-5 h-5 text-[#D4AF37]" />
                    <span className="text-[#4A3526]">25+ States Represented</span>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-xl font-bold text-[#4A3526] mb-4">Media Assets</h3>
                <div className="space-y-4">
                  <Button className="w-full h-14 bg-[#2F334F] hover:bg-[#1E2135] text-white font-serif font-bold rounded-xl shadow-lg justify-start px-6">
                    <Camera className="w-5 h-5 mr-3" />
                    Download High-Resolution Logo
                  </Button>
                  <Button className="w-full h-14 bg-[#2F334F] hover:bg-[#1E2135] text-white font-serif font-bold rounded-xl shadow-lg justify-start px-6">
                    <Camera className="w-5 h-5 mr-3" />
                    Download Product Images
                  </Button>
                  <Button className="w-full h-14 bg-[#2F334F] hover:bg-[#1E2135] text-white font-serif font-bold rounded-xl shadow-lg justify-start px-6">
                    <Camera className="w-5 h-5 mr-3" />
                    Download Artisan Photos
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Press Releases */}
          <div className="mb-16">
            <h2 className="text-3xl font-serif font-bold text-[#4A3526] mb-8 text-center">Press Releases</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="bg-white/80 backdrop-blur-md p-6 rounded-2xl border border-[#E5DCCA] shadow-lg">
                <div className="flex items-center gap-2 mb-4">
                  <Calendar className="w-4 h-4 text-[#D4AF37]" />
                  <span className="text-sm text-[#8C7B70]">December 15, 2025</span>
                </div>
                <h3 className="text-xl font-bold text-[#4A3526] mb-3">New Partnership with Rural Artisan Communities</h3>
                <p className="text-[#5D4037] mb-4">
                  The Artisan's Loom announces expansion to support 200+ new artisan families across 5 Indian states.
                </p>
                <Button variant="outline" className="h-10 px-4 text-[#D4AF37] border-[#D4AF37] hover:bg-[#D4AF37]/10">
                  Read More
                </Button>
              </div>

              <div className="bg-white/80 backdrop-blur-md p-6 rounded-2xl border border-[#E5DCCA] shadow-lg">
                <div className="flex items-center gap-2 mb-4">
                  <Calendar className="w-4 h-4 text-[#D4AF37]" />
                  <span className="text-sm text-[#8C7B70]">November 22, 2025</span>
                </div>
                <h3 className="text-xl font-bold text-[#4A3526] mb-3">Sustainability Award Recognition</h3>
                <p className="text-[#5D4037] mb-4">
                  The platform receives the Green Commerce Award for promoting eco-friendly, handmade products.
                </p>
                <Button variant="outline" className="h-10 px-4 text-[#D4AF37] border-[#D4AF37] hover:bg-[#D4AF37]/10">
                  Read More
                </Button>
              </div>

              <div className="bg-white/80 backdrop-blur-md p-6 rounded-2xl border border-[#E5DCCA] shadow-lg">
                <div className="flex items-center gap-2 mb-4">
                  <Calendar className="w-4 h-4 text-[#D4AF37]" />
                  <span className="text-sm text-[#8C7B70]">October 8, 2025</span>
                </div>
                <h3 className="text-xl font-bold text-[#4A3526] mb-3">Funding Round Completion</h3>
                <p className="text-[#5D4037] mb-4">
                  Series A funding of $2.5M secured to expand technology platform and artisan support programs.
                </p>
                <Button variant="outline" className="h-10 px-4 text-[#D4AF37] border-[#D4AF37] hover:bg-[#D4AF37]/10">
                  Read More
                </Button>
              </div>
            </div>
          </div>

          {/* Media Coverage */}
          <div className="mb-16">
            <h2 className="text-3xl font-serif font-bold text-[#4A3526] mb-8 text-center">In the Media</h2>
            
            <div className="space-y-6">
              <div className="bg-white/80 backdrop-blur-md p-6 rounded-2xl border border-[#E5DCCA] shadow-lg">
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="md:w-1/3">
                    <div className="bg-gray-200 border-2 border-dashed rounded-xl w-full h-48" />
                  </div>
                  <div className="md:w-2/3">
                    <h3 className="text-xl font-bold text-[#4A3526] mb-2">Traditional Crafts in the Digital Age</h3>
                    <p className="text-[#5D4037] mb-3">
                      Feature article in Economic Times highlighting how The Artisan's Loom is bridging traditional crafts with modern e-commerce.
                    </p>
                    <div className="flex items-center gap-4 text-sm text-[#8C7B70]">
                      <span>Economic Times</span>
                      <span>•</span>
                      <span>September 12, 2025</span>
                    </div>
                    <Button variant="outline" className="mt-4 h-10 px-4 text-[#D4AF37] border-[#D4AF37] hover:bg-[#D4AF37]/10">
                      View Article
                    </Button>
                  </div>
                </div>
              </div>

              <div className="bg-white/80 backdrop-blur-md p-6 rounded-2xl border border-[#E5DCCA] shadow-lg">
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="md:w-1/3">
                    <div className="bg-gray-200 border-2 border-dashed rounded-xl w-full h-48" />
                  </div>
                  <div className="md:w-2/3">
                    <h3 className="text-xl font-bold text-[#4A3526] mb-2">Empowering Rural Artisans</h3>
                    <p className="text-[#5D4037] mb-3">
                      Coverage in Business Standard about our impact on rural livelihoods and cultural preservation.
                    </p>
                    <div className="flex items-center gap-4 text-sm text-[#8C7B70]">
                      <span>Business Standard</span>
                      <span>•</span>
                      <span>August 5, 2025</span>
                    </div>
                    <Button variant="outline" className="mt-4 h-10 px-4 text-[#D4AF37] border-[#D4AF37] hover:bg-[#D4AF37]/10">
                      View Article
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Media Contact */}
          <div className="bg-white/80 backdrop-blur-md p-10 rounded-3xl border border-[#E5DCCA] shadow-lg">
            <h2 className="text-3xl font-serif font-bold text-[#4A3526] mb-8 text-center">Media Contact</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <div>
                <h3 className="text-xl font-bold text-[#4A3526] mb-4">Press Inquiries</h3>
                <div className="space-y-4">
                  <div>
                    <p className="text-[#4A3526] font-medium">Rita Sharma</p>
                    <p className="text-[#8C7B70]">Director of Communications</p>
                    <p className="text-[#5D4037] mt-2">rita@artisansloom.in</p>
                    <p className="text-[#5D4037]">+91 98765 43210</p>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-xl font-bold text-[#4A3526] mb-4">General Inquiries</h3>
                <div className="space-y-4">
                  <div>
                    <p className="text-[#5D4037]">For all other media inquiries, please contact our PR team.</p>
                    <p className="text-[#5D4037] mt-2">press@artisansloom.in</p>
                  </div>
                  
                  <div className="pt-4">
                    <Button className="h-12 px-6 bg-[#2F334F] hover:bg-[#1E2135] text-white font-serif font-bold rounded-xl shadow-lg">
                      Request Interview
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
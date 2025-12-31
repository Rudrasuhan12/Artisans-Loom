import { Button } from "@/components/ui/button";
import { RoyalDivider } from "@/components/ui/royal-divider";
import Image from "next/image";
import UniversalBackButton from "@/components/ui/BackButton";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#FDFBF7] py-12">
      <div className="absolute top-0 left-0 w-full h-24 bg-linear-to-b from-[#FDFBF7] via-[#FFF8E7] to-transparent z-0" />
      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        <div className="flex items-center mb-8">
          <UniversalBackButton position="top-left" fallbackUrl="/" />
        </div>
        <div className="text-center mb-16 space-y-4">
          <h1 className="text-5xl md:text-6xl font-serif font-bold text-[#4A3526]">
            Our Story
          </h1>
          <p className="text-[#5D4037] text-lg max-w-2xl mx-auto font-medium">
            Bridging the gap between India's master artisans and the world
          </p>
          <div className="flex justify-center scale-75 mt-6">
            <RoyalDivider />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-20">
          <div className="space-y-6">
            <h2 className="text-4xl font-serif font-bold text-[#4A3526]">The Artisan's Loom</h2>
            <p className="text-[#5D4037] text-lg leading-relaxed">
              Founded with a vision to preserve and promote India's rich heritage of traditional crafts, The Artisan's Loom connects talented craftspeople with conscious consumers worldwide.
            </p>
            <p className="text-[#5D4037] text-lg leading-relaxed">
              Our journey began when we recognized the gap between skilled artisans creating beautiful, authentic crafts and the global market that values such uniqueness. We set out to build a platform that not only showcases these treasures but also ensures fair compensation for the artisans.
            </p>
            <div className="pt-4">
              <Button className="h-12 px-8 bg-[#2F334F] hover:bg-[#1E2135] text-white font-serif font-bold rounded-xl shadow-lg">
                Learn More
              </Button>
            </div>
          </div>
          <div className="relative h-96 rounded-3xl overflow-hidden shadow-xl">
            <Image 
              src="/hero-image.jpg" 
              alt="Artisan at work" 
              fill 
              className="object-cover" 
              priority 
            />
            <div className="absolute inset-0 bg-linear-to-t from-black/70 to-transparent"></div>
          </div>
        </div>

        <div className="text-center mb-16">
          <h2 className="text-4xl font-serif font-bold text-[#4A3526] mb-6">Our Mission</h2>
          <p className="text-[#5D4037] text-lg max-w-3xl mx-auto leading-relaxed">
            To empower traditional artisans by providing them with a global platform to showcase their skills, preserve cultural heritage, and create sustainable livelihoods while connecting conscious consumers with authentic, handcrafted products.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
          <div className="bg-white/80 backdrop-blur-md p-8 rounded-3xl border border-[#E5DCCA] shadow-lg text-center">
            <div className="w-16 h-16 rounded-full bg-[#F3E5AB]/30 flex items-center justify-center mx-auto mb-6">
              <span className="text-2xl">🤝</span>
            </div>
            <h3 className="text-2xl font-serif font-bold text-[#4A3526] mb-4">Artisan Empowerment</h3>
            <p className="text-[#5D4037]">
              Direct market access and fair compensation for traditional craftspeople
            </p>
          </div>

          <div className="bg-white/80 backdrop-blur-md p-8 rounded-3xl border border-[#E5DCCA] shadow-lg text-center">
            <div className="w-16 h-16 rounded-full bg-[#F3E5AB]/30 flex items-center justify-center mx-auto mb-6">
              <span className="text-2xl">🌿</span>
            </div>
            <h3 className="text-2xl font-serif font-bold text-[#4A3526] mb-4">Sustainable Craft</h3>
            <p className="text-[#5D4037]">
              Promoting eco-friendly materials and traditional, sustainable methods
            </p>
          </div>

          <div className="bg-white/80 backdrop-blur-md p-8 rounded-3xl border border-[#E5DCCA] shadow-lg text-center">
            <div className="w-16 h-16 rounded-full bg-[#F3E5AB]/30 flex items-center justify-center mx-auto mb-6">
              <span className="text-2xl">🎨</span>
            </div>
            <h3 className="text-2xl font-serif font-bold text-[#4A3526] mb-4">Cultural Preservation</h3>
            <p className="text-[#5D4037]">
              Preserving ancient techniques and stories through authentic craftsmanship
            </p>
          </div>
        </div>

        <div className="bg-white/80 backdrop-blur-md p-12 rounded-3xl border border-[#E5DCCA] shadow-lg">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl font-serif font-bold text-[#4A3526] mb-6">Our Impact</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              <div>
                <div className="text-4xl font-bold text-[#D4AF37] font-serif">500+</div>
                <div className="text-[#5D4037]">Artisans Supported</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-[#D4AF37] font-serif">25</div>
                <div className="text-[#5D4037]">States Represented</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-[#D4AF37] font-serif">15+</div>
                <div className="text-[#5D4037]">Craft Traditions</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-[#D4AF37] font-serif">1200+</div>
                <div className="text-[#5D4037]">Products Sold</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
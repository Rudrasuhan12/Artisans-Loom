import HeroSection from "@/components/landing/HeroSection";
import FeaturedSection from "@/components/landing/FeaturedSection";
import TrendingSection from "@/components/landing/TrendingSection";
import RegionalMap from "@/components/landing/RegionalMap";
import ArtisanSpotlight from "@/components/landing/ArtisanSpotlight";
import ImpactSection from "@/components/landing/ImpactSection";
import Footer from "@/components/landing/Footer";

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-[#FDFBF7] flex flex-col">
      <HeroSection />
      <FeaturedSection />
      <TrendingSection />
      <RegionalMap />
      <ArtisanSpotlight />
      <ImpactSection />
      <Footer /> {/* Add here */}
    </main>
  );
}
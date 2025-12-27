import HeroSection from "@/components/landing/HeroSection";
import FeaturedSection from "@/components/landing/FeaturedSection";
import TrendingSection from "@/components/landing/TrendingSection";
import RegionalMap from "@/components/landing/RegionalMap";
import ArtisanSpotlight from "@/components/landing/ArtisanSpotlight";
import ImpactSection from "@/components/landing/ImpactSection";
import Footer from "@/components/landing/Footer";
import { prisma } from "@/lib/prisma"; //

export const dynamic = 'force-dynamic';

export default async function LandingPage() {

  const realProducts = await prisma.product.findMany({
    take: 4,
    orderBy: { 
      createdAt: 'desc' 
    },
    include: {
      artisan: {
        include: {
          profile: true
        }
      }
    }
  });

  return (
    <main className="min-h-screen bg-[#FDFBF7] flex flex-col">
      <HeroSection />
      <FeaturedSection products={realProducts} />
      
      <TrendingSection />
      <RegionalMap />
      <ArtisanSpotlight />
      <ImpactSection />
      
      <Footer />
    </main>
  );
}
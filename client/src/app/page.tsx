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

  const allProducts = await prisma.product.findMany({
    take: 20,
    include: { artisan: true },
    orderBy: { createdAt: 'desc' }
  });

  const shuffled = allProducts.sort(() => 0.5 - Math.random());
  const randomProducts = shuffled.slice(0, 4);

   const allArtisans = await prisma.user.findMany({
    where: { role: "ARTISAN" },
    include: { profile: true },
    take: 20,
  });

  const shuffledArtisans = allArtisans.sort(() => 0.5 - Math.random());
  const featuredArtisans = shuffledArtisans.slice(0, 3);

  return (
    <main className="min-h-screen bg-[#FDFBF7] flex flex-col">
      <HeroSection />
      <FeaturedSection products={randomProducts} />
      
      <TrendingSection />
      <RegionalMap />
      <ArtisanSpotlight artisans={featuredArtisans} />
      <ImpactSection />
      
      <Footer />
    </main>
  );
}
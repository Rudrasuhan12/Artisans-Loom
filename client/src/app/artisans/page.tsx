// client/src/app/artisans/page.tsx
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { MapPin, ShoppingBag, Users } from "lucide-react";

export default async function AllArtisansPage() {
  const artisans = await prisma.user.findMany({
    where: { role: "ARTISAN" },
    include: {
      profile: true,
      _count: { select: { products: true, followedBy: true } },
    },
  });

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 space-y-10">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-serif font-bold text-[#4A3526]">Our Master Artisans</h1>
        <p className="text-[#8C7B70] max-w-2xl mx-auto">
          Discover the hands behind the heritage. Meet the creators preserving India's traditional crafts.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {artisans.map((artisan) => (
          <Link 
            key={artisan.id} 
            href={`/profile/${artisan.id}`}
            className="group bg-white rounded-3xl border border-[#E5DCCA] p-6 transition-all hover:shadow-2xl hover:-translate-y-1"
          >
            <div className="flex items-center gap-5">
              <div className="w-20 h-20 rounded-full bg-[#D4AF37] flex items-center justify-center text-2xl text-white font-bold shrink-0">
                {artisan.name?.[0] || "A"}
              </div>
              <div className="flex-1 min-w-0">
                <h2 className="text-xl font-bold text-[#4A3526] truncate">{artisan.name}</h2>
                <p className="text-[#D97742] text-sm font-medium">{artisan.profile?.craftType || "Traditional Craftsman"}</p>
                <div className="flex items-center gap-2 text-[#8C7B70] text-xs mt-1">
                  <MapPin className="w-3 h-3" />
                  {artisan.profile?.location || "India"}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mt-6 pt-6 border-t border-[#F5F1E8]">
              <div className="flex items-center gap-2 text-[#5D4037]">
                <ShoppingBag className="w-4 h-4 text-[#D4AF37]" />
                <span className="text-sm font-semibold">{artisan._count.products} Products</span>
              </div>
              <div className="flex items-center gap-2 text-[#5D4037]">
                <Users className="w-4 h-4 text-[#D4AF37]" />
                <span className="text-sm font-semibold">{artisan._count.followedBy} Followers</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
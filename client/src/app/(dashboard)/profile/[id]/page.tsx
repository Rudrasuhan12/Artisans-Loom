import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import { MapPin, Calendar, UserPlus, Check, ShoppingBag } from "lucide-react";
import { toggleFollowAction } from "@/app/actions/forum";
import { format } from "date-fns";
import Image from "next/image";
import Link from "next/link";

export default async function ProfilePage({ 
  params 
}: { 
  params: Promise<{ id: string }> 
}) {
  const { userId } = await auth();
  const { id } = await params;

  // 1. Fetch current user to handle follow logic
  const currentUser = userId ? await prisma.user.findUnique({ where: { clerkId: userId } }) : null;

  // 2. Fetch artisan with profile, count of stats, and their products
  const artisan = await prisma.user.findUnique({
    where: { id: id },
    include: {
      profile: true,
      products: {
        orderBy: { createdAt: 'desc' },
        take: 8 // Show the 8 most recent products
      },
      _count: { 
        select: { 
          products: true, 
          followedBy: true, 
          following: true 
        } 
      },
      followedBy: { 
        where: { followerId: currentUser?.id || "invalid_id" } 
      } 
    }
  });

  if (!artisan) return <div className="p-10 text-center">User not found</div>;

  const isFollowing = artisan.followedBy.length > 0;
  const isMe = currentUser?.id === artisan.id;

  return (
    <div className="max-w-6xl mx-auto min-h-screen pb-20 space-y-10 px-4 pt-8">
      
      {/* --- Profile Header Card --- */}
      <div className="bg-white rounded-[2.5rem] p-8 border border-[#E5DCCA] shadow-xl relative overflow-hidden">
        {/* Banner background matching your aesthetic */}
        <div className="absolute top-0 left-0 w-full h-32 bg-linear-to-r from-[#2F334F] to-[#1A1D2E]"></div>
        
        <div className="relative flex flex-col md:flex-row items-end gap-6 pt-16 px-4">
          <div className="w-32 h-32 rounded-full border-4 border-white shadow-lg bg-[#D4AF37] flex items-center justify-center text-4xl text-white font-bold overflow-hidden shrink-0">
             {artisan.name?.[0] || "A"}
          </div>
          
          <div className="flex-1 mb-2">
             <h1 className="text-3xl font-serif font-bold text-[#4A3526]">{artisan.name}</h1>
             <p className="text-[#8C7B70]">{artisan.profile?.businessName || "Artisan Studio"}</p>
             
             <div className="flex flex-wrap gap-4 mt-3 text-sm text-[#5D4037]">
                <span className="flex items-center gap-1"><MapPin className="w-4 h-4" /> {artisan.profile?.location || "India"}</span>
                <span className="flex items-center gap-1"><Calendar className="w-4 h-4" /> Joined {format(new Date(artisan.createdAt), 'MMM yyyy')}</span>
             </div>
          </div>

          {!isMe && currentUser && (
            <form action={toggleFollowAction.bind(null, artisan.id)}>
               <Button className={`h-12 px-8 rounded-full shadow-lg transition-all ${isFollowing ? "bg-white text-[#2F334F] border border-[#2F334F]" : "bg-[#D97742] text-white hover:bg-[#C26635]"}`}>
                  {isFollowing ? <><Check className="w-4 h-4 mr-2" /> Following</> : <><UserPlus className="w-4 h-4 mr-2" /> Follow</>}
               </Button>
            </form>
          )}
        </div>

        {/* --- Stats Section --- */}
        <div className="flex gap-12 mt-8 px-4 pt-6 border-t border-[#E5DCCA]">
           <div>
              <p className="text-2xl font-bold text-[#4A3526]">{artisan._count.products}</p>
              <p className="text-xs uppercase tracking-wider text-[#8C7B70]">Products</p>
           </div>
           <div>
              <p className="text-2xl font-bold text-[#4A3526]">{artisan._count.followedBy}</p>
              <p className="text-xs uppercase tracking-wider text-[#8C7B70]">Followers</p>
           </div>
           <div>
              <p className="text-2xl font-bold text-[#4A3526]">{artisan._count.following}</p>
              <p className="text-xs uppercase tracking-wider text-[#8C7B70]">Following</p>
           </div>
        </div>
      </div>

      {/* --- Two-Column Layout for Content --- */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left: Bio/About Sidebar */}
        <div className="lg:col-span-1 space-y-6">
          {artisan.profile?.bio && (
            <div className="bg-[#FFFBF5] p-6 rounded-3xl border border-[#E5DCCA]">
               <h3 className="font-serif font-bold text-[#4A3526] mb-3">About the Artisan</h3>
               <p className="text-[#5D4037] leading-relaxed whitespace-pre-line">{artisan.profile.bio}</p>
            </div>
          )}
        </div>

        {/* Right: Product Gallery Section */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-2xl font-serif font-bold text-[#4A3526]">Handcrafted Creations</h3>
            <span className="text-[#8C7B70] text-sm">Recently Added</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {artisan.products.length > 0 ? (
              artisan.products.map((product) => (
                <Link 
                  href={`/shop/${product.id}`} 
                  key={product.id}
                  className="bg-white rounded-3xl border border-[#E5DCCA] overflow-hidden group hover:shadow-xl transition-all"
                >
                  <div className="aspect-square relative overflow-hidden">
                    <Image 
                      src={product.images[0] || "/p1.png"} 
                      alt={product.title} 
                      fill 
                      className="object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-4 space-y-1">
                    <h4 className="font-bold text-[#4A3526] truncate">{product.title}</h4>
                    <p className="text-[#8C7B70] text-xs uppercase tracking-tighter">{product.category}</p>
                    <div className="flex items-center justify-between pt-2">
                      <span className="text-[#D97742] font-bold">₹{product.price}</span>
                      <Button variant="ghost" size="sm" className="text-[#D4AF37] hover:text-[#4A3526] p-0">
                        View Details
                      </Button>
                    </div>
                  </div>
                </Link>
              ))
            ) : (
              <div className="col-span-full py-20 text-center bg-gray-50 rounded-3xl border-2 border-dashed border-[#E5DCCA]">
                <ShoppingBag className="w-10 h-10 text-[#E5DCCA] mx-auto mb-3" />
                <p className="text-[#8C7B70]">No products listed yet.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
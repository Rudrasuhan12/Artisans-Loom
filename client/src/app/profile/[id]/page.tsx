import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import BackButton from "@/components/dashboard/BackButton";
import ProfileUI from "@/components/artisan/ProfileUI"; 

export default async function ProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const { userId } = await auth();
  const { id } = await params;

  const currentUser = userId 
    ? await prisma.user.findUnique({ where: { clerkId: userId } }) 
    : null;

  const artisan = await prisma.user.findUnique({
    where: { id: id },
    include: {
      profile: true,
      products: { orderBy: { createdAt: 'desc' } },
      _count: { select: { followedBy: true, following: true, products: true } },
      followedBy: { where: { followerId: currentUser?.id || "invalid_id" } },
      reviewsReceived: { 
         include: { author: true },
         orderBy: { createdAt: 'desc' }
      }
    }
  });

  if (!artisan) return <div className="p-20 text-center text-[#4A3526]">User not found</div>;

  const isFollowing = artisan.followedBy.length > 0;
  const isMe = currentUser?.id === artisan.id;

  return (
    <>
      <ProfileUI 
         artisan={artisan} 
         currentUser={currentUser} 
         isFollowing={isFollowing} 
         isMe={isMe} 
      />
      <BackButton />
    </>
  );
}
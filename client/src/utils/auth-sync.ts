import { currentUser } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { Role } from "@prisma/client";

export async function syncUser() {
  try {
    const clerkUser = await currentUser();
    if (!clerkUser) return null;

    const user = await prisma.user.findUnique({
      where: { clerkId: clerkUser.id },
    });

    if (!user) {
      await prisma.user.create({
        data: {
          clerkId: clerkUser.id,
          email: clerkUser.emailAddresses[0].emailAddress,
          name: `${clerkUser.firstName} ${clerkUser.lastName}`,
          image: clerkUser.imageUrl,
          role: Role.PENDING,
        },
      });
    }else {
      if (user.image !== clerkUser.imageUrl) {
        await prisma.user.update({
          where: { clerkId: clerkUser.id },
          data: { image: clerkUser.imageUrl }
        });
      }
    }
  } catch (error) {
    console.error("⚠️ Auth Sync Timeout (Non-Critical):", error);
  }
}
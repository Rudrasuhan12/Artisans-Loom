import { currentUser } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { Role } from "@prisma/client";

export async function syncUser() {
  const clerkUser = await currentUser();
  if (!clerkUser) return null;

  try {
    // Check if user exists in Prisma
    let user = await prisma.user.findUnique({
      where: { clerkId: clerkUser.id },
    });

    // If not, create a entry with role: "PENDING"
    if (!user) {
      user = await prisma.user.create({
        data: {
          clerkId: clerkUser.id,
          email: clerkUser.emailAddresses[0].emailAddress,
          name: `${clerkUser.firstName} ${clerkUser.lastName}`,
          role: Role.PENDING,
        },
      });
    }
    return user;
  } catch (error) {
    console.error('Error in syncUser:', error);
    // Return null if database is not available
    return null;
  }
}
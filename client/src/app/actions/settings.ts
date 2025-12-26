"use server";

import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function updateArtisanProfile(formData: FormData) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const businessName = formData.get("businessName") as string;
  const bio = formData.get("bio") as string;
  const location = formData.get("location") as string;

  await prisma.user.update({
    where: { clerkId: userId },
    data: {
      profile: {
        update: {
          businessName,
          bio,
          location,
        }
      }
    }
  });

  revalidatePath("/artisan/settings");
}
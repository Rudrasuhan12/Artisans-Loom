"use server";

import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function addReviewAction(formData: FormData) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const artisanId = formData.get("artisanId") as string;
  const comment = formData.get("comment") as string;
  const rating = parseInt(formData.get("rating") as string);

  const author = await prisma.user.findUnique({ where: { clerkId: userId } });
  if (!author) throw new Error("User not found");

  if (author.id === artisanId) {
    throw new Error("You cannot review yourself.");
  }

  await prisma.review.create({
    data: {
      rating,
      comment,
      authorId: author.id,
      artisanId: artisanId,
    },
  });

  revalidatePath(`/profile/${artisanId}`);
}
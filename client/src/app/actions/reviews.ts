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

  // Validate rating range
  if (isNaN(rating) || rating < 1 || rating > 5) {
    throw new Error("Rating must be between 1 and 5");
  }

  // Prevent duplicate reviews
  const existingReview = await prisma.review.findFirst({
    where: { authorId: author.id, artisanId },
  });
  if (existingReview) {
    throw new Error("You have already reviewed this artisan");
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
"use server";

import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

/**
 * Submit a verification video URL for review
 */
export async function submitVerificationVideo(videoUrl: string) {
  const { userId } = await auth();

  if (!userId) {
    return { success: false, error: "Unauthorized" };
  }

  try {
    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
      include: { profile: true },
    });

    if (!user || user.role !== "ARTISAN") {
      return { success: false, error: "Only artisans can submit verification" };
    }

    if (!user.profile) {
      return { success: false, error: "Profile not found" };
    }

    // Update profile with video URL and set status to pending
    await prisma.profile.update({
      where: { userId: user.id },
      data: {
        verificationVideoUrl: videoUrl,
        verificationStatus: "pending",
        verificationNote: null,
      },
    });

    revalidatePath("/artisan/settings");
    revalidatePath("/artisan");

    return { success: true };
  } catch (error) {
    console.error("Submit verification error:", error);
    return { success: false, error: "Failed to submit verification" };
  }
}

/**
 * Get all pending verification requests (Admin only)
 */
export async function getPendingVerifications() {
  const { userId } = await auth();

  if (!userId) {
    return { success: false, error: "Unauthorized", data: [] };
  }

  try {
    const admin = await prisma.user.findUnique({
      where: { clerkId: userId },
    });

    if (!admin || admin.role !== "ADMIN") {
      return { success: false, error: "Admin access required", data: [] };
    }

    const pendingProfiles = await prisma.profile.findMany({
      where: {
        verificationStatus: "pending",
        verificationVideoUrl: { not: null },
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
            createdAt: true,
          },
        },
      },
      orderBy: {
        id: "desc",
      },
    });

    return { success: true, data: pendingProfiles };
  } catch (error) {
    console.error("Get pending verifications error:", error);
    return { success: false, error: "Failed to fetch verifications", data: [] };
  }
}

/**
 * Approve or reject a verification request (Admin only)
 */
export async function reviewVerification(
  profileId: string,
  action: "approve" | "reject",
  note?: string
) {
  const { userId } = await auth();

  if (!userId) {
    return { success: false, error: "Unauthorized" };
  }

  try {
    const admin = await prisma.user.findUnique({
      where: { clerkId: userId },
    });

    if (!admin || admin.role !== "ADMIN") {
      return { success: false, error: "Admin access required" };
    }

    const profile = await prisma.profile.findUnique({
      where: { id: profileId },
    });

    if (!profile) {
      return { success: false, error: "Profile not found" };
    }

    if (action === "approve") {
      await prisma.profile.update({
        where: { id: profileId },
        data: {
          isVerified: true,
          verificationStatus: "approved",
          verificationNote: note || "Verification approved",
        },
      });
    } else {
      await prisma.profile.update({
        where: { id: profileId },
        data: {
          isVerified: false,
          verificationStatus: "rejected",
          verificationNote: note || "Verification rejected",
          verificationVideoUrl: null, // Clear the video so they can resubmit
        },
      });
    }

    revalidatePath("/admin/verification");

    return { success: true };
  } catch (error) {
    console.error("Review verification error:", error);
    return { success: false, error: "Failed to review verification" };
  }
}

/**
 * Get current user's verification status
 */
export async function getVerificationStatus() {
  const { userId } = await auth();

  if (!userId) {
    return null;
  }

  try {
    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
      include: { profile: true },
    });

    if (!user?.profile) {
      return null;
    }

    return {
      isVerified: user.profile.isVerified,
      status: user.profile.verificationStatus,
      videoUrl: user.profile.verificationVideoUrl,
      note: user.profile.verificationNote,
    };
  } catch (error) {
    console.error("Get verification status error:", error);
    return null;
  }
}

/**
 * Get all artisans with their verification status (Admin only)
 */
export async function getAllArtisansVerificationStatus() {
  const { userId } = await auth();

  if (!userId) {
    return { success: false, error: "Unauthorized", data: [] };
  }

  try {
    const admin = await prisma.user.findUnique({
      where: { clerkId: userId },
    });

    if (!admin || admin.role !== "ADMIN") {
      return { success: false, error: "Admin access required", data: [] };
    }

    const artisans = await prisma.user.findMany({
      where: { role: "ARTISAN" },
      include: {
        profile: true,
        _count: { select: { products: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    return { success: true, data: artisans };
  } catch (error) {
    console.error("Get artisans error:", error);
    return { success: false, error: "Failed to fetch artisans", data: [] };
  }
}

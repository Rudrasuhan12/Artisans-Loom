"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

export async function onboardCustomerAction(formData: FormData) {
  const session = await auth();
  
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  // Only allow onboarding for PENDING users
  const existingUser = await prisma.user.findUnique({ where: { id: session.user.id } });
  if (existingUser && existingUser.role !== "PENDING") {
    throw new Error("Already onboarded");
  }

  const profileData = {
    phoneNumber: formData.get("phoneNumber")?.toString(),
    streetAddress: formData.get("streetAddress")?.toString(),
    city: formData.get("city")?.toString(),
    state: formData.get("state")?.toString(),
    pincode: formData.get("pincode")?.toString(),
  };

  const preferences = {
    favoriteCrafts: formData.get("craftTypes")?.toString().split(",").map(s => s.trim()) || [],
    budget: formData.get("budget")?.toString(),
  };

  const updatedUser = await prisma.user.update({
    where: { id: session.user.id },
    data: {
      role: "CUSTOMER",
      preferences: preferences,
      profile: {
        upsert: {
          create: profileData,
          update: profileData
        }
      }
    },
  });

  // Send welcome email (non-blocking)
  const { sendWelcomeEmail } = await import("@/lib/email");
  sendWelcomeEmail({
    name: updatedUser.name || "Patron",
    email: updatedUser.email,
    role: "CUSTOMER",
  });

  redirect("/customer"); 
}

export async function onboardArtisanAction(formData: FormData) {
  const session = await auth();
  
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  // Only allow onboarding for PENDING users
  const existingUser = await prisma.user.findUnique({ where: { id: session.user.id } });
  if (existingUser && existingUser.role !== "PENDING") {
    throw new Error("Already onboarded");
  }

  const profileData = {
    businessName: formData.get("businessName")?.toString(),
    craftType: formData.get("craftType")?.toString(),
    yearsOfExperience: parseInt(formData.get("yearsOfExperience")?.toString() || "0"),
    location: formData.get("location")?.toString(),
    bio: formData.get("bio")?.toString(),
  };

  const updatedUser = await prisma.user.update({
    where: { id: session.user.id },
    data: {
      role: "ARTISAN",
      profile: {
        upsert: {
          create: profileData,
          update: profileData,
        },
      },
    },
  });

  // Send welcome email (non-blocking)
  const { sendWelcomeEmail } = await import("@/lib/email");
  sendWelcomeEmail({
    name: updatedUser.name || "Artisan",
    email: updatedUser.email,
    role: "ARTISAN",
  });

  redirect("/artisan");
}
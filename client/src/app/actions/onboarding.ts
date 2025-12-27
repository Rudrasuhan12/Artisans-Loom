"use server";

import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

export async function onboardCustomerAction(formData: FormData) {
  const { userId } = await auth();
  
  if (!userId) {
    throw new Error("Unauthorized");
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

  await prisma.user.update({
    where: { clerkId: userId },
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

  redirect("/customer"); 
}

export async function onboardArtisanAction(formData: FormData) {
  const { userId } = await auth();
  
  if (!userId) {
    throw new Error("Unauthorized");
  }

  const profileData = {
    businessName: formData.get("businessName")?.toString(),
    craftType: formData.get("craftType")?.toString(),
    yearsOfExperience: parseInt(formData.get("yearsOfExperience")?.toString() || "0"),
    location: formData.get("location")?.toString(),
    bio: formData.get("bio")?.toString(),
  };

  await prisma.user.update({
    where: { clerkId: userId },
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

  redirect("/artisan");
}
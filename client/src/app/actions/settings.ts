"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function updateArtisanProfile(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const businessName = formData.get("businessName") as string;
  const bio = formData.get("bio") as string;
  const location = formData.get("location") as string;

  await prisma.user.update({
    where: { id: session.user.id },
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

export async function updateCustomerProfile(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const data = {
    phoneNumber: formData.get("phoneNumber")?.toString(),
    streetAddress: formData.get("streetAddress")?.toString(),
    city: formData.get("city")?.toString(),
    state: formData.get("state")?.toString(),
    pincode: formData.get("pincode")?.toString(),
  };

  await prisma.user.update({
    where: { id: session.user.id },
    data: {
      profile: {
        update: data
      }
    }
  });

  revalidatePath("/customer/settings");
}
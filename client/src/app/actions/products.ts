"use server";

import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
export async function createProductAction(formData: FormData) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const user = await prisma.user.findUnique({ where: { clerkId: userId } });
  if (!user) throw new Error("User not found");

  await prisma.product.create({
    data: {
      artisanId: user.id,
      title: formData.get("title") as string,
      description: formData.get("description") as string,
      price: parseFloat(formData.get("price") as string),
      stock: parseInt(formData.get("stock") as string),
      category: formData.get("category") as string,
      images: [formData.get("image") as string || "/p1.png"],
    },
  });

  revalidatePath("/artisan/products");
  redirect("/artisan/products");
}

export async function deleteProductAction(productId: string) {
  await prisma.product.delete({ where: { id: productId } });
  revalidatePath("/artisan/products");
}

export async function generateDescriptionAction(title: string, category: string) {
  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
  
  const prompt = `Write a luxurious, storytelling description (max 50 words) for an Indian handcrafted product.
  Product: ${title}
  Category: ${category}
  Tone: Heritage, Premium, Emotional.`;

  const result = await model.generateContent(prompt);
  return result.response.text();
}

export async function processVoiceListingAction(audioBase64: string, languageHint: string = "Hindi/English") {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const prompt = `
      Listen to this audio description by an artisan. 
      The artisan might be speaking in ${languageHint}, Hindi, or English.
      
      Task:
      1. Translate the spoken content to English.
      2. Extract specific product details into JSON.
      3. Create a rich description based on what they said.

      Return ONLY a JSON object with these keys: 
      {
        "title": "Short catchy title",
        "price": "Number only (estimate if not heard)",
        "stock": "Number only (default 1)",
        "category": "One word category (e.g. Textile, Pottery)",
        "description": "A polished English description"
      }
    `;

    const result = await model.generateContent([
      prompt,
      { inlineData: { data: audioBase64, mimeType: "audio/mp3" } } 
    ]);

    const text = result.response.text().replace(/```json/g, '').replace(/```/g, '').trim();
    return JSON.parse(text);

  } catch (error) {
    console.error("Voice AI Error:", error);
    return null;
  }
  
}
export async function updateProductAction(formData: FormData) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const productId = formData.get("id") as string;
  const image = formData.get("image") as string;

  const data: any = {
    title: formData.get("title") as string,
    description: formData.get("description") as string,
    price: parseFloat(formData.get("price") as string),
    stock: parseInt(formData.get("stock") as string),
    category: formData.get("category") as string,
  };

  if (image && image.startsWith("data:image")) {
    data.images = [image];
  }

  await prisma.product.update({
    where: { id: productId },
    data: data,
  });

  revalidatePath("/artisan/products");
  redirect("/artisan/products");
}
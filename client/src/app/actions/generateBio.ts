"use server";

import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function generateArtisanBio(businessName: string, craftType: string, state: string, experience: string) {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const prompt = `
      You are a professional storyteller for Indian Artisans.
      Write a warm, humble, and traditional 50-word bio for an artisan.
      
      Details:
      - Business Name: ${businessName}
      - Craft: ${craftType}
      - Location: ${state}
      - Experience: ${experience} years
      
      Tone: Prestigious, authentic, and inviting. 
      Output: Just the bio text, no quotes or labels.
    `;

    const result = await model.generateContent(prompt);
    const response = result.response;
    return { success: true, bio: response.text() };
    
  } catch (error) {
    console.error("Gemini Error:", error);
    return { success: false, error: "Failed to generate bio. Please write manually." };
  }
}
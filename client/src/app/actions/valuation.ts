"use server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function getAuctionInsight(productName: string, category: string, basePrice: number) {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash-lite" });
    const prompt = `
      You are an expert Antique Valuator for Indian Crafts.
      Analyze this item: "${productName}" (${category}) starting at ₹${basePrice}.
      
      Provide a sophisticated 2-sentence assessment of why this is a rare investment. 
      Focus on heritage, craftsmanship hours, and scarcity.
      Tone: Exclusive, professional.
    `;
    const result = await model.generateContent(prompt);
    return result.response.text();
  } catch (error) {
    return "This masterpiece represents a timeless investment in Indian heritage, likely to appreciate in cultural value.";
  }
}
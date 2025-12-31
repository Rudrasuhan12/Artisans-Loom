"use server";

import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function analyzeImageForSearch(imageBase64: string) {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash-lite" });

    const prompt = `
      You are an expert curator of Indian Handlooms and Handicrafts.
      Analyze this image and identify the product.
      
      Return ONLY a JSON array of 4-5 search keywords that describe:
      1. The Craft form (e.g. "Blue Pottery", "Banarasi", "Dhokra")
      2. The Object type (e.g. "Vase", "Saree", "Idol")
      3. The Material (e.g. "Silk", "Brass", "Clay")
      4. The Color or Style.

      Example Output: ["Blue Pottery", "Jaipur", "Ceramic", "Vase", "Floral"]
      Do not include markdown or explanations. Just the JSON array.
    `;

    const imagePart = {
      inlineData: {
        data: imageBase64,
        mimeType: "image/jpeg",
      },
    };

    const result = await model.generateContent([prompt, imagePart]);
    const text = result.response.text();
    
    const cleanText = text.replace(/```json/g, '').replace(/```/g, '').trim();
    const keywords = JSON.parse(cleanText);

    return keywords.join(" ");

  } catch (error) {
    console.error("Visual Search Error:", error);
    return null;
  }
}
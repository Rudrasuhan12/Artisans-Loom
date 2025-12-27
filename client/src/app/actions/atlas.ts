"use server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function getSpecificInsight(stateName: string, type: 'fact' | 'story' | 'culture') {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash-lite" });
    
    let prompt = "";
    if (type === 'fact') prompt = `Tell me a rare, mind-blowing "Did you know?" fact about the crafts of ${stateName}. Keep it under 20 words.`;
    if (type === 'story') prompt = `Tell me a short 30-word folklore or legend related to a handicraft from ${stateName}.`;
    if (type === 'culture') prompt = `Describe the royal or cultural significance of ${stateName}'s art in 25 words.`;

    const result = await model.generateContent(prompt);
    return result.response.text();
  } catch (error) {
    return "The spirits of the loom are quiet right now. Try again.";
  }
}
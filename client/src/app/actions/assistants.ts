"use server";

import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

export async function getGiftingSuggestions(city: string, occasion: string, type: string) {
  try {
    const prompt = `
      You are a Royal Indian Craft Concierge.
      Suggest 3 specific authentic Indian handloom/handicraft gifts.
      
      Context:
      - Location Context: ${city} (Suggest things popular or relevant here if applicable, otherwise general Indian)
      - Occasion: ${occasion}
      - User Preference: ${type || "Any"}
      
      Output ONLY a JSON array with this structure (no markdown):
      [
        { "title": "Product Name", "desc": "Why it fits the occasion (max 15 words)", "searchQuery": "Keywords to search" }
      ]
    `;

    const result = await model.generateContent(prompt);
    const text = result.response.text().replace(/```json/g, '').replace(/```/g, '').trim();
    return JSON.parse(text);
  } catch (error) {
    console.error("AI Error:", error);
    return [];
  }
}

export async function getDecorSuggestions(room: string, vibe: string, color: string) {
  try {
    const prompt = `
      You are an Indian Interior Decorator specializing in Heritage Crafts.
      Suggest 3 decor items.
      
      Context:
      - Room: ${room}
      - Vibe: ${vibe}
      - Color Palette: ${color}
      
      Output ONLY a JSON array with this structure (no markdown):
      [
        { "title": "Product Name", "desc": "Placement advice (max 15 words)", "searchQuery": "Keywords to search" }
      ]
    `;

    const result = await model.generateContent(prompt);
    const text = result.response.text().replace(/```json/g, '').replace(/```/g, '').trim();
    return JSON.parse(text);
  } catch (error) {
    console.error("AI Error:", error);
    return [];
  }
}
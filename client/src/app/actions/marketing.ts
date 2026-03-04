"use server";

import { GoogleGenerativeAI } from "@google/generative-ai";
import { auth } from "@/auth";

// Initialize the Gemini API with your key
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

/**
 * Generates story-driven marketing copy for products.
 */
export async function generateMarketingCopy(data: {
  title: string;
  category: string;
  materials: string[];
  description?: string;
  language: string;
}) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  try {
    if (!process.env.GEMINI_API_KEY) {
      throw new Error("GEMINI_API_KEY is missing in your .env.local file.");
    }

    // Using gemini-2.5-flash for speed and higher rate limits
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const prompt = `
      You are an expert marketing copywriter specializing in Indian handicrafts and artisan stories.
      Generate a marketing bundle for the following product in ${data.language}:
      
      Product Name: ${data.title}
      Category: ${data.category}
      Materials used: ${data.materials.join(", ")}
      Current Description: ${data.description || "No description provided"}

      Please provide the following in a structured JSON format ONLY:
      1. "storyTitle": A poetic, evocative title.
      2. "seoDescription": A 3-paragraph story-driven description focusing on heritage and craftsmanship.
      3. "instagramPost": An engaging caption with relevant hashtags.
      4. "emailSubject": A compelling subject line for a newsletter.
      5. "socialHook": A 1-sentence "hook" to grab attention on social media.

      Constraint: Return ONLY the JSON object. Do not include markdown code blocks or any other text.
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // Robust JSON extraction to prevent parsing errors
    const startIndex = text.indexOf('{');
    const endIndex = text.lastIndexOf('}');
    
    if (startIndex === -1 || endIndex === -1) {
      throw new Error("The AI did not return a valid data format.");
    }

    return JSON.parse(text.substring(startIndex, endIndex + 1));

  } catch (error: any) {
    console.error("--- MARKETING AI ERROR ---", error.message);
    if (error.status === 429 || error.message?.includes("429")) {
      throw new Error("Rate limit exceeded. Please wait a minute before generating again.");
    }
    throw new Error(error.message || "Failed to generate marketing copy.");
  }
}

/**
 * Generates a 15-second viral Reel script for products.
 * Implemented based on the storyboard structure of the reference project.
 */
export async function generateReelScript(data: {
  title: string;
  category: string;
  materials: string[];
  description: string;
}) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  try {
    if (!process.env.GEMINI_API_KEY) {
      throw new Error("GEMINI_API_KEY is missing in your .env.local file.");
    }

    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const prompt = `
      You are a viral social media strategist for Indian handicrafts.
      Create a high-energy, 15-second Instagram Reel script for this product:
      
      Product: ${data.title}
      Category: ${data.category}
      Materials: ${data.materials.join(", ")}
      Heritage Story: ${data.description}

      Return ONLY a valid JSON object with a "scenes" array. Each scene must have:
      1. "visual": Detailed description of what the artisan should film.
      2. "voiceover": The exact script the artisan should say.
      3. "onScreenText": Short, punchy text overlay.

      Structure this into exactly 3-4 quick, engaging scenes. 
      Constraint: Return ONLY the JSON object. No markdown.
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    const startIndex = text.indexOf('{');
    const endIndex = text.lastIndexOf('}');
    
    if (startIndex === -1 || endIndex === -1) {
      throw new Error("The AI failed to direct your script. Please try again.");
    }

    return JSON.parse(text.substring(startIndex, endIndex + 1));
  } catch (error: any) {
    console.error("--- REEL SCRIPT ERROR ---", error.message);
    if (error.status === 429 || error.message?.includes("429")) {
      throw new Error("Rate limit exceeded. Please wait 60 seconds.");
    }
    throw new Error(error.message || "Failed to generate video script.");
  }
}
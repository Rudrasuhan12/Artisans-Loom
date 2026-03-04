"use server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { auth } from "@/auth";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function getSpecificInsight(stateName: string, type: 'fact' | 'story' | 'culture') {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

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

export async function getCraftStory(craftName: string, region: string) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash-lite" });
    const prompt = `Tell me a short, engaging folk tale or story (around 150 words) related to the traditional craft of ${craftName} from the region of ${region}.`;
    const result = await model.generateContent(prompt);
    return { text: result.response.text(), error: null };
  } catch (error: any) {
    if (error.message?.includes("429") || error.status === 429) {
      return { text: null, error: "rate_limit" };
    }
    return { text: null, error: "The Craft Mitra is currently weaving new tales. Please try again." };
  }
}

export async function getCraftMarketingCopy(craftName: string, region: string) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash-lite" });
    const prompt = `Write a vivid and evocative 2-sentence marketing description for a handmade ${craftName} from ${region}, perfect for an e-commerce site.`;
    const result = await model.generateContent(prompt);
    return { text: result.response.text(), error: null };
  } catch (error: any) {
    if (error.message?.includes("429") || error.status === 429) {
      return { text: null, error: "rate_limit" };
    }
    return { text: null, error: "Could not generate description. Please try again." };
  }
}
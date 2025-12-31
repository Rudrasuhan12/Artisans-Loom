import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { productName, material, category, promptOverride } = await req.json();

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "API Key Missing" }, { status: 500 });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    
    const model = genAI.getGenerativeModel({ 
      model: "gemini-2.5-flash" 
    });

    const prompt = promptOverride || 
      `Act as "Craft Mitra" for Artisans Loom. Generate a storytelling description for a ${productName} made of ${material} in the ${category} category. Include cultural significance.`;

    const result = await model.generateContent(prompt);
    const text = result.response.text();

    return NextResponse.json({ text });

  } catch (error: any) {
    if (error.message?.includes("429") || error.message?.includes("limit: 0")) {
      console.error("❌ Gemini API: Quota/Billing issue detected.");
      return NextResponse.json(
        { error: "Quota Exceeded. Please check your Google AI Studio dashboard to ensure the Free Tier is active for this model." }, 
        { status: 429 }
      );
    }

    console.error("❌ Gemini API Error:", error.message);
    return NextResponse.json({ error: "AI Failed", details: error.message }, { status: 500 });
  }
}
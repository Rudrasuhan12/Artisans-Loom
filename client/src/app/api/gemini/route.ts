import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

export async function POST(req: Request) {
  try {
    // Require authentication to prevent abuse
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { productName, material, category } = await req.json();

    if (!productName || !category) {
      return NextResponse.json({ error: "Product name and category are required" }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "API Key Missing" }, { status: 500 });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    
    const model = genAI.getGenerativeModel({ 
      model: "gemini-2.5-flash" 
    });

    // Use fixed prompt structure — no user-controlled promptOverride
    const prompt = `Act as "Craft Mitra" for Artisans Loom. Generate a storytelling description for a ${productName} made of ${material || "traditional materials"} in the ${category} category. Include cultural significance. Max 50 words.`;

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
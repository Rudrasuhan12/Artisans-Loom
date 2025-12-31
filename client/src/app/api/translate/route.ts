import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function POST(req: Request) {
  try {
    const { text, targetLanguage } = await req.json();

    if (!text || !targetLanguage || targetLanguage === 'en' || targetLanguage === 'en-IN') {
      return NextResponse.json({ translatedText: text });
    }

    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash-lite" });

    const prompt = `
      Translate this text to ${targetLanguage} (Indian Context).
      Keep it short, culturally accurate, and retain the original meaning.
      Output ONLY the translated text. No explanations.
      
      Text: "${text}"
    `;

    const result = await model.generateContent(prompt);
    const translatedText = result.response.text().trim();

    return NextResponse.json({ translatedText });

  } catch (error) {
    console.error("AI Translation Error:", error);
    return NextResponse.json({ translatedText: req.body ? (await req.json()).text : "" });
  }
}
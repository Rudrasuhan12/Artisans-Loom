import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function POST(req: Request) {
  try {
    const { text, targetLanguage } = await req.json();

    if (!text || !targetLanguage) {
      return NextResponse.json({ error: "Missing text or language" }, { status: 400 });
    }

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `
      Translate the following text into ${targetLanguage}. 
      Maintain the emotional tone and cultural nuances of the original text.
      Only return the translated text, nothing else.
      
      Text to translate: ${text}
    `;

    const result = await model.generateContent(prompt);
    return NextResponse.json({ translatedText: result.response.text() });
  } catch (error) {
    return NextResponse.json({ error: "Translation failed" }, { status: 500 });
  }
}
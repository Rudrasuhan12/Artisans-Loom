import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function POST(req: Request) {
  try {
    const { productName, material, category } = await req.json();
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `Act as "Craft Mitra" for Artisans Loom. Generate a storytelling description for a ${productName} made of ${material} in the ${category} category. Include cultural significance and a suggested price in INR.`;

    const result = await model.generateContent(prompt);
    return NextResponse.json({ text: result.response.text() });
  } catch (error) {
    return NextResponse.json({ error: "AI Failed" }, { status: 500 });
  }
}
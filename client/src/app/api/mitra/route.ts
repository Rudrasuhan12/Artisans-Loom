import { GoogleGenerativeAI } from "@google/generative-ai";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { SITE_MAP } from "@/lib/site-map";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function POST(req: Request) {
  try {
    const { message, history } = await req.json();
    const { userId } = await auth();

    // 1. GATHER CONTEXT
    let userRole = "GUEST";
    let userName = "Traveler"; // Default name
    let statsContext = "";

    if (userId) {
      const user = await prisma.user.findUnique({ where: { clerkId: userId } });
      if (user) {
        userRole = user.role;
        userName = user.name || "Friend";
      }
    }

    if (message.toLowerCase().includes("stats") || message.toLowerCase().includes("how many")) {
      const artisanCount = await prisma.user.count({ where: { role: "ARTISAN" } });
      const productCount = await prisma.product.count();
      statsContext = `Live Stats: ${artisanCount} Artisans, ${productCount} Products.`;
    }

    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash-lite" });
    
    const systemPrompt = `
      You are "Craft Mitra", a royal voice assistant for "The Artisan's Loom".
      User: ${userName} (${userRole}).
      Stats: ${statsContext}
      Pages: ${JSON.stringify(SITE_MAP)}

      Rules:
      1. Language: Detect the user's language. Reply IN THAT SAME LANGUAGE.
      2. Tone: Warm, respectful, Indian heritage style.
      3. Navigation: If user wants to go to a page, return the path in JSON.
      
      Output JSON ONLY:
      {
        "text": "Response in user's language",
        "action": "NAVIGATE" | "NONE",
        "url": "/path"
      }
    `;

    const chat = model.startChat({
      history: [
        { role: "user", parts: [{ text: "System: " + systemPrompt }] },
        ...history
      ],
    });

    const result = await chat.sendMessage(message);
    const responseText = result.response.text().replace(/```json/g, '').replace(/```/g, '').trim();
    
    return NextResponse.json(JSON.parse(responseText));

  } catch (error: any) {
    console.error("Mitra Error:", error);
    

    if (error.status === 429 || error.message?.includes("429")) {
      return NextResponse.json({ 
        text: "I am receiving too many prayers at once. Please allow me a moment to rest.", 
        action: "NONE" 
      });
    }

    return NextResponse.json({ 
      text: "I am having trouble connecting to the loom. Please try again.", 
      action: "NONE" 
    });
  }
}
"use server";

import { prisma } from "@/lib/prisma";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function getMitraOracleInsights(language: string = "English") {
  try {
    // 1. Get Internal Data: Top 5 Selling Categories in the last 30 days
    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

    const topCategories = await prisma.orderItem.groupBy({
      by: ['productId'],
      where: {
        order: { createdAt: { gte: oneMonthAgo } }
      },
      _sum: { quantity: true },
    });

    // 2. Synthesize internal context for AI
    const dataContext = `Recent sales show high interest in handcrafted items. The community is actively searching for unique heritage pieces.`;

    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const prompt = `
      You are 'Craft Mitra', a world-class market trend forecaster for an Indian handicraft marketplace.
      Based on this internal platform context: "${dataContext}", provide 3 unique, predictive, and actionable insights for artisans.
      
      The entire response must be in ${language}.
      
      Return ONLY a JSON object with this key:
      "insights": [
        "Insight 1 (Trend Forecast): Identify a rising trend (e.g., Sustainable home decor).",
        "Insight 2 (Design Prompt): Suggest a specific new product idea (e.g., Terracotta desk organizers).",
        "Insight 3 (Marketing Tip): Provide a tip (e.g., Use 'behind-the-scenes' videos for better engagement)."
      ]
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    const startIndex = text.indexOf('{');
    const endIndex = text.lastIndexOf('}');
    return JSON.parse(text.substring(startIndex, endIndex + 1));

  } catch (error) {
    console.error("Oracle Error:", error);
    throw new Error("The Oracle is currently silent. Please try again later.");
  }
}
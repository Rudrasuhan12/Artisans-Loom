"use server";

import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function getMitraOracleInsights() {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const user = await prisma.user.findUnique({
    where: { clerkId: userId },
    include: {
      products: { select: { title: true, category: true, views: true, salesCount: true } },
      orders: true
    }
  });

  if (!user) throw new Error("User not found");

  const productSummary = user.products.slice(0, 5).map(p => `${p.title} (${p.category})`).join(", ");
  const totalSales = user.products.reduce((acc, p) => acc + p.salesCount, 0);

  const prompt = `
    You are 'Craft Mitra', a royal strategic advisor to an Indian Artisan.
    The artisan makes: ${productSummary || "Various Crafts"}.
    Total Sales: ${totalSales}.

    Generate 3 distinct insights in a strict JSON format.
    
    1. **Trend Forecast**: A short, punchy prediction about their craft niche.
    2. **Design Prompt**: A specific, inspiring idea for a new product.
    3. **Marketing Tip**: A high-impact strategy to sell more.

    **Rules:**
    - Do NOT use labels like "Insight 1" or "Trend Forecast" in the text.
    - Keep the "Headline" short (max 6 words).
    - Keep the "Body" inspiring and actionable (max 30 words).
    
    **Output JSON Structure:**
    {
      "insights": [
        { "type": "TREND", "headline": "...", "body": "..." },
        { "type": "DESIGN", "headline": "...", "body": "..." },
        { "type": "GROWTH", "headline": "...", "body": "..." }
      ]
    }
  `;

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash-lite" });
    const result = await model.generateContent(prompt);
    const text = result.response.text().replace(/```json/g, '').replace(/```/g, '').trim();
    
    return JSON.parse(text);
  } catch (error) {
    console.error("Oracle Error:", error);
    return {
      insights: [
        { type: "TREND", headline: "Heirloom Revivals", body: "Customers are seeking modern utility with ancient aesthetics. Think laptop sleeves with Madhubani art." },
        { type: "DESIGN", headline: "Fusion Materials", body: "Try combining brass with sustainable bamboo for a contemporary, eco-friendly luxury look." },
        { type: "GROWTH", headline: "Story Selling", body: "Record a 30-second video of your hands at work. Process videos increase trust by 40%." }
      ]
    };
  }
}
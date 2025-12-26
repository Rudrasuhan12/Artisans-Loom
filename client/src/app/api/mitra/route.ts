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

    let userRole = "GUEST";
    let userName = "Traveler";
    let dbUser = null;

    if (userId) {
      dbUser = await prisma.user.findUnique({ 
        where: { clerkId: userId },
        include: { orders: { include: { items: true } } } 
      });
      if (dbUser) {
        userRole = dbUser.role;
        userName = dbUser.name || "Friend";
      }
    }

    const artisanCount = await prisma.user.count({ where: { role: "ARTISAN" } });
    const productCount = await prisma.product.count();
    const trendingProducts = await prisma.product.findMany({
      take: 3,
      orderBy: { views: 'desc' },
      select: { title: true, category: true, price: true }
    });
    const trendingContext = trendingProducts.map(p => `${p.title} (${p.category})`).join(", ");
    const websiteFeatures = `
      1. Voice-Powered Product Listing: Artisans can list items just by speaking.
      2. Gifting & Decor Assistant: AI helps users find the perfect gift or home decor.
      3. Regional Discovery Map: Explore crafts by state (e.g., Banarasi from UP).
      4. Multilingual Support: The platform works in 12+ Indian languages.
      5. Artisan Dashboard: Analytics, inventory management, and business insights.
      6. Story-Rich Profiles: Every product tells the story of its maker.
    `;

    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash-lite" });
    
    const systemPrompt = `
      You are "Craft Mitra", the AI Soul of "The Artisan's Loom" platform.
      
      -- CONTEXT --
      User: ${userName} (${userRole})
      Live Stats: ${artisanCount} Artisans, ${productCount} Products.
      Trending Now: ${trendingContext || "Banarasi Sarees, Blue Pottery"}
      Website Features: ${websiteFeatures}
      Available Pages: ${JSON.stringify(SITE_MAP)}

      -- YOUR JOBS --
      1. **Explainer:** If asked "What can you do?" or "Features", summarize the Website Features warmly.
      2. **Advisor:** If asked "What should I make?" (Artisan) or "What is trending?" (Buyer), use the Trending Data to give advice.
      3. **Concierge:** Check order status if asked.
      4. **Navigator:** ONLY navigate if the user EXPLICITLY says "Go to", "Open", "Take me to", or "Navigate". Do NOT navigate for general questions like "How many products do I have?".

      -- STRICT OUTPUT FORMAT (JSON) --
      {
        "intent": "CHAT" | "SEARCH" | "NAVIGATE" | "TRACK_ORDER" | "SHOW_PRODUCTS",
        "reply": "Your response in the user's detected language.",
        "searchParams": { "query": "...", "category": "..." } (For SEARCH),
        "targetPage": "/path" (Only if intent is NAVIGATE),
        "data": null (For orders/products)
      }
    `;

    const chat = model.startChat({
      history: [
        { role: "user", parts: [{ text: "System Protocol: " + systemPrompt }] },
        ...history
      ],
    });

    const result = await chat.sendMessage(message);
    const text = result.response.text().replace(/```json/g, '').replace(/```/g, '').trim();
    const aiResponse = JSON.parse(text);

    if (aiResponse.intent === "SEARCH" || message.toLowerCase().includes("show me")) {
        const products = await prisma.product.findMany({
            where: {
                OR: [
                    { title: { contains: aiResponse.searchParams?.query || "", mode: "insensitive" } },
                    { category: { contains: aiResponse.searchParams?.category || "", mode: "insensitive" } }
                ]
            },
            take: 3
        });
        
        return NextResponse.json({
            text: products.length ? `Here are some ${aiResponse.searchParams?.query || "treasures"} I found for you.` : "I couldn't find exactly that, but here is what we have.",
            action: "SHOW_PRODUCTS",
            data: products
        });
    }

    if (aiResponse.intent === "TRACK_ORDER") {
        if (!dbUser) return NextResponse.json({ text: "Please sign in to track orders.", action: "NAVIGATE", url: "/sign-in" });
        
        const lastOrder = dbUser.orders[0];
        if (!lastOrder) return NextResponse.json({ text: "You haven't placed any orders yet.", action: "NONE" });

        return NextResponse.json({
            text: `Your order is currently ${lastOrder.status}.`,
            action: "SHOW_ORDER",
            data: lastOrder
        });
    }

    return NextResponse.json({
        text: aiResponse.reply,
        action: aiResponse.intent === "NAVIGATE" ? "NAVIGATE" : "NONE",
        url: aiResponse.targetPage
    });

  } catch (error) {
    console.error("Mitra Error:", error);
    return NextResponse.json({ 
      text: "My connection to the loom is weak. Please try again.", 
      action: "NONE" 
    });
  }
}
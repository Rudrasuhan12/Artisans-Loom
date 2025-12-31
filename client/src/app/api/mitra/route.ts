import { GoogleGenerativeAI } from "@google/generative-ai";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { SITE_MAP } from "@/lib/site-map";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

const cleanJSON = (text: string) => {
  const match = text.match(/\{[\s\S]*\}/);
  return match ? match[0] : text;
};

export async function POST(req: Request) {
  try {
    const { message, history, visualContext } = await req.json();
    const { userId } = await auth();

    let userRole = "GUEST";
    let userName = "Traveler";
    let dbUser = null;
    let personalContext = "User is a guest exploring the site.";

    if (userId) {
      dbUser = await prisma.user.findUnique({ 
        where: { clerkId: userId },
        include: { 
          orders: { 
            include: { items: { include: { product: true } } }, 
            orderBy: { createdAt: 'desc' }, 
            take: 3 
          },
          products: {
            select: { title: true, salesCount: true, stock: true, views: true },
            orderBy: { salesCount: 'desc' }
          } 
        } 
      });

      if (dbUser) {
        userRole = dbUser.role;
        userName = dbUser.name?.split(" ")[0] || "Friend";

        if (userRole === "ARTISAN") {
          const totalSales = dbUser.products.reduce((a, b) => a + b.salesCount, 0);
          const topItem = dbUser.products[0]?.title || "None";
          personalContext = `User is an ARTISAN (Seller). Sales: ${totalSales}. Top Item: ${topItem}. Needs business advice.`;
        } else {
          const lastOrder = dbUser.orders[0];
          const lastItem = lastOrder?.items[0]?.product.title;
          personalContext = `User is a PATRON (Buyer). Last purchase: ${lastItem || "None"}.`;
        }
      }
    }

    const trending = await prisma.product.findMany({ 
      take: 4, orderBy: { views: 'desc' }, 
      select: { title: true, category: true, price: true, artisan: { select: { profile: { select: { state: true } } } } } 
    });
    
    const trendingText = trending.map(t => `${t.title} (${t.category}, ₹${t.price})`).join(", ");

    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    
    const systemPrompt = `
      You are "Craft Mitra", the Royal AI Concierge of "The Artisan's Loom".
      
      -- PERSONA --
      Tone: Warm, Sophisticated, Cultured, Helpful. NOT Robotic.
      Style: Use Indian English nuances (Namaste, Ji, Heritage, Masterpiece).
      
      -- LIVE CONTEXT --
      User: ${userName} (${userRole}).
      Personal Data: ${personalContext}
      Current Visual Context (What they see): ${JSON.stringify(visualContext || "None")}
      Trending Items: ${trendingText}
      Site Map: ${JSON.stringify(SITE_MAP)}

      -- CAPABILITIES (INTENTS) --
      1. **SEARCH:** Find products. Extract filters: { query, maxPrice, category, region }.
      2. **BUY_PRODUCT:** User wants to buy specific item. Extract { productName }.
      3. **TRACK_ORDER:** User asks about order status.
      4. **ANALYTICS:** (Artisan Only) Ask about sales/views.
      5. **COMPARE:** User asks "Compare X and Y". Extract { productA, productB }.
      6. **NAVIGATE:** User says "Go to X".
      7. **CHAT:** General questions, history, culture, advice.

      -- RULES --
      - If user asks "What is trending?", show the trending items using SHOW_PRODUCTS.
      - If user asks "Where is my order?", use TRACK_ORDER.
      - If user says "Buy [Item]", use BUY_PRODUCT.

      -- OUTPUT JSON FORMAT (MANDATORY) --
      {
        "intent": "CHAT" | "SEARCH" | "NAVIGATE" | "TRACK_ORDER" | "BUY_PRODUCT" | "SHOW_ANALYTICS" | "COMPARE",
        "reply": "Your spoken response here.",
        "data": { ...extracted params... },
        "url": "/path" (For navigation)
      }
    `;

    const chat = model.startChat({
      history: [
        { role: "user", parts: [{ text: "System Protocol: " + systemPrompt }] },
        ...history
      ],
    });

    const result = await chat.sendMessage(message);
    const text = cleanJSON(result.response.text());
    const ai = JSON.parse(text);

    if (ai.intent === "SEARCH" || message.toLowerCase().includes("show me") || message.toLowerCase().includes("recommend")) {
        const filters: any = {};

        if (ai.data?.maxPrice) filters.price = { lte: parseFloat(ai.data.maxPrice) };
        if (ai.data?.category) filters.category = { contains: ai.data.category, mode: "insensitive" };

        let regionFilter = {};
        if (ai.data?.region) {
           regionFilter = { artisan: { profile: { state: { contains: ai.data.region, mode: "insensitive" } } } };
        }

        const products = await prisma.product.findMany({
            where: {
                AND: [
                    { 
                        OR: [
                            { title: { contains: ai.data?.query || "", mode: "insensitive" } },
                            { description: { contains: ai.data?.query || "", mode: "insensitive" } },
                            { category: { contains: ai.data?.query || "", mode: "insensitive" } },
                            { tags: { has: ai.data?.query || "" } }
                        ]
                    },
                    filters,
                    regionFilter
                ]
            },
            take: 4,
            include: { artisan: { include: { profile: true } } }
        });

        if (products.length === 0) {
           return NextResponse.json({
               text: "I couldn't find an exact match in our loom, but here are some trending masterpieces you might adore.",
               action: "SHOW_PRODUCTS",
               data: await prisma.product.findMany({ take: 3, orderBy: { views: 'desc' } })
           });
        }

        return NextResponse.json({
            text: ai.reply,
            action: "SHOW_PRODUCTS",
            data: products
        });
    }

    if (ai.intent === "BUY_PRODUCT") {
        const productName = ai.data?.productName || message.replace(/buy|order|get/gi, "").trim();
        
        const product = await prisma.product.findFirst({
            where: { 
                OR: [
                   { title: { contains: productName, mode: "insensitive" } },
                   { description: { contains: productName, mode: "insensitive" } }
                ]
            }
        });

        if (product) {
            return NextResponse.json({
                text: `Excellent choice. I have added the ${product.title} to your cart.`,
                action: "ADD_TO_CART",
                data: product
            });
        } else {
             return NextResponse.json({
                text: "I couldn't locate that specific item. Would you like to see similar treasures?",
                action: "SEARCH",
                data: { query: productName }
            });
        }
    }

    if (ai.intent === "SHOW_ANALYTICS") {
        if (userRole !== "ARTISAN") return NextResponse.json({ text: "My analytics scrolls are reserved for registered Artisans.", action: "NONE" });
        return NextResponse.json({
            text: ai.reply,
            action: "NAVIGATE",
            url: "/artisan/analytics"
        });
    }

    if (ai.intent === "TRACK_ORDER") {
       if (!dbUser) return NextResponse.json({ text: "Please sign in to access your order history.", action: "NAVIGATE", url: "/sign-in" });
       const lastOrder = dbUser.orders[0];
       
       if (!lastOrder) return NextResponse.json({ text: "I see no active orders in your ledger.", action: "NONE" });
       
       return NextResponse.json({
           text: `Your order #${lastOrder.id.slice(-6).toUpperCase()} is currently ${lastOrder.status}.`,
           action: "SHOW_ORDER",
           data: lastOrder
       });
    }

    if (ai.intent === "COMPARE") {
       const p1Name = ai.data?.productA;
       const p2Name = ai.data?.productB;
       
       const products = await prisma.product.findMany({
          where: {
             title: { in: [p1Name, p2Name], mode: "insensitive" } 
          },
          take: 2
       });
       
       if (products.length < 2) {
          return NextResponse.json({ text: "I need two valid product names to perform a comparison.", action: "NONE" });
       }
       
       return NextResponse.json({
          text: `Here is a comparison between ${products[0].title} and ${products[1].title}.`,
          action: "SHOW_PRODUCTS",
          data: products
       });
    }

    return NextResponse.json({
        text: ai.reply,
        action: ai.intent === "NAVIGATE" ? "NAVIGATE" : "NONE",
        url: ai.url
    });

  } catch (error) {
    console.error("Mitra Brain Error:", error);
    return NextResponse.json({ 
       text: "I apologize, the connection to the archives is momentarily interrupted.", 
       action: "NONE" 
    });
  }
}
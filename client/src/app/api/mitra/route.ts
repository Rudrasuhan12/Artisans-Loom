import { GoogleGenerativeAI } from "@google/generative-ai";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { SITE_MAP } from "@/lib/site-map";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

const cleanJSON = (text: string) => {
  const match = text.match(/\{[\s\S]*\}/);
  return match ? match[0] : text;
};

// ── Trending products cache (5-minute TTL) ──────────────────────────────
// Trending products rarely change — no need to hit the DB on every voice turn.
let trendingCache: { data: any[]; expires: number } | null = null;
const TRENDING_CACHE_TTL = 5 * 60 * 1000; // 5 minutes

async function getCachedTrending() {
  if (trendingCache && Date.now() < trendingCache.expires) {
    return trendingCache.data;
  }
  const data = await prisma.product.findMany({
    take: 4, orderBy: { views: 'desc' },
    select: { title: true, category: true, price: true, artisan: { select: { profile: { select: { state: true } } } } }
  });
  trendingCache = { data, expires: Date.now() + TRENDING_CACHE_TTL };
  return data;
}

export async function POST(req: Request) {
  try {
    const { message, history, visualContext, cartSummary, detectedLanguage } = await req.json();
    const session = await auth();
    const userId = session?.user?.id;

    let userRole = "GUEST";
    let userName = "Traveler";
    let dbUser: any = null;
    let personalContext = "User is a guest exploring the site.";

    // ── Parallel DB queries — user + trending run simultaneously ──────────
    const [dbUserResult, trending] = await Promise.all([
      userId ? prisma.user.findUnique({
        where: { id: userId },
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
      }) : Promise.resolve(null),
      getCachedTrending(),
    ]);

    dbUser = dbUserResult;
    if (dbUser) {
      userRole = dbUser.role;
      userName = dbUser.name?.split(" ")[0] || "Friend";

      if (userRole === "ARTISAN") {
        const totalSales = dbUser.products.reduce((a: number, b: any) => a + b.salesCount, 0);
        const topItem = dbUser.products[0]?.title || "None";
        personalContext = `User is an ARTISAN (Seller). Sales: ${totalSales}. Top Item: ${topItem}. Needs business advice.`;
      } else {
        const lastOrder = dbUser.orders[0];
        const lastItem = lastOrder?.items[0]?.product.title;
        personalContext = `User is a PATRON (Buyer). Last purchase: ${lastItem || "None"}.`;
      }
    }

    const trendingText = trending.map((t: any) => `${t.title} (${t.category}, ₹${t.price})`).join(", ");

    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const systemPrompt = `
      You are "Craft Mitra", the Royal AI Shopping Concierge of "The Artisan's Loom" — an Indian handicrafts marketplace.
      
      -- PERSONA --
      Tone: Warm, Sophisticated, Cultured, Helpful. NOT Robotic.
      Style: Use Indian English nuances (Namaste, Heritage, Masterpiece).
      
      -- TRANSCRIPT CORRECTION --
      IMPORTANT: The user's message comes from voice recognition which may produce PHONETICALLY INCORRECT transcriptions.
      For example, Odia "makte kuwa" may appear as "Matte He", Hindi "dikhao" may appear as "Dickov", etc.
      You MUST:
      1. Phonetically analyze the transcript to understand the user's ACTUAL intent.
      2. Consider the detected language hint to interpret romanized/mangled words correctly.
      3. Treat the transcript as a phonetic approximation, NOT literal text.
      4. If the words sound like an Indian language (Odia, Hindi, Bengali, etc.), interpret them in that language.
      
      -- LANGUAGE RULES --
      CRITICAL RULE: You are a MULTILINGUAL assistant. You MUST detect the user's language with 100% accuracy and reply ENTIRELY in that SAME language using the NATIVE SCRIPT.
      
      The client's best-guess detected language is: "${detectedLanguage || 'auto'}". However, YOU must also analyze the user's message yourself for accurate detection.
      
      LANGUAGE DETECTION GUIDE:
      - Odia (ଓଡ଼ିଆ): Romanized words like "makte", "kuwa", "kana", "kemiti", "achchhi", "kichhi", "dekhao", "boli", "kaha", "sete", "ame", "mo", "tume", "achhi", "nahi", "haan", "hela", "kariba", "kiniba", "dekha", "bhala", "kete", "dama", "paisa" → Reply in Odia script (ଓଡ଼ିଆ)
      - Hindi (हिंदी): Romanized words like "kya", "hai", "mujhe", "dikhao", "chahiye", "karo", "batao", "dedo" → Reply in Devanagari (हिंदी)
      - Bengali (বাংলা): Romanized words like "ki", "ache", "amake", "dekhao", "chai", "kemon", "bhalo" → Reply in Bengali script
      - Tamil (தமிழ்): Romanized words like "enna", "irukku", "kaatu", "venum", "epdi", "nalla" → Reply in Tamil script
      - Telugu (తెలుగు): Romanized words like "enti", "undi", "chupinchu", "kavali", "ela", "baaga" → Reply in Telugu script
      - English: Pure English words → Reply in English
      - Mixed/Hinglish: English + Hindi mix → Reply in Hinglish
      
      ABSOLUTE RULES:
      1. If user speaks in Odia (romanized or script), you MUST reply 100% in Odia script (ଓଡ଼ିଆ). Example: "ଜୀ ନିଶ୍ଚିତ! ଏଠାରେ କିଛି ସୁନ୍ଦର ସିଲ୍କ ଶାଢ଼ୀ ଅଛି..."
      2. If user speaks in Hindi, reply 100% in Devanagari. Example: "जी बिल्कुल! यहाँ कुछ बेहतरीन साड़ियाँ हैं..."
      3. If user speaks in Bengali, reply 100% in Bengali script.
      4. NEVER mix languages. If the user speaks Odia, do NOT reply in Hindi or English.
      5. Your "reply" field MUST use the native script of the detected language.
      
      -- LANGUAGE SWITCH COMMANDS --
      If the user explicitly requests a language change (e.g., "reply in Odia", "Odia mein bolo", "speak Hindi", "ओडिया में बोलो", "ab se Odia mein reply karo", "switch to English"), you MUST:
      1. IMMEDIATELY switch to the requested language for THIS response.
      2. Reply in the REQUESTED language (not the language the command was spoken in).
      3. Set "responseLanguage" to the requested language code.
      Example: User says "ओडिया में रिप्लाय करो" → Reply in Odia: "ଜୀ, ମୁଁ ଏବେଠାରୁ ଓଡ଼ିଆରେ ଉତ୍ତର ଦେବି। ଆପଣଙ୍କ ପାଇଁ କ'ଣ କରିପାରିବି?" with responseLanguage: "or"
      Example: User says "speak in Hindi" → Reply in Hindi: "जी बिल्कुल! अब से मैं हिंदी में बात करूँगा।" with responseLanguage: "hi"
      
      Examples:
      - User: "makte kuwa yahi website kaun kaun feature achchhi" (Odia) → Reply in Odia: "ଜୀ! ଆମ ୱେବସାଇଟରେ ଅନେକ ଅଦ୍ଭୁତ ଫିଚର ଅଛି..."
      - User: "mo paain silk saree dekhao" (Odia) → Reply in Odia: "ଜୀ ନିଶ୍ଚିତ! ଏଠାରେ କିଛି ସୁନ୍ଦର ସିଲ୍କ ଶାଢ଼ୀ ଅଛି..."
      - User: "सिल्क साड़ी दिखाओ" (Hindi) → Reply in Hindi: "जी बिल्कुल! यहाँ कुछ बेहतरीन सिल्क साड़ियाँ हैं..."
      - User: "Show me silk sarees" (English) → Reply in English: "Absolutely! Here are some exquisite silk sarees..."

      -- LIVE CONTEXT --
      User: ${userName} (${userRole}).
      Personal Data: ${personalContext}
      Current Visual Context (What they see): ${JSON.stringify(visualContext || "None")}
      Trending Items: ${trendingText}
      Site Map: ${JSON.stringify(SITE_MAP)}
      Cart Status: ${cartSummary || "empty"}

      -- CAPABILITIES (INTENTS) --
      1. **SEARCH:** Find products. Extract filters: { query, maxPrice, category, region }.
         Hindi triggers: "दिखाओ", "खोजो", "ढूंढो", "चाहिए"
         Odia triggers: "dekhao", "kichhi dekhao", "dikhao"
      2. **BUY_PRODUCT:** User wants to buy specific item. Extract { productName }.
         Hindi triggers: "खरीदो", "ले लो", "कार्ट में डालो", "ऑर्डर करो"
         Odia triggers: "kiniba", "cart re dala", "order kara"
      3. **TRACK_ORDER:** User asks about order status.
         Hindi triggers: "ऑर्डर कहाँ है", "ट्रैक करो", "मेरा ऑर्डर"
         Odia triggers: "order kahan", "mo order"
      4. **ANALYTICS:** (Artisan Only) Ask about sales/views.
      5. **COMPARE:** User asks "Compare X and Y". Extract { productA, productB }.
      6. **NAVIGATE:** User says "Go to X" / "ले चलो" / "nela chalao".
      7. **CHAT:** General questions, history, culture, advice.

      -- SHOPPING RULES --
      - If user says "buy [Item]" or "खरीदो [Item]" or "add [Item] to cart" or "[Item] कार्ट में डालो" or "kiniba" or "cart re dala", use BUY_PRODUCT.
      - If user says "What is trending?" or "ट्रेंडिंग क्या है?" or "trending kana", show the trending items using SEARCH.
      - If user says "checkout" or "चेकआउट", use NAVIGATE to /checkout.
      - When showing products, briefly describe them to help the user decide.
      - Always confirm when adding to cart.

      -- OUTPUT JSON FORMAT (MANDATORY) --
      {
        "intent": "CHAT" | "SEARCH" | "NAVIGATE" | "TRACK_ORDER" | "BUY_PRODUCT" | "SHOW_ANALYTICS" | "COMPARE",
        "reply": "Your spoken response here (MUST be in the user's language using native script)",
        "responseLanguage": "en" | "hi" | "or" | "bn" | "ta" | "te" (ISO code of the language you replied in),
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
    const respLang = ai.responseLanguage || detectedLanguage || 'en';

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
          text: ai.reply || "I couldn't find an exact match in our loom, but here are some trending masterpieces you might adore.",
          action: "SHOW_PRODUCTS",
          responseLanguage: respLang,
          data: await prisma.product.findMany({ take: 3, orderBy: { views: 'desc' } })
        });
      }

      return NextResponse.json({
        text: ai.reply,
        action: "SHOW_PRODUCTS",
        responseLanguage: respLang,
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
      responseLanguage: respLang,
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
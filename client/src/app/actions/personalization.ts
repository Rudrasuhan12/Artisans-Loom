"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

// In-memory cache for recommendations (survives per-server instance)
// Cache for 6 hours to reduce API calls dramatically
const recommendationCache = new Map<string, { data: PersonalizedRecommendation; timestamp: number }>();
const CACHE_TTL = 6 * 60 * 60 * 1000; // 6 hours in milliseconds

// Rate limit cooldown - when hit, don't call AI for this duration
let rateLimitCooldown = 0;
const RATE_LIMIT_COOLDOWN_DURATION = 60 * 1000; // 60 seconds cooldown after rate limit

interface UserHistory {
  purchaseCategories: string[];
  purchaseMaterials: string[];
  recentPurchases: string[];
  chatKeywords: string[];
}

interface PersonalizedRecommendation {
  recommendedTags: string[];
  recommendedCategories: string[];
  reasoning: string;
}

/**
 * Aggregates user history from purchases and chat interactions
 */
async function aggregateUserHistory(userId: string): Promise<UserHistory | null> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      orders: {
        include: {
          items: {
            include: {
              product: {
                select: {
                  title: true,
                  category: true,
                  materials: true,
                  tags: true,
                },
              },
            },
          },
        },
        orderBy: { createdAt: "desc" },
        take: 10,
      },
      chatHistory: {
        orderBy: { id: "desc" },
        take: 5,
      },
    },
  });

  if (!user) return null;

  // Extract purchase history data
  const purchaseCategories: string[] = [];
  const purchaseMaterials: string[] = [];
  const recentPurchases: string[] = [];

  user.orders.forEach((order) => {
    order.items.forEach((item) => {
      if (item.product.category) {
        purchaseCategories.push(item.product.category);
      }
      if (item.product.materials) {
        purchaseMaterials.push(...item.product.materials);
      }
      if (item.product.title) {
        recentPurchases.push(item.product.title);
      }
    });
  });

  // Extract keywords from chat history
  const chatKeywords: string[] = [];
  user.chatHistory.forEach((chat) => {
    const messages = chat.messages as { role: string; parts: { text: string }[] }[];
    messages.forEach((msg) => {
      if (msg.role === "user" && msg.parts?.[0]?.text) {
        // Extract meaningful words (skip common words)
        const text = msg.parts[0].text.toLowerCase();
        const words = text.split(/\s+/).filter((word) => {
          const skipWords = ["i", "want", "to", "the", "a", "an", "is", "are", "show", "me", "find", "get", "buy", "please", "can", "you", "do", "have", "any"];
          return word.length > 3 && !skipWords.includes(word);
        });
        chatKeywords.push(...words);
      }
    });
  });

  return {
    purchaseCategories: [...new Set(purchaseCategories)],
    purchaseMaterials: [...new Set(purchaseMaterials)],
    recentPurchases: recentPurchases.slice(0, 5),
    chatKeywords: [...new Set(chatKeywords)].slice(0, 20),
  };
}

/**
 * Generates fallback recommendations based on user history without AI
 */
function generateFallbackRecommendations(history: UserHistory): PersonalizedRecommendation {
  // Use the user's actual purchase categories if available
  const categories = history.purchaseCategories.length > 0 
    ? history.purchaseCategories.slice(0, 3)
    : ["Textiles", "Home Decor", "Jewelry"];
  
  // Combine materials and keywords for tags
  const tags = [
    ...history.purchaseMaterials.slice(0, 4),
    ...history.chatKeywords.slice(0, 4),
    "handcrafted", "traditional", "artisan"
  ].filter((v, i, a) => a.indexOf(v) === i).slice(0, 8);

  return {
    recommendedCategories: categories,
    recommendedTags: tags.length > 0 ? tags : ["handcrafted", "traditional", "artisan", "ethnic"],
    reasoning: history.purchaseCategories.length > 0 
      ? `Based on your interest in ${categories[0]}` 
      : "Popular categories for new users",
  };
}

/**
 * Uses Gemini AI to generate personalized recommendations based on user history
 * Includes caching to reduce API calls
 */
async function getAIRecommendations(history: UserHistory, userId: string): Promise<PersonalizedRecommendation> {
  // Check cache first
  const cached = recommendationCache.get(userId);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    console.log("Using cached recommendations for user:", userId.slice(0, 8) + "...");
    return cached.data;
  }

  // Check if we're in rate limit cooldown - use fallback without calling AI
  if (Date.now() < rateLimitCooldown) {
    console.log("Rate limit cooldown active, using fallback recommendations");
    return generateFallbackRecommendations(history);
  }

  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

  const prompt = `
    You are a recommendation engine for "The Artisan's Loom", an Indian handicrafts e-commerce platform.
    
    Based on this user's history, suggest what they might like:
    
    **Purchase History:**
    - Categories bought: ${history.purchaseCategories.join(", ") || "None"}
    - Materials preferred: ${history.purchaseMaterials.join(", ") || "None"} 
    - Recent items: ${history.recentPurchases.join(", ") || "None"}
    
    **Search/Chat History Keywords:**
    ${history.chatKeywords.join(", ") || "None"}
    
    **Available Categories:** Home Decor, Textiles, Jewelry, Pottery, Metalwork, Paintings, Woodwork, Stone Carving
    
    **Task:** Return a JSON object with:
    1. "recommendedCategories": Top 3 categories they would likely enjoy (from available categories)
    2. "recommendedTags": 5-8 specific product tags/keywords that match their interests (e.g., "silk", "brass", "hand-painted", "traditional", "wedding")
    3. "reasoning": A brief one-line explanation of why these recommendations fit
    
    Return ONLY valid JSON, no markdown formatting.
  `;

  try {
    const result = await model.generateContent(prompt);
    const text = result.response.text().replace(/```json/g, "").replace(/```/g, "").trim();
    const recommendations = JSON.parse(text);
    
    // Cache the result
    recommendationCache.set(userId, { data: recommendations, timestamp: Date.now() });
    console.log("Cached new recommendations for user:", userId.slice(0, 8) + "...");
    
    return recommendations;
  } catch (error: unknown) {
    console.error("AI Recommendation Error:", error);
    
    // Check if it's a rate limit error (429)
    if (error && typeof error === 'object' && 'status' in error && error.status === 429) {
      // Set cooldown to prevent repeated failed calls
      rateLimitCooldown = Date.now() + RATE_LIMIT_COOLDOWN_DURATION;
      console.log("Rate limit hit, cooldown activated for 60 seconds");
    }
    
    // Use smart fallback based on user's actual history
    const fallback = generateFallbackRecommendations(history);
    
    // Cache the fallback too (but for shorter time - 1 hour)
    recommendationCache.set(userId, { data: fallback, timestamp: Date.now() - (CACHE_TTL - 60 * 60 * 1000) });
    
    return fallback;
  }
}

/**
 * Fetches products matching the AI-recommended categories and tags
 */
async function fetchPersonalizedProducts(recommendations: PersonalizedRecommendation, limit: number = 8) {
  const { recommendedCategories, recommendedTags } = recommendations;

  // Build tag matching conditions
  const tagConditions = recommendedTags.map((tag) => ({
    OR: [
      { tags: { has: tag } },
      { title: { contains: tag, mode: "insensitive" as const } },
      { description: { contains: tag, mode: "insensitive" as const } },
      { materials: { has: tag } },
    ],
  }));

  // First, try to find products that match tags
  let products = await prisma.product.findMany({
    where: {
      OR: [
        { category: { in: recommendedCategories } },
        ...tagConditions,
      ],
    },
    include: {
      artisan: {
        include: {
          profile: true,
        },
      },
    },
    orderBy: [{ salesCount: "desc" }, { views: "desc" }],
    take: limit * 2, // Fetch more to allow for randomization
  });

  // Shuffle and limit results for variety
  products = products.sort(() => 0.5 - Math.random()).slice(0, limit);

  return products;
}

/**
 * Main function: Get personalized product recommendations for the current user
 */
export async function getPersonalizedRecommendations(limit: number = 8) {
  const session = await auth();

  if (!session?.user?.id) {
    // For guest users, return trending/popular products
    const popularProducts = await prisma.product.findMany({
      orderBy: [{ salesCount: "desc" }, { views: "desc" }],
      take: limit,
      include: {
        artisan: {
          include: {
            profile: true,
          },
        },
      },
    });
    return {
      products: popularProducts,
      isPersonalized: false,
      reasoning: "Popular products for you to explore",
    };
  }

  // Get user history
  const history = await aggregateUserHistory(session.user.id);

  if (!history || (history.purchaseCategories.length === 0 && history.chatKeywords.length === 0)) {
    // User has no history, return popular products with a gentle prompt
    const popularProducts = await prisma.product.findMany({
      orderBy: [{ salesCount: "desc" }, { views: "desc" }],
      take: limit,
      include: {
        artisan: {
          include: {
            profile: true,
          },
        },
      },
    });
    return {
      products: popularProducts,
      isPersonalized: false,
      reasoning: "Start exploring to get personalized recommendations!",
    };
  }

  // Get AI recommendations based on history
  const recommendations = await getAIRecommendations(history, session.user.id);

  // Fetch products matching recommendations
  const products = await fetchPersonalizedProducts(recommendations, limit);

  // If not enough products found, supplement with popular ones
  if (products.length < limit) {
    const existingIds = products.map((p) => p.id);
    const additionalProducts = await prisma.product.findMany({
      where: {
        id: { notIn: existingIds },
      },
      orderBy: { salesCount: "desc" },
      take: limit - products.length,
      include: {
        artisan: {
          include: {
            profile: true,
          },
        },
      },
    });
    products.push(...additionalProducts);
  }

  return {
    products,
    isPersonalized: true,
    reasoning: recommendations.reasoning,
    recommendedCategories: recommendations.recommendedCategories,
    recommendedTags: recommendations.recommendedTags,
  };
}

/**
 * Get quick recommendations for Shop/Trending pages (lighter version)
 */
export async function getQuickRecommendedTags(): Promise<string[]> {
  const session = await auth();

  if (!session?.user?.id) {
    return ["handcrafted", "traditional", "silk", "brass", "wooden"];
  }

  const history = await aggregateUserHistory(session.user.id);

  if (!history || (history.purchaseCategories.length === 0 && history.chatKeywords.length === 0)) {
    return ["handcrafted", "traditional", "silk", "brass", "wooden"];
  }

  // Use AI to get relevant tags
  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

  const prompt = `
    Based on these user preferences:
    - Categories: ${history.purchaseCategories.join(", ")}
    - Materials: ${history.purchaseMaterials.join(", ")}
    - Keywords: ${history.chatKeywords.slice(0, 10).join(", ")}
    
    Return exactly 5 relevant search tags for an Indian handicrafts shop.
    Return ONLY a JSON array of strings, no other text.
    Example: ["silk saree", "brass lamp", "handwoven", "rajasthani", "wedding decor"]
  `;

  try {
    const result = await model.generateContent(prompt);
    const text = result.response.text().replace(/```json/g, "").replace(/```/g, "").trim();
    return JSON.parse(text);
  } catch {
    return ["handcrafted", "traditional", "silk", "brass", "wooden"];
  }
}

/**
 * Enhanced recommendations using semantic search when available
 * Falls back to standard recommendations if embeddings aren't set up
 */
export async function getEnhancedRecommendations(limit: number = 8) {
  const session = await auth();

  if (!session?.user?.id) {
    // For guest users, return trending/popular products
    const popularProducts = await prisma.product.findMany({
      orderBy: [{ salesCount: "desc" }, { views: "desc" }],
      take: limit,
      include: {
        artisan: {
          include: {
            profile: true,
          },
        },
      },
    });
    return {
      products: popularProducts,
      isPersonalized: false,
      reasoning: "Popular products for you to explore",
      usesSemantic: false,
    };
  }

  // Check if semantic search is available (embeddings exist)
  const embeddingCheck = await prisma.$queryRaw<{ count: bigint }[]>`
    SELECT COUNT(*)::bigint as count FROM "Product" WHERE embedding IS NOT NULL
  `;

  const hasEmbeddings = embeddingCheck[0]?.count && embeddingCheck[0].count > BigInt(0);

  if (hasEmbeddings) {
    // Use semantic search for enhanced recommendations
    try {
      const history = await aggregateUserHistory(session.user.id);

      if (history && (history.purchaseCategories.length > 0 || history.chatKeywords.length > 0)) {
        // Build semantic query from user history
        const semanticQuery = [
          history.purchaseCategories.length > 0 ? `Categories: ${history.purchaseCategories.join(", ")}` : "",
          history.purchaseMaterials.length > 0 ? `Materials: ${history.purchaseMaterials.join(", ")}` : "",
          history.recentPurchases.length > 0 ? `Similar to: ${history.recentPurchases.join(", ")}` : "",
          history.chatKeywords.length > 0 ? `Interested in: ${history.chatKeywords.slice(0, 10).join(", ")}` : "",
        ]
          .filter(Boolean)
          .join(" | ");

        // Import semantic search dynamically to avoid circular dependencies
        const { semanticProductSearch } = await import("./embeddings");
        const semanticResults = await semanticProductSearch(semanticQuery, limit, 0.3);

        if (semanticResults.length > 0) {
          return {
            products: semanticResults,
            isPersonalized: true,
            reasoning: "Curated based on your unique taste and browsing patterns",
            usesSemantic: true,
          };
        }
      }
    } catch (error) {
      console.error("Semantic search failed, falling back to standard:", error);
    }
  }

  // Fall back to standard AI recommendations
  return getPersonalizedRecommendations(limit);
}


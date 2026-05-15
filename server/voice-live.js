/**
 * voice-live.js — Gemini Live bidirectional voice proxy for Craft Mitra.
 *
 * Architecture (same as WombTo18 Maternal Module):
 *   Browser mic (PCM16@16kHz) → this server → Gemini Live → audio chunks → browser speaker
 *
 * Shopping features are preserved via Gemini Live function calling (tools).
 * When Gemini wants product data, it calls a tool → we run the Prisma query →
 * send results back to Gemini → Gemini speaks the answer AND we forward
 * structured action data to the frontend for visual cards.
 */

const WebSocket = require('ws');
const { PrismaClient } = require('@prisma/client');
const { Pool } = require('pg');
const { PrismaPg } = require('@prisma/adapter-pg');

// ── Database ──────────────────────────────────────────────────────────────
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 5,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 5000,
});
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

// ── Gemini Live config ────────────────────────────────────────────────────
const LIVE_MODEL = process.env.GEMINI_LIVE_MODEL || 'gemini-3.1-flash-live-preview';
const LIVE_ENDPOINT = 'wss://generativelanguage.googleapis.com/ws/google.ai.generativelanguage.v1beta.GenerativeService.BidiGenerateContent';

// ── Site map (simplified for voice) ───────────────────────────────────────
const SITE_MAP_TEXT = `
Navigation routes: Home(/), Shop(/shop), Craft Atlas(/craft-atlas), Artisans(/artisans),
Auction(/auction), AI Concierge(/assistants), Trending(/trending), Stories(/stories),
About(/about), Contact(/contact), Help(/help), Checkout(/checkout), Track Order(/track-order),
Sign In(/sign-in), Sign Up(/sign-up), Patron Dashboard(/customer), My Orders(/customer/orders),
My Cart(/customer/cart), Settings(/customer/settings), Artisan Studio(/artisan),
Inventory(/artisan/products), Add Product(/artisan/products/add), Artisan Orders(/artisan/orders),
Analytics(/artisan/analytics), Community(/artisan/community).
`;

// ── Function declarations for shopping ────────────────────────────────────
const SHOPPING_TOOLS = [
  {
    functionDeclarations: [
      {
        name: 'search_products',
        description: 'Search for products in The Artisan\'s Loom marketplace. Use when user asks to see, find, show, or browse products.',
        parameters: {
          type: 'OBJECT',
          properties: {
            query: { type: 'STRING', description: 'Search query (product name, category, or keyword)' },
            minPrice: { type: 'NUMBER', description: 'Minimum price filter in INR' },
            maxPrice: { type: 'NUMBER', description: 'Maximum price filter in INR' },
            category: { type: 'STRING', description: 'Category filter (e.g. Saree, Pottery, Jewelry)' },
            region: { type: 'STRING', description: 'Indian state/region filter' },
          },
          required: ['query'],
        },
      },
      {
        name: 'add_to_cart',
        description: 'Add a specific product to the shopping cart. CRITICAL: ONLY use this tool if the user EXPLICITLY asks to "buy", "add to cart", "purchase", or "order" an item. NEVER call this proactively or assuming intent.',
        parameters: {
          type: 'OBJECT',
          properties: {
            productName: { type: 'STRING', description: 'Name of the product to add to cart' },
          },
          required: ['productName'],
        },
      },
      {
        name: 'track_order',
        description: 'Check the status of the user\'s recent orders.',
        parameters: {
          type: 'OBJECT',
          properties: {
            userId: { type: 'STRING', description: 'User ID (will be injected by system)' },
          },
        },
      },
      {
        name: 'navigate_to_page',
        description: 'Navigate the user to a specific page on the website.',
        parameters: {
          type: 'OBJECT',
          properties: {
            pageName: { type: 'STRING', description: 'Name or keyword for the target page' },
            path: { type: 'STRING', description: 'URL path to navigate to (e.g. /shop, /checkout)' },
          },
          required: ['path'],
        },
      },
      {
        name: 'compare_products',
        description: 'Compare two products side by side.',
        parameters: {
          type: 'OBJECT',
          properties: {
            productA: { type: 'STRING', description: 'First product name' },
            productB: { type: 'STRING', description: 'Second product name' },
          },
          required: ['productA', 'productB'],
        },
      },
      {
        name: 'get_user_stats',
        description: 'Get the current user\'s account statistics and dashboard summary. Works for both customers (orders, spending) and artisans (products, sales, revenue, reviews). Use when user asks about their stats, dashboard, performance, orders, sales, revenue, analytics, how am I doing, mera status, etc.',
        parameters: {
          type: 'OBJECT',
          properties: {
            statType: { type: 'STRING', description: 'Type of stats: overview, orders, products, reviews' },
          },
        },
      },
    ],
  },
];

// ── Tool execution (Prisma queries) ───────────────────────────────────────
async function executeTool(name, args) {
  try {
    switch (name) {
      case 'search_products': {
        const filters = {};
        if (args.minPrice || args.maxPrice) {
          filters.price = {};
          if (args.minPrice) filters.price.gte = parseFloat(args.minPrice);
          if (args.maxPrice) filters.price.lte = parseFloat(args.maxPrice);
        }
        if (args.category) filters.category = { contains: args.category, mode: 'insensitive' };

        let regionFilter = {};
        if (args.region) {
          regionFilter = { artisan: { profile: { state: { contains: args.region, mode: 'insensitive' } } } };
        }

        const products = await prisma.product.findMany({
          where: {
            AND: [
              {
                OR: [
                  { title: { contains: args.query || '', mode: 'insensitive' } },
                  { description: { contains: args.query || '', mode: 'insensitive' } },
                  { category: { contains: args.query || '', mode: 'insensitive' } },
                  { tags: { has: args.query || '' } },
                ],
              },
              filters,
              regionFilter,
            ],
          },
          take: 12, // Fetch more items to support the "See More" feature on the client
          include: { artisan: { include: { profile: true } } },
        });

        if (products.length === 0) {
          // Respect price filter in fallback — don't show ₹12,500 items when user asked for under ₹2000
          const fallbackWhere = {};
          if (args.minPrice || args.maxPrice) {
            fallbackWhere.price = {};
            if (args.minPrice) fallbackWhere.price.gte = parseFloat(args.minPrice);
            if (args.maxPrice) fallbackWhere.price.lte = parseFloat(args.maxPrice);
          }
          const fallback = await prisma.product.findMany({
            where: fallbackWhere,
            take: 12, // Also fetch 12 for fallback
            orderBy: { views: 'desc' },
            include: { artisan: { include: { profile: true } } },
          });
          if (fallback.length > 0) {
            return { products: fallback, message: 'No exact match for your query, but here are popular items in your budget' };
          }
          const rangeMsg = (args.minPrice && args.maxPrice) ? ` between ₹${args.minPrice} and ₹${args.maxPrice}` : args.maxPrice ? ` under ₹${args.maxPrice}` : args.minPrice ? ` over ₹${args.minPrice}` : '';
          return { products: [], message: `No products found${rangeMsg}. Try a different search or alter your budget.` };
        }
        return { products };
      }

      case 'add_to_cart': {
        const product = await prisma.product.findFirst({
          where: {
            OR: [
              { title: { contains: args.productName, mode: 'insensitive' } },
              { description: { contains: args.productName, mode: 'insensitive' } },
            ],
          },
        });
        return product
          ? { product, success: true }
          : { success: false, message: 'Product not found' };
      }

      case 'track_order': {
        // userId is injected by the session, not by Gemini
        return { message: 'Order tracking requires authentication. Please check My Orders page.' };
      }

      case 'navigate_to_page': {
        return { path: args.path, pageName: args.pageName || args.path };
      }

      case 'compare_products': {
        const products = await prisma.product.findMany({
          where: { title: { in: [args.productA, args.productB], mode: 'insensitive' } },
          take: 2,
        });
        return { products };
      }

      default:
        return { error: 'Unknown tool' };
    }
  } catch (err) {
    console.error(`[VoiceLive] Tool ${name} error:`, err.message);
    return { error: err.message };
  }
}

// ── User stats tool execution ─────────────────────────────────────────────
async function executeUserStats(userEmail) {
  if (!userEmail) return { error: 'User not identified. Please sign in first.' };

  try {
    const user = await prisma.user.findUnique({
      where: { email: userEmail },
      include: {
        profile: true,
        orders: { orderBy: { createdAt: 'desc' }, take: 5, include: { items: { include: { product: true } } } },
        products: { orderBy: { createdAt: 'desc' } },
        reviewsReceived: true,
        followedBy: true,
        bids: true,
      },
    });

    if (!user) return { error: 'User not found in database.' };

    if (user.role === 'ARTISAN') {
      const totalSales = user.products.reduce((sum, p) => sum + p.salesCount, 0);
      const totalRevenue = user.products.reduce((sum, p) => sum + (p.salesCount * p.price), 0);
      const totalViews = user.products.reduce((sum, p) => sum + p.views, 0);
      const avgRating = user.reviewsReceived.length > 0
        ? (user.reviewsReceived.reduce((sum, r) => sum + r.rating, 0) / user.reviewsReceived.length).toFixed(1)
        : 'No reviews yet';

      return {
        role: 'ARTISAN',
        name: user.name,
        businessName: user.profile?.businessName || 'Not set',
        craftType: user.profile?.craftType || 'Not set',
        location: user.profile?.location || user.profile?.state || 'Not set',
        totalProducts: user.products.length,
        totalSales,
        totalRevenue: totalRevenue,
        totalViews,
        followers: user.followedBy.length,
        totalReviews: user.reviewsReceived.length,
        averageRating: avgRating,
        verified: user.profile?.isVerified || false,
        topProducts: user.products.slice(0, 3).map(p => ({ title: p.title, sales: p.salesCount, views: p.views, price: p.price })),
        memberSince: user.createdAt,
      };
    } else {
      const totalSpent = user.orders.reduce((sum, o) => sum + o.total, 0);

      return {
        role: 'CUSTOMER',
        name: user.name,
        totalOrders: user.orders.length,
        totalSpent: totalSpent,
        recentOrders: user.orders.slice(0, 3).map(o => ({
          id: o.id.slice(-8).toUpperCase(),
          total: o.total,
          status: o.status,
          date: o.createdAt,
          items: o.items.map(i => i.product?.title || 'Item').join(', '),
        })),
        auctionBids: user.bids.length,
        memberSince: user.createdAt,
      };
    }
  } catch (err) {
    console.error('[VoiceLive] User stats error:', err.message);
    return { error: 'Failed to fetch stats: ' + err.message };
  }
}

// ── Build system prompt ───────────────────────────────────────────────────
function buildSystemPrompt(userRole, userName) {
  const roleContext = userRole === 'ARTISAN'
    ? `The current user "${userName}" is an ARTISAN (Seller/Maker). They create and sell handcrafted products on the platform.
RELEVANT FEATURES FOR THIS ARTISAN:
- Artisan Studio (/artisan): Your business dashboard — sales charts, revenue overview, recent orders, top products at a glance.
- Inventory Management (/artisan/products): Manage all your listed products — edit titles, descriptions, prices, stock, images.
- Creation Studio (/artisan/products/add): Add new products with AI-assisted descriptions, multi-image upload, and voice listing capability.
- Artisan Orders (/artisan/orders): View orders from customers, update fulfillment & shipping status.
- Business Analytics (/artisan/analytics): Deep analytics — revenue trends, conversion rates, top-performing products, view counts, growth metrics.
- The Loom Community (/artisan/community): Forum exclusively for artisans — share tips, discuss techniques, network with fellow craftspeople.
- Studio Settings (/artisan/settings): Edit your business profile — business name, craft type, bio, location, verification status.
- Verification: You can apply for verification via video upload — verified artisans get a badge and higher trust.
DO NOT tell this artisan about customer-specific features like "My Orders", "My Cart", or "Patron Dashboard". They are a seller, not a buyer.`
    : `The current user "${userName}" is a CUSTOMER (Patron/Buyer). They browse and purchase handcrafted products.
RELEVANT FEATURES FOR THIS CUSTOMER:
- Patron Dashboard (/customer): Your personal overview — recent orders, personalized recommendations, account summary.
- My Orders (/customer/orders): Full order history with real-time status tracking, order details, and items breakdown.
- My Cart (/customer/cart): Your shopping cart — manage items, quantities, proceed to checkout.
- Account Settings (/customer/settings): Edit profile, saved addresses, phone number, notification preferences.
- Checkout (/checkout): Review cart, enter shipping address, pay securely via Stripe.
- Track Order (/track-order): Track any order's delivery status by entering the order ID.
DO NOT tell this customer about artisan-specific features like "Artisan Studio", "Inventory Management", "Creation Studio", or "Business Analytics". They are a buyer, not a seller.`;

  return `You are "Craft Mitra", the Royal AI Shopping Concierge of "The Artisan's Loom" — India's premier AI-powered handcrafted marketplace connecting master artisans directly with patrons who cherish authentic Indian heritage.

PERSONA: Warm, Sophisticated, Cultured, Helpful. Use Indian English nuances (Namaste, Heritage, Masterpiece). NOT robotic. You are like a knowledgeable friend who knows every corner of the marketplace.

══ PLATFORM IDENTITY — "THE ARTISAN'S LOOM" ══
An AI-powered Indian handicrafts e-commerce platform that:
- Connects master artisans directly with buyers (patrons) — zero middlemen, fair prices.
- Features handcrafted products: Silk Sarees, Banarasi Weaves, Pottery, Terracotta, Jewelry, Textiles, Wooden Crafts, Metalwork (Dhokra), Leather, Paintings (Pattachitra, Madhubani), Block Prints, Chikankari, Pashmina, and more.
- Supports artisans from all Indian states: Odisha, Rajasthan, West Bengal, Tamil Nadu, Kashmir, Gujarat, UP, Bihar, Andhra Pradesh, etc.
- Has multiple AI-powered features: Smart Recommendations, Voice Shopping (that is you!), AI Gift Advisor, AI Decor Advisor.
- Live auctions for rare/vintage pieces. Community forum for artisans. AI-generated Artisan Spotlight stories.
- Supports languages: English, Hindi, Odia, Bengali, Tamil, Telugu.
- Payments via Stripe. Free shipping on most items. Easy returns & exchanges.

══ CURRENT USER CONTEXT ══
${roleContext}

══ DETAILED PAGE & FEATURE GUIDE ══

HOME PAGE (/):
- Hero banner with call-to-action
- AI-powered personalized product recommendations (unique for each user based on browsing/purchase history)
- Featured artisan profiles section
- Trending products carousel
- Artisan Stories carousel
- Craft Mitra voice assistant (you!) — floating button at bottom-right

ROYAL MARKETPLACE (/shop):
- Full product catalog with advanced filters: by Category, Price Range, Region/State, Materials
- Full-text search with instant results
- Sort by: Price (low/high), Newest, Most Popular, Most Viewed
- Grid and List view toggle
- Each product card shows: image, title, price, artisan name, region, verification badge

PRODUCT DETAIL PAGE (/shop/[id]):
- High-res image gallery with thumbnail strip
- Product info: title, category, price, materials used, "The Story" (artisan's description)
- "Add to Cart" and "Buy Now" action buttons
- 🧬 CRAFT DNA (Product Passport) — A unique digital certificate for each product showing:
  · Product fingerprint ID, creation date
  · The artisan's story and bio
  · Materials used and craft tags
  · Product Journey timeline (Crafted → Origin → Materials → Quality Assured)
  · QR code for authenticity verification
  · Artisan card with verification badge
  Users can access Craft DNA via the "View Craft DNA" button on any product page.
- 📱 AR PREVIEW — Augmented Reality preview button lets customers visualize the product in their real space using their phone camera
- ARTISAN SPOTLIGHT — "Meet the Maker" section showing the artisan's photo, bio, verification status
- SIMILAR PRODUCTS — AI-recommended similar items based on category and materials
- TRUST BADGES: Authentic, Free Shipping, Easy Returns

THE CRAFT ATLAS (/craft-atlas):
- Beautiful heritage map of India — browse crafts by state/region
- Each state card shows: representative image, craft traditions, key artisan clusters
- Click any state to dive into its specific crafts, history, and artisans (/craft-atlas/[state])
- Search by state name, craft type, or cultural keyword

CRAFT DNA (/craft-dna/[id]):
- Digital Product Passport — blockchain-style authenticity certificate
- Shows product journey: who made it, where, with what materials, quality verification
- QR code for scanning and sharing authenticity proof
- Artisan bio, location, years of experience, verification status

HERITAGE AUCTIONS (/auction):
- Live real-time bidding via WebSocket for rare/vintage handcrafted pieces
- Countdown timers, current bid display, bid history
- Place bids in real-time — highest bidder wins when timer expires
- Click any auction to see full item details (/auction/[id])

AI CONCIERGE — THE ROYAL ADVISOR (/assistants):
Two AI-powered advisors in tabs:
1. 🎁 GIFT ADVISOR: Enter occasion (Wedding, Diwali, Birthday, Raksha Bandhan, etc.), city/state, and optional preference → AI recommends perfect handcrafted gifts
   - Supported occasions: Wedding (Shaadi), Diwali, Housewarming (Griha Pravesh), Anniversary, Raksha Bandhan, Eid, Durga Puja, Baby Shower, Corporate Gift, Birthday, Retirement
2. 🏠 DECOR ADVISOR: Select room (Living Room, Bedroom, Puja Room, etc.), vibe (Royal Heritage, Modern Minimalist, Bohemian, Rustic Village, Spiritual/Zen), budget, color palette → AI suggests décor pieces

TRENDING CRAFTS (/trending):
- Most popular products ranked by views and sales
- Filterable gallery of what's hot right now

ARTISAN STORIES (/stories):
- AI-generated spotlight articles about artisans, their craft journeys, and heritage
- TWO VIEW MODES:
  1. Gallery Mode: Traditional card grid with images, excerpts, artisan names
  2. 📱 Reels Mode: Instagram-style swipeable fullscreen stories with auto-advance timer, tap navigation, progress bars
- Each story links to the featured artisan's profile
- Admin can trigger new AI story generation

MASTER ARTISANS DIRECTORY (/artisans):
- Browse all registered artisans with profiles
- See craft types, locations, products, ratings, reviews, follower counts
- Users can follow their favorite artisans

ABOUT (/about), CONTACT (/contact), HELP (/help), CAREERS (/careers), PRESS (/press-media)
POLICIES: Privacy (/privacy-policy), Terms (/terms-of-service), Shipping (/shipping-delivery), Returns (/returns-exchanges), Size Guide (/size-guide)
AUTH: Sign In (/sign-in) via Google OAuth or email. Sign Up (/sign-up) as Customer or Artisan. Onboarding (/onboarding) for profile setup.

══ LANGUAGE RULES ══
- Default to English unless user EXPLICITLY speaks another language fully or requests a switch.
- Do NOT switch languages just because accent sounds regional.
- If user speaks full Odia → reply in Odia. Full Hindi → reply in Hindi. Full Bengali → Bengali, etc.
- Supported: English, Hindi (हिंदी), Odia (ଓଡ଼ିଆ), Bengali (বাংলা), Tamil (தமிழ்), Telugu (తెలుగు).

══ TOOLS & CAPABILITIES ══
- search_products: Find/show products. Triggers: "show me", "find", "search", "dikhao", "dekhao", "browse".
- add_to_cart: Add to cart. Triggers: "buy", "add to cart", "order", "khareedna", "kiniba", "cart re dala".
- navigate_to_page: Go to any page. Triggers: "go to", "take me to", "open", "show me [page]", "le chalo".
- compare_products: Compare two products side by side.
- get_user_stats: User account stats. Triggers: "my stats", "how am I doing", "mera status", "my orders", "my sales".
- track_order: Order tracking → direct to My Orders.

══ BEHAVIOR RULES ══
- ALWAYS respect the user's role. If they are a CUSTOMER, only discuss customer features. If ARTISAN, discuss artisan features.
- When user asks "what features does this website have?" — describe features RELEVANT to their role, plus shared public features.
- When user asks about Craft DNA, explain it as a digital product passport/certificate for authenticity verification.
- When user asks about AR Preview, explain they can visualize products in their real space using their phone camera.
- When user asks about the AI Concierge/Royal Advisor, explain both Gift and Decor advisors with their input options.
- "buy/add/order [Item]" → add_to_cart tool. "show/find [X]" → search_products. "checkout/pay" → navigate /checkout.
- Keep responses concise for voice (4-5 sentences for simple questions, up to 10-12 sentences for feature explanations).
- Be warm, conversational, like a knowledgeable friend. Natural speech, not bullet points.
- If unsure what user meant, ask a clarifying question.`;
}

// ── Handle a single voice session ─────────────────────────────────────────
function handleVoiceSession(clientWs, initialRole, initialName) {
  let geminiWs = null;
  let isGeminiReady = false;
  let userEmail = null;
  let userName = null;

  const sendToClient = (obj) => {
    if (clientWs.readyState === WebSocket.OPEN) {
      clientWs.send(JSON.stringify(obj));
    }
  };

  // Open Gemini Live WebSocket
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    sendToClient({ type: 'error', message: 'Gemini API key not configured' });
    clientWs.close(1011, 'no api key');
    return;
  }

  const geminiUrl = `${LIVE_ENDPOINT}?key=${apiKey}`;
  geminiWs = new WebSocket(geminiUrl);

  geminiWs.on('open', () => {
    console.log('[VoiceLive] Connected to Gemini Live');

    // Send setup frame
    const setup = {
      setup: {
        model: `models/${LIVE_MODEL}`,
        generationConfig: {
          responseModalities: ['AUDIO'],
          speechConfig: {
            voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Aoede' } },
            languageCode: 'en-US',
          },
          temperature: 0.4,
        },
        systemInstruction: { parts: [{ text: buildSystemPrompt(initialRole, initialName) }] },
        tools: SHOPPING_TOOLS,
        // Empty object tells Gemini to return text transcripts over the websocket
        inputAudioTranscription: {},
        outputAudioTranscription: {},
      },
    };
    geminiWs.send(JSON.stringify(setup));
  });

  geminiWs.on('message', async (data) => {
    let msg;
    try { msg = JSON.parse(data.toString()); } catch { return; }

    // Setup complete
    if (msg.setupComplete) {
      isGeminiReady = true;
      console.log('[VoiceLive] Gemini Live session ready');
      sendToClient({ type: 'ready' });
      return;
    }

    const sc = msg.serverContent;
    if (sc) {
      // Input transcript (what user said)
      if (sc.inputTranscription) {
        sendToClient({
          type: 'transcript',
          side: 'user',
          text: sc.inputTranscription.text || '',
          isFinal: sc.inputTranscription.finished === true,
        });
      }

      // Output transcript (what Mitra is saying)
      if (sc.outputTranscription) {
        sendToClient({
          type: 'transcript',
          side: 'assistant',
          text: sc.outputTranscription.text || '',
          isFinal: sc.outputTranscription.finished === true,
        });
      }

      // Audio chunks → forward to browser immediately
      const parts = sc.modelTurn?.parts;
      if (parts) {
        for (const p of parts) {
          if (p.inlineData?.data && p.inlineData.mimeType?.startsWith('audio/')) {
            sendToClient({ type: 'audio', data: p.inlineData.data });
          }
        }
      }

      // Turn complete
      if (sc.turnComplete) {
        sendToClient({ type: 'turnComplete' });
      }
    }

    // Tool calls — Gemini wants to execute a shopping function
    const tc = msg.toolCall;
    if (tc && tc.functionCalls) {
      const responses = [];
      for (const fc of tc.functionCalls) {
        console.log(`[VoiceLive] Tool call: ${fc.name}`, fc.args);
        const result = fc.name === 'get_user_stats'
          ? await executeUserStats(userEmail)
          : await executeTool(fc.name, fc.args || {});

        // Forward action to frontend for visual cards
        if (fc.name === 'search_products' && result.products?.length > 0) {
          sendToClient({ type: 'action', action: 'SHOW_PRODUCTS', data: result.products });
        } else if (fc.name === 'add_to_cart' && result.success && result.product) {
          sendToClient({ type: 'action', action: 'ADD_TO_CART', data: result.product });
        } else if (fc.name === 'navigate_to_page') {
          sendToClient({ type: 'action', action: 'NAVIGATE', url: result.path });
        } else if (fc.name === 'compare_products' && result.products?.length > 0) {
          sendToClient({ type: 'action', action: 'SHOW_PRODUCTS', data: result.products });
        } else if (fc.name === 'get_user_stats') {
          sendToClient({ type: 'action', action: 'SHOW_STATS', data: result });
        }

        responses.push({
          id: fc.id,
          name: fc.name,
          response: result,
        });
      }

      // Send tool results back to Gemini so it can speak about them
      if (geminiWs.readyState === WebSocket.OPEN) {
        geminiWs.send(JSON.stringify({
          toolResponse: { functionResponses: responses },
        }));
      }
    }
  });

  geminiWs.on('error', (err) => {
    console.error('[VoiceLive] Gemini WS error:', err.message);
    sendToClient({ type: 'error', message: 'Voice connection error' });
  });

  geminiWs.on('close', (code, reason) => {
    console.log(`[VoiceLive] Gemini WS closed: ${code} ${reason}`);
    sendToClient({ type: 'ended', reason: 'gemini_closed' });
    if (clientWs.readyState === WebSocket.OPEN) clientWs.close(1000, 'session ended');
  });

  // Handle messages from browser
  clientWs.on('message', (raw) => {
    let msg;
    try { msg = JSON.parse(raw.toString()); } catch { return; }

    switch (msg.type) {
      case 'text':
        // Forward generic text to Gemini (e.g., initial greeting trigger)
        if (isGeminiReady && geminiWs?.readyState === WebSocket.OPEN) {
          geminiWs.send(JSON.stringify({
            clientContent: {
              turns: [{ role: 'user', parts: [{ text: msg.text }] }],
              turnComplete: true
            }
          }));
        }
        break;

      case 'audio':
        // Forward user audio to Gemini
        if (isGeminiReady && geminiWs?.readyState === WebSocket.OPEN) {
          geminiWs.send(JSON.stringify({
            realtimeInput: {
              audio: {
                mimeType: 'audio/pcm;rate=16000',
                data: msg.data,
              },
            },
          }));
        }
        break;

      case 'endTurn':
        // User explicitly ended their turn
        if (geminiWs?.readyState === WebSocket.OPEN) {
          geminiWs.send(JSON.stringify({
            realtimeInput: { audioStreamEnd: true },
          }));
        }
        break;

      case 'stop':
        // User stopped the session
        if (geminiWs?.readyState === WebSocket.OPEN) {
          geminiWs.close(1000, 'user stopped');
        }
        break;

      case 'identify':
        // Store user identity for personalized queries (stats, orders, etc.)
        userEmail = msg.email || null;
        userName = msg.name || null;
        console.log(`[VoiceLive] User identified: ${userName} (${userEmail})`);
        break;

      default:
        break;
    }
  });

  clientWs.on('close', () => {
    console.log('[VoiceLive] Client disconnected');
    if (geminiWs?.readyState === WebSocket.OPEN) {
      geminiWs.close(1000, 'client disconnected');
    }
  });

  clientWs.on('error', (err) => {
    console.error('[VoiceLive] Client WS error:', err.message);
  });
}

// ── Mount on HTTP server ──────────────────────────────────────────────────
function mountVoiceLive(server) {
  const wss = new WebSocket.Server({ noServer: true });

  server.on('upgrade', (req, socket, head) => {
    const url = new URL(req.url, 'http://localhost');

    // Only handle /voice path — let Socket.IO handle its own upgrades
    if (url.pathname !== '/voice') return;

    const role = url.searchParams.get('role');
    const name = url.searchParams.get('name');

    wss.handleUpgrade(req, socket, head, (ws) => {
      console.log(`[VoiceLive] New voice session connected. Role: ${role}, Name: ${name}`);
      handleVoiceSession(ws, role, name);
    });
  });

  console.log('[VoiceLive] Voice WebSocket mounted at /voice');
}

module.exports = { mountVoiceLive };

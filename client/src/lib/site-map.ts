export const SITE_MAP = [
  // ── PUBLIC PAGES ──
  { 
    name: "Home", 
    path: "/", 
    keywords: ["home", "landing", "main", "start", "welcome", "homepage", "front page"] 
  },
  { 
    name: "Royal Marketplace (Shop)", 
    path: "/shop", 
    keywords: ["shop", "store", "buy", "browse", "catalog", "products", "search", "items", "marketplace", "dukaan"] 
  },
  { 
    name: "The Craft Atlas", 
    path: "/craft-atlas", 
    keywords: ["map", "atlas", "regions", "states", "geography", "heritage", "history", "culture", "india", "craft map"] 
  },
  { 
    name: "Master Artisans Directory", 
    path: "/artisans", 
    keywords: ["artisans", "makers", "creators", "artists", "profiles", "people", "craftsmen", "kaarigar"] 
  },
  { 
    name: "Heritage Auctions", 
    path: "/auction", 
    keywords: ["auction", "bid", "bidding", "rare", "vintage", "exclusive", "royal vault", "hammer", "neelaami"] 
  },
  { 
    name: "AI Concierge (Assistants)", 
    path: "/assistants", 
    keywords: ["assistant", "concierge", "gift", "gifting", "decor", "decoration", "help me choose", "recommendation", "advisor", "suggest"] 
  },
  { 
    name: "Trending Crafts", 
    path: "/trending", 
    keywords: ["trending", "popular", "hot", "best sellers", "top", "viral", "famous", "what's hot"] 
  },
  { 
    name: "Artisan Stories", 
    path: "/stories", 
    keywords: ["stories", "story", "blog", "articles", "spotlight", "narrative", "read", "kahaani"] 
  },
  {
    name: "About Us",
    path: "/about",
    keywords: ["about", "about us", "who we are", "company", "mission", "vision", "our story", "hamare baare mein"]
  },
  {
    name: "Contact Us",
    path: "/contact",
    keywords: ["contact", "contact us", "reach us", "email", "phone", "support", "get in touch", "sampark"]
  },
  {
    name: "Help & FAQ",
    path: "/help",
    keywords: ["help", "faq", "question", "how to", "support", "guide", "assistance", "madad", "sawal"]
  },
  {
    name: "Careers",
    path: "/careers",
    keywords: ["careers", "jobs", "hiring", "work with us", "openings", "employment", "vacancy", "naukri"]
  },
  {
    name: "Press & Media",
    path: "/press-media",
    keywords: ["press", "media", "news", "coverage", "articles", "mentions", "publications"]
  },
  {
    name: "Checkout",
    path: "/checkout",
    keywords: ["checkout", "pay", "payment", "place order", "buy now", "purchase", "khareedna"]
  },
  {
    name: "Track Order",
    path: "/track-order",
    keywords: ["track", "track order", "where is my order", "delivery status", "shipping status", "order tracking", "mera order kahan hai"]
  },

  // ── INFO / POLICY PAGES ──
  {
    name: "Privacy Policy",
    path: "/privacy-policy",
    keywords: ["privacy", "privacy policy", "data", "data policy", "personal information"]
  },
  {
    name: "Terms of Service",
    path: "/terms-of-service",
    keywords: ["terms", "terms of service", "conditions", "tos", "terms and conditions", "legal"]
  },
  {
    name: "Shipping & Delivery",
    path: "/shipping-delivery",
    keywords: ["shipping", "delivery", "courier", "dispatch", "how long", "delivery time", "shipping cost"]
  },
  {
    name: "Returns & Exchanges",
    path: "/returns-exchanges",
    keywords: ["return", "returns", "exchange", "refund", "money back", "replace", "cancel order", "wapsi"]
  },
  {
    name: "Size Guide",
    path: "/size-guide",
    keywords: ["size", "size guide", "measurements", "dimensions", "fit", "sizing chart"]
  },

  // ── AUTH PAGES ──
  { 
    name: "Sign In", 
    path: "/sign-in", 
    keywords: ["login", "signin", "log in", "sign in", "access", "account"] 
  },
  { 
    name: "Sign Up", 
    path: "/sign-up", 
    keywords: ["register", "join", "signup", "sign up", "create account", "new user", "new account"] 
  },
  {
    name: "Onboarding",
    path: "/onboarding",
    keywords: ["onboarding", "setup", "get started", "welcome", "profile setup"]
  },

  // ── CUSTOMER DASHBOARD ──
  { 
    name: "Patron Dashboard", 
    path: "/customer", 
    keywords: ["my dashboard", "customer home", "overview", "patron", "customer dashboard"], 
    role: "CUSTOMER" 
  },
  { 
    name: "My Orders", 
    path: "/customer/orders", 
    keywords: ["orders", "my orders", "order history", "purchases", "shipments", "delivery", "status", "mera order"], 
    role: "CUSTOMER" 
  },
  { 
    name: "My Cart", 
    path: "/customer/cart", 
    keywords: ["cart", "bag", "basket", "my cart", "shopping bag", "mera cart"], 
    role: "CUSTOMER" 
  },
  { 
    name: "Account Settings", 
    path: "/customer/settings", 
    keywords: ["settings", "profile", "address", "phone", "edit account", "my settings", "account settings"], 
    role: "CUSTOMER" 
  },

  // ── ARTISAN DASHBOARD ──
  { 
    name: "Artisan Studio (Dashboard)", 
    path: "/artisan", 
    keywords: ["studio", "artisan dashboard", "business", "overview", "earnings", "my studio"], 
    role: "ARTISAN" 
  },
  { 
    name: "Inventory Management", 
    path: "/artisan/products", 
    keywords: ["inventory", "my products", "stock", "listings", "manage items", "product list"], 
    role: "ARTISAN" 
  },
  { 
    name: "Creation Studio (Add Product)", 
    path: "/artisan/products/add", 
    keywords: ["create", "add product", "new item", "list item", "upload", "voice listing", "sell", "add listing"], 
    role: "ARTISAN" 
  },
  {
    name: "Artisan Orders",
    path: "/artisan/orders",
    keywords: ["artisan orders", "received orders", "customer orders", "fulfillment", "pending orders"],
    role: "ARTISAN"
  },
  { 
    name: "Business Analytics", 
    path: "/artisan/analytics", 
    keywords: ["analytics", "stats", "charts", "revenue", "sales", "growth", "performance", "profit", "data"], 
    role: "ARTISAN" 
  },
  { 
    name: "The Loom Community", 
    path: "/artisan/community", 
    keywords: ["community", "forum", "chat", "social", "sabha", "discussion", "connect", "samudaay"], 
    role: "ARTISAN" 
  },
  { 
    name: "Studio Settings", 
    path: "/artisan/settings", 
    keywords: ["studio settings", "artisan profile", "bio", "location", "edit studio", "artisan settings"], 
    role: "ARTISAN" 
  },

  // ── ADMIN DASHBOARD ──
  {
    name: "Admin Dashboard",
    path: "/admin",
    keywords: ["admin", "admin dashboard", "administration", "manage site", "control panel"],
    role: "ADMIN"
  },
  {
    name: "Admin Verification",
    path: "/admin/verification",
    keywords: ["verification", "verify artisans", "pending verification", "approval", "review applications"],
    role: "ADMIN"
  },
  {
    name: "Admin Users",
    path: "/admin/users",
    keywords: ["users", "manage users", "all users", "user list", "user management"],
    role: "ADMIN"
  },
  {
    name: "Admin Analytics",
    path: "/admin/analytics",
    keywords: ["admin analytics", "platform analytics", "site stats", "platform data", "admin stats"],
    role: "ADMIN"
  },
  {
    name: "Admin Settings",
    path: "/admin/settings",
    keywords: ["admin settings", "site settings", "platform settings", "configuration"],
    role: "ADMIN"
  },
];

export const getAccessibleRoutes = (userRole: string | null) => {
  return SITE_MAP.filter(route => !route.role || route.role === userRole);
};
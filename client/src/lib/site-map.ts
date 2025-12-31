export const SITE_MAP = [
  { 
    name: "Home", 
    path: "/", 
    keywords: ["home", "landing", "main", "start", "welcome"] 
  },
  { 
    name: "Royal Marketplace (Shop)", 
    path: "/shop", 
    keywords: ["shop", "store", "buy", "browse", "catalog", "products", "search", "items"] 
  },
  { 
    name: "The Craft Atlas", 
    path: "/craft-atlas", 
    keywords: ["map", "atlas", "regions", "states", "geography", "heritage", "history", "culture", "india"] 
  },
  { 
    name: "Master Artisans Directory", 
    path: "/artisans", 
    keywords: ["artisans", "makers", "creators", "artists", "profiles", "people"] 
  },
  { 
    name: "Heritage Auctions", 
    path: "/auction", 
    keywords: ["auction", "bid", "bidding", "rare", "vintage", "exclusive", "royal vault", "hammer"] 
  },
  { 
    name: "AI Concierge (Assistants)", 
    path: "/assistants", 
    keywords: ["assistant", "concierge", "gift", "gifting", "decor", "decoration", "help", "recommendation", "advisor"] 
  },
  { 
    name: "Sign In", 
    path: "/sign-in", 
    keywords: ["login", "signin", "log in", "access"] 
  },
  { 
    name: "Sign Up", 
    path: "/sign-up", 
    keywords: ["register", "join", "signup", "create account", "new user"] 
  },

  { 
    name: "Patron Dashboard", 
    path: "/customer", 
    keywords: ["my dashboard", "customer home", "overview", "patron"], 
    role: "CUSTOMER" 
  },
  { 
    name: "My Orders", 
    path: "/customer/orders", 
    keywords: ["orders", "track", "history", "purchases", "shipments", "delivery", "status"], 
    role: "CUSTOMER" 
  },
  { 
    name: "My Cart", 
    path: "/customer/cart", 
    keywords: ["cart", "bag", "basket", "checkout", "buy now"], 
    role: "CUSTOMER" 
  },
  { 
    name: "Account Settings", 
    path: "/customer/settings", 
    keywords: ["settings", "profile", "address", "phone", "edit account"], 
    role: "CUSTOMER" 
  },

  { 
    name: "Artisan Studio (Dashboard)", 
    path: "/artisan", 
    keywords: ["studio", "dashboard", "business", "overview", "earnings"], 
    role: "ARTISAN" 
  },
  { 
    name: "Inventory Management", 
    path: "/artisan/products", 
    keywords: ["inventory", "my products", "stock", "listings", "manage items"], 
    role: "ARTISAN" 
  },
  { 
    name: "Creation Studio (Add Product)", 
    path: "/artisan/products/add", 
    keywords: ["create", "add product", "new item", "list item", "upload", "voice listing", "sell"], 
    role: "ARTISAN" 
  },
  { 
    name: "Business Analytics", 
    path: "/artisan/analytics", 
    keywords: ["analytics", "stats", "charts", "revenue", "sales", "growth", "performance", "profit"], 
    role: "ARTISAN" 
  },
  { 
    name: "The Loom Community", 
    path: "/artisan/community", 
    keywords: ["community", "forum", "chat", "social", "sabha", "discussion", "connect"], 
    role: "ARTISAN" 
  },
  { 
    name: "Studio Settings", 
    path: "/artisan/settings", 
    keywords: ["settings", "profile", "bio", "location", "edit studio"], 
    role: "ARTISAN" 
  },
];

export const getAccessibleRoutes = (userRole: string | null) => {
  return SITE_MAP.filter(route => !route.role || route.role === userRole);
};
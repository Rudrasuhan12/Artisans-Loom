export const SITE_MAP = [
  { name: "Home", path: "/", keywords: ["home", "landing", "main"] },
  { name: "Artisan Dashboard", path: "/artisan", keywords: ["dashboard", "analytics", "stats"], role: "ARTISAN" },
  { name: "My Products", path: "/artisan/products", keywords: ["inventory", "items", "my products", "stock"], role: "ARTISAN" },
  { name: "Add Product", path: "/artisan/products/add", keywords: ["create", "new product", "upload", "list item"], role: "ARTISAN" },
  { name: "Settings", path: "/artisan/settings", keywords: ["profile", "account", "edit profile"], role: "ARTISAN" },
  { name: "Assistant", path: "/assistants", keywords: ["concierge", "gift", "decor", "help", "recommendation"] },
  { name: "Sign In", path: "/sign-in", keywords: ["login", "signin"] },
  { name: "Sign Up", path: "/sign-up", keywords: ["register", "join", "signup"] },
];

export const getAccessibleRoutes = (userRole: string | null) => {
  return SITE_MAP.filter(route => !route.role || route.role === userRole);
};
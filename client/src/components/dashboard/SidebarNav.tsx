"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLanguageStore } from "@/store/useLanguageStore";
import { translations } from "@/lib/translations";
import { LayoutDashboard, ShoppingBag, BarChart3, Settings, Users, Home, Package, ShoppingCart } from "lucide-react";

export default function SidebarNav({ role }: { role: string }) {
  const pathname = usePathname();
  const { language } = useLanguageStore();
  const t = translations[language] || translations['en'];

  let links = [];

  if (role === "ARTISAN") {
    links = [
      { name: t.dashboard, href: "/artisan", icon: LayoutDashboard },
      { name: t.products, href: "/artisan/products", icon: ShoppingBag },
      { name: t.analytics, href: "/artisan/analytics", icon: BarChart3 },
      { name: "Community", href: "/artisan/community", icon: Users },
      { name: t.settings, href: "/artisan/settings", icon: Settings },
    ];
  } else {
    links = [
      { name: "Home", href: "/customer", icon: Home },
      { name: "My Orders", href: "/customer/orders", icon: Package },
      { name: "My Cart", href: "/customer/cart", icon: ShoppingCart },
      { name: t.settings, href: "/customer/settings", icon: Settings },
    ];
  }

  return (
    <nav className="flex-1 px-4 py-8 space-y-3">
      {links.map((link) => {
        const isActive = pathname === link.href;
        return (
          <Link 
            key={link.href} 
            href={link.href}
            className={`flex items-center gap-4 rounded-xl px-4 py-3.5 font-medium transition-all duration-300 relative group overflow-hidden ${
              isActive
                ? "bg-[#4A3526] text-white shadow-lg border border-[#D4AF37]/20" 
                : "text-[#E5DCCA]/70 hover:bg-[#3E2A1C] hover:text-white"
            }`}
          >
            <div className={`w-9 h-9 rounded-full flex items-center justify-center transition-all duration-300 ${
              isActive ? 'text-[#D4AF37]' : 'group-hover:text-[#D4AF37]'
            }`}>
              <link.icon className="h-5 w-5" />
            </div>
            <span>{link.name}</span>
            {isActive && (
              <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-[#D4AF37] rounded-r-full"></div>
            )}
          </Link>
        )
      })}
    </nav>
  );
}
"use client";

import { UserButton } from "@clerk/nextjs";
import Link from "next/link";
import { 
  LayoutDashboard, 
  ShoppingBag, 
  BarChart3, 
  Settings, 
  Users, 
  Package,
  Home,
  ShoppingCart
} from "lucide-react";
import { usePathname } from "next/navigation";
import UniversalBackButton from "@/components/ui/BackButton";
import Image from "next/image";
import { useLanguageStore } from "@/store/useLanguageStore";
import { useUserStore } from "@/store/useUserStore"; // [NEW] Access the role
import { translations } from "@/lib/translations";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { language } = useLanguageStore();
  const { role } = useUserStore(); // [NEW] Retrieve user role
  
  const t = translations[language] || translations['en'];

  // [FIXED]: Role-aware navigation links
  const sidebarLinks = role === "ARTISAN" ? [
    { name: t.nav?.dashboard || "Dashboard", href: "/artisan", icon: LayoutDashboard },
    { name: "My Masterpieces", href: "/artisan/products", icon: ShoppingBag },
    { name: "My Purchases", href: "/artisan/orders", icon: Package },
    { name: t.analytics || "Analytics", href: "/artisan/analytics", icon: BarChart3 },
    { name: t.community || "Community", href: "/artisan/community", icon: Users },
    { name: t.settings || "Settings", href: "/artisan/settings", icon: Settings },
  ] : [
    { name: "Home", href: "/customer", icon: Home },
    { name: "My Orders", href: "/customer/orders", icon: Package },
    { name: "My Cart", href: "/customer/cart", icon: ShoppingCart },
    { name: t.settings || "Settings", href: "/customer/settings", icon: Settings },
  ];

  return (
    <div className="flex min-h-screen bg-[#FDFBF7]">
      <aside className="w-64 shrink-0 bg-[#2C1810] flex flex-col text-[#FDFBF7]">
        <div className="h-24 flex items-center px-6 border-b border-[#D4AF37]/20">
           <Link href="/" className="flex items-center gap-3">
             <div className="relative w-12 h-12 rounded-full border-2 border-[#D4AF37] bg-white overflow-hidden shrink-0">
                <Image src="/logo.png" alt="Logo" fill className="object-cover" />
             </div>
             <span className="font-serif text-xl font-bold tracking-tight">Artisan's Loom</span>
           </Link>
        </div>
        
        <nav className="flex-1 px-4 py-8 space-y-3">
          {sidebarLinks.map((link) => {
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

        <div className="mt-auto p-4 border-t border-[#D4AF37]/20 bg-black/20">
          <div className="flex items-center gap-3">
             <UserButton afterSignOutUrl="/" appearance={{ elements: { avatarBox: "w-10 h-10" } }} />
             <div className="flex flex-col">
                <p className="font-medium text-sm text-[#FDFBF7]">{t.yourProfile || "My Profile"}</p>
                <p className="text-xs text-[#8C7B70]">
                   {role === "ARTISAN" ? "Artisan Account" : "Customer Account"}
                </p>
             </div>
          </div>
        </div>
      </aside>

      <main className="flex-1 p-8 lg:p-12 overflow-y-auto">
        {children}
        <UniversalBackButton position="top-left" />
      </main>
    </div>
  );
}
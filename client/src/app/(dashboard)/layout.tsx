
"use client";
import React from "react";

import { signOut, useSession } from "next-auth/react";
import { LogOut } from "lucide-react";
import Link from "next/link";
import { 
  LayoutDashboard, 
  ShoppingBag, 
  BarChart3, 
  Settings, 
  Users, 
  Package,
  Home,
  ShoppingCart,
  ShieldCheck,
  UserCog
} from "lucide-react";
import { usePathname } from "next/navigation";
import UniversalBackButton from "@/components/ui/BackButton";
import Image from "next/image";
import { useHydratedLanguage } from "@/store/useLanguageStore";
import { useUserStore } from "@/store/useUserStore"; // [NEW] Access the role
import { translations } from "@/lib/translations";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const language = useHydratedLanguage();
  const { role, setRole } = useUserStore();
  const { data: session } = useSession();

  // Debug log for session and role
  console.log('DashboardLayout session:', session);
  console.log('DashboardLayout role:', role);

  // Sync Zustand role with session role
  // Sync Zustand role with session role and force session refresh
  React.useEffect(() => {
    if (session?.user && (session.user as any).role) {
      setRole((session.user as any).role);
    } else {
      setRole("");
    }
  }, [session, setRole]);

  // Force session refresh on mount and after signOut
  const { update } = useSession();
  React.useEffect(() => {
    update();
  }, []);

  const userName = session?.user?.name || "User";
  const userEmail = session?.user?.email || "";
  const userInitial = userName.charAt(0).toUpperCase();

  const t = translations[language] || translations['en'];

  // [FIXED]: Role-aware navigation links
  const sidebarLinks = role === "ADMIN" ? [
    { name: "Admin Dashboard", href: "/admin", icon: LayoutDashboard },
    { name: "Verification Requests", href: "/admin/verification", icon: ShieldCheck },
    { name: "Manage Products", href: "/admin/products", icon: ShoppingBag },
    { name: "Manage Users", href: "/admin/users", icon: UserCog },
    { name: t.analytics || "Analytics", href: "/admin/analytics", icon: BarChart3 },
    { name: t.settings || "Settings", href: "/admin/settings", icon: Settings },
  ] : role === "ARTISAN" ? [
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
             <div className="w-10 h-10 rounded-full bg-[#D4AF37] flex items-center justify-center text-[#2C1810] font-bold text-lg shrink-0">
               {userInitial}
             </div>
             <div className="flex-1 min-w-0">
                <p className="font-medium text-sm text-[#FDFBF7] truncate">{userName}</p>
                <p className="text-xs text-[#8C7B70] truncate">{userEmail}</p>
             </div>
          </div>
          <button
            onClick={async () => {
              setRole("");
              await signOut({ callbackUrl: "/sign-in", redirect: true });
              update();
            }}
            className="mt-3 w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium text-[#E5DCCA]/80 hover:bg-[#3E2A1C] hover:text-white border border-[#D4AF37]/10 transition-all duration-200"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      </aside>

      <main className="flex-1 p-8 lg:p-12 overflow-y-auto">
        {children}
        <UniversalBackButton position="top-left" />
      </main>
    </div>
  );
}
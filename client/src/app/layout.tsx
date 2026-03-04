import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import "./globals.css";
import { LayoutClient } from "./layout-client";
import CraftMitra from "@/components/mitra/CraftMitra";
import { Toaster } from "@/components/ui/sonner";
import CartDrawer from "@/components/cart/CartDrawer";
import { SessionProvider } from "next-auth/react";

export const dynamic = 'force-dynamic'; 

const playfair = Playfair_Display({ 
  subsets: ["latin"], 
  variable: "--font-serif", 
  weight: ["400", "600", "700"] 
});

const inter = Inter({ 
  subsets: ["latin"], 
  variable: "--font-sans" 
});

export const metadata: Metadata = {
  title: "Artisan's Loom",
  description: "Connect with India's finest artisans",
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${playfair.variable} ${inter.variable} antialiased bg-[#FDFBF7]`}>
        <SessionProvider>
          {children}
          
          <LayoutClient />
          <CartDrawer /> 
          
          <CraftMitra />

          <Toaster position="bottom-right" richColors closeButton />
        </SessionProvider>
      </body>
    </html>
  );
}
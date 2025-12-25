import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import { syncUser } from "@/utils/auth-sync";
import "./globals.css";
import { LayoutClient } from "./layout-client";

const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-serif", weight: ["400", "600", "700"] });
const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: "Artisan's Loom",
  description: "Connect with India's finest artisans",
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  // Bridge Clerk and Prisma - handle errors gracefully
  try {
    await syncUser();
  } catch (error) {
    console.error('Error in syncUser during layout rendering:', error);
  }

  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <body className={`${playfair.variable} ${inter.variable} antialiased`}>
          {children}
          <LayoutClient />
        </body>
      </html>
    </ClerkProvider>
  );
}


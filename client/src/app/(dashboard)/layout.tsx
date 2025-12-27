import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { UserButton } from "@clerk/nextjs";
import Link from "next/link";
import Image from "next/image";
import BackButton from "@/components/dashboard/BackButton";
import SidebarNav from "@/components/dashboard/SidebarNav";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { userId } = await auth();
  const user = userId ? await prisma.user.findUnique({ where: { clerkId: userId } }) : null;
  const userRole = user?.role || "CUSTOMER"; 
  const displayRole = userRole === "ARTISAN" ? "Artisan Studio" : "Patron Account";

  return (
    <div className="flex min-h-screen bg-[#FDFBF7]">

      <aside className="w-64 shrink-0 bg-[#2C1810] flex flex-col text-[#FDFBF7]">
        
        <div className="h-24 flex items-center px-6 border-b border-[#D4AF37]/20">
           <Link href="/" className="flex items-center gap-3">
             <div className="relative w-12 h-12 rounded-full border-2 border-[#D4AF37] bg-white overflow-hidden shrink-0">
                <Image 
                  src="/logo.png" 
                  alt="Logo" 
                  fill 
                  className="object-cover" 
                />
             </div>
             <span className="font-serif text-xl font-bold text-[#FDFBF7] tracking-tight">
               Artisan's Loom
             </span>
           </Link>
        </div>
        
        <SidebarNav role={userRole} />

        <div className="mt-auto p-4 border-t border-[#D4AF37]/20 bg-black/20">
          <div className="flex items-center gap-3">
             <div className="relative w-10 h-10 rounded-full border border-[#D4AF37]/50 flex items-center justify-center bg-white overflow-hidden shrink-0">
                <UserButton afterSignOutUrl="/" appearance={{ elements: { avatarBox: "w-full h-full" } }} />
             </div>
             
             <div className="flex flex-col">
                <p className="font-medium text-sm text-[#FDFBF7]">My Profile</p>
                <p className="text-xs text-[#8C7B70]">{displayRole}</p>
             </div>
          </div>
        </div>
      </aside>

      <main className="flex-1 p-8 lg:p-12 overflow-y-auto">
        {children}
        <BackButton />
      </main>
    </div>
  );
}
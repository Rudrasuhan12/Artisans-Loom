import { currentUser } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { Package, IndianRupee, Users } from "lucide-react";
import { RoyalDivider } from "@/components/ui/royal-divider";

export default async function ArtisanDashboardPage() {
  const user = await currentUser();
  const artisanName = user?.firstName || "Artisan";

  return (
    <div className="space-y-12">
      <div>
        <h1 className="text-4xl lg:text-5xl font-serif font-bold bg-clip-text text-transparent bg-linear-to-r from-[#B8860B] via-[#FFD700] to-[#B8860B] animate-shine">
          Welcome back, {artisanName}!
        </h1>
        <p className="text-lg text-[#8C7B70] mt-2">
          Here’s a summary of your studio's performance.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {[
          { title: "Total Revenue", value: "₹45,231", change: "+20.1%", icon: IndianRupee },
          { title: "Total Sales", value: "+12,234", change: "+180.1%", icon: Users },
          { title: "Active Products", value: "57", change: "+2 since last week", icon: Package },
        ].map((stat, i) => (
          <div key={i} className="group relative rounded-2xl p-0.75 bg-linear-to-b from-[#F3E5AB] via-[#D4AF37] to-[#8B6508] shadow-lg hover:shadow-[#D4AF37]/40 transition-shadow duration-500">

            <div className="relative h-full bg-[#2C1810] rounded-[14px] p-6 text-white overflow-hidden">
               
               <div className="absolute -top-1/2 -left-1/2 w-[200%] h-[200%] bg-[radial-gradient(circle_at_center,rgba(212,175,55,0.1)_0%,transparent_50%)] opacity-0 group-hover:opacity-100 transition-opacity duration-700 animate-spin-slow"></div>
               <div className="absolute top-3 left-3 w-6 h-6 border-t-2 border-l-2 border-[#D4AF37]/50 rounded-tl-lg group-hover:border-[#D4AF37] transition-colors"></div>
               <div className="absolute top-3 right-3 w-6 h-6 border-t-2 border-r-2 border-[#D4AF37]/50 rounded-tr-lg group-hover:border-[#D4AF37] transition-colors"></div>
               <div className="absolute bottom-3 left-3 w-6 h-6 border-b-2 border-l-2 border-[#D4AF37]/50 rounded-bl-lg group-hover:border-[#D4AF37] transition-colors"></div>

               <div className="absolute bottom-3 right-3 w-6 h-6 border-b-2 border-r-2 border-[#D4AF37]/50 rounded-br-lg group-hover:border-[#D4AF37] transition-colors"></div>

               <div className="relative z-10">
                 <div className="flex items-center justify-between text-sm font-medium text-[#8C7B70]">
                   {stat.title}
                   <stat.icon className="w-5 h-5 text-[#D4AF37]" />
                 </div>
                 <p className="mt-4 text-4xl font-bold font-serif text-[#FDFBF7] drop-shadow-md">{stat.value}</p>
                 <p className="text-sm text-green-500 mt-2">{stat.change}</p>
               </div>
            </div>
          </div>
        ))}
      </div>

      <div className="pt-8">
         <h2 className="text-2xl font-serif font-bold text-[#4A3526]">
           Recent Orders
         </h2>
         <div className="scale-75 -ml-12"><RoyalDivider /></div>

         <div className="relative p-0.5 rounded-xl bg-linear-to-b from-[#F3E5AB]/50 to-transparent">
            <div className="relative bg-[#FFFBF5] rounded-[10px] border border-[#D4AF37]/20 shadow-inner">
              <div className="p-12 text-center text-[#8C7B70]">
                <svg className="w-16 h-16 mx-auto text-[#D4AF37]/40 mb-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                   <path d="M4 6h16M4 12h16M4 18h16M6 4v16M12 4v16M18 4v16" />
                   <path d="M8 9l-2 3 2 3" />
                   <path d="M16 9l2 3 -2 3" />
                </svg>
                <p className="font-medium">No recent orders to display.</p>
                <p className="text-sm">New orders will appear here as they come in.</p>
              </div>
              
              <div className="absolute top-3 left-3 w-5 h-5 border-t border-l border-[#D4AF37]/50"></div>
              <div className="absolute top-3 right-3 w-5 h-5 border-t border-r border-[#D4AF37]/50"></div>
              <div className="absolute bottom-3 left-3 w-5 h-5 border-b border-l border-[#D4AF37]/50"></div>
              <div className="absolute bottom-3 right-3 w-5 h-5 border-b border-r border-[#D4AF37]/50"></div>
            </div>
         </div>
      </div>

    </div>
  );
}
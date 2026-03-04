import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { Send, Sparkles } from "lucide-react";
import { createPostAction } from "@/app/actions/forum";
import PostCard from "@/components/community/PostCard";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

export default async function CommunityPage() {
  const session = await auth();
  
  const currentUser = session?.user?.id ? await prisma.user.findUnique({ where: { id: session.user.id } }) : null;
  const currentDbUserId = currentUser?.id || "";

  const userInclude = { include: { profile: true } };
  const posts = await prisma.forumPost.findMany({
    where: { parentId: null },
    include: {
      user: userInclude,
      likes: true,
      children: { 
        include: { 
          user: userInclude,
          likes: true,
          children: { 
            include: {
              user: userInclude,
              likes: true,
              children: { 
                include: {
                   user: userInclude,
                   likes: true,
                   children: { 
                      include: { user: userInclude, likes: true }
                   }
                }
              }
            }
          }
        },
        orderBy: { createdAt: 'asc' } 
      }, 
    },
    orderBy: { createdAt: 'desc' }
  });

  return (
    <div className="max-w-2xl mx-auto min-h-screen pb-20">
      
      <div className="mb-8">
        <h1 className="text-3xl font-serif font-bold text-[#4A3526]">The Loom Community <span className="text-[#8C7B70] text-lg font-sans font-normal">(Artisan Sabha)</span></h1>
        <p className="text-[#8C7B70]">Connect with fellow artisans. Tag <span className="text-[#D97742] font-bold">@Mitra</span> for AI help.</p>
      </div>

      <div className="bg-white rounded-2xl p-6 shadow-lg border border-[#E5DCCA] mb-8 relative overflow-hidden group">
         <div className="absolute top-0 left-0 w-full h-1 bg-linear-to-r from-[#2F334F] via-[#D4AF37] to-[#2F334F]"></div>
         
         <form action={createPostAction} className="flex gap-4">
            <div className="w-12 h-12 rounded-full bg-[#FFF5E1] flex items-center justify-center border border-[#D4AF37]/30 shrink-0">
               <Sparkles className="w-6 h-6 text-[#D4AF37]" />
            </div>
            <div className="flex-1">
               <Textarea 
                 name="content"
                 placeholder="Share your craft, ask a question, or tag @Mitra..."
                 className="min-h-25 border-none bg-transparent resize-none text-lg placeholder:text-[#8C7B70]/50 focus-visible:ring-0 p-0"
                 required
               />
               <div className="flex justify-between items-center mt-4 border-t border-[#E5DCCA] pt-4">
                  <div className="text-xs text-[#D97742] font-medium flex items-center gap-1">
                     <Sparkles className="w-3 h-3" /> AI Reply Active
                  </div>
                  <Button type="submit" className="rounded-full bg-[#2F334F] hover:bg-[#1E2135] text-white px-6">
                     Post <Send className="w-4 h-4 ml-2" />
                  </Button>
               </div>
            </div>
         </form>
      </div>

      <div className="space-y-6">
         {posts.map((post) => (
            <PostCard key={post.id} post={post} currentUserId={currentDbUserId} />
         ))}
      </div>

    </div>
  );
}
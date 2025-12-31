"use client";

import { useState } from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Heart, MessageCircle, Trash2, Edit2, Check, X, CornerDownRight, Sparkles, User, Reply } from "lucide-react";
import { toggleLikeAction, deletePostAction, createPostAction, editPostAction } from "@/app/actions/forum";
import { formatDistanceToNow } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { toast } from "sonner";
import PremiumAlert from "@/components/ui/premium-alert";

const renderContent = (content: string) => {
  if (!content) return "";
  return content.split(" ").map((word, i) => {
    if (word.startsWith("@") && word.length > 1) {
      return <span key={i} className="text-[#D97742] font-bold cursor-pointer hover:underline">{word} </span>;
    }
    return word + " ";
  });
};

export default function PostCard({ post, currentUserId, level = 0 }: { post: any, currentUserId: string, level?: number }) {
  const [showThread, setShowThread] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(post.content);
  const [commentText, setCommentText] = useState("");
  const [isPostingComment, setIsPostingComment] = useState(false);
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const likes = post?.likes || [];
  const replies = post?.children || [];
  const [optimisticLikes, setOptimisticLikes] = useState(likes.length);
  const [isLiked, setIsLiked] = useState(likes.some((l: any) => l.userId === currentUserId));

  const isMitra = post.tags && post.tags.includes("AI_REPLY");
  const createdTime = new Date(post.createdAt).getTime();
  const updatedTime = new Date(post.updatedAt).getTime();
  const isEdited = (updatedTime - createdTime) > 10000; 

  const authorName = isMitra ? "Craft Mitra" : (post.user?.name || "Artisan");
  const authorInitial = isMitra ? "M" : (authorName[0] || "A");

  const handleLike = async () => {
    setIsLiked(!isLiked);
    setOptimisticLikes((prev: number) => isLiked ? prev - 1 : prev + 1);
    await toggleLikeAction(post.id);
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    await deletePostAction(post.id);
    setIsDeleting(false);
    setShowDeleteAlert(false);
    toast.success("Post removed from the Loom.");
  };

  const handleEdit = async () => {
    if (editContent.trim() === post.content) {
      setIsEditing(false);
      return;
    }
    await editPostAction(post.id, editContent);
    setIsEditing(false);
    toast.success("Post updated successfully.");
  };

  const handleCommentSubmit = async () => {
    if (!commentText.trim()) return;
    setIsPostingComment(true);
    
    const formData = new FormData();
    formData.append("content", commentText);
    formData.append("parentId", post.id);

    await createPostAction(formData);
    
    setCommentText("");
    setIsPostingComment(false);
    toast.success("Reply posted!");
    
    if (!showThread) setShowThread(true);
  };

  const indentClass = level > 0 && level < 4 ? "border-l-2 border-[#D4AF37]/20 ml-4 pl-4" : level >= 4 ? "ml-2 pl-2 border-l border-[#D4AF37]/10" : "";

  return (
    <>
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`bg-[#FFFBF5] rounded-xl p-5 border border-[#E5DCCA] shadow-sm hover:shadow-md transition-all relative group ${indentClass} mb-4`}
    >
       <div className="flex justify-between items-start mb-3">
          <Link href={isMitra ? "#" : `/profile/${post.userId}`} className="flex items-center gap-3 hover:opacity-80 transition-opacity">
            <Avatar className={`h-10 w-10 border ${isMitra ? 'border-[#D4AF37] ring-2 ring-[#D4AF37]/20' : 'border-[#D4AF37]/30'}`}>
               <AvatarFallback className={`${isMitra ? 'bg-[#2F334F] text-[#D4AF37]' : 'bg-[#D4AF37] text-white'} font-bold flex items-center justify-center`}>
                 {isMitra ? <Sparkles className="w-5 h-5" /> : authorInitial}
               </AvatarFallback>
            </Avatar>
            <div>
               <div className="flex items-center gap-2">
                 <h4 className="font-bold text-[#4A3526] text-sm">{authorName}</h4>
                 {isMitra && (
                    <span className="bg-[#2F334F] text-[#D4AF37] text-[10px] px-2 py-0.5 rounded-full flex items-center gap-1 shadow-sm">
                      ✨ AI Guide
                    </span>
                 )}
               </div>
               <p className="text-[10px] text-[#8C7B70] flex items-center gap-1">
                  {post.createdAt ? formatDistanceToNow(new Date(post.createdAt)) : "Just now"} ago
                  {isEdited && <span className="italic opacity-70 ml-1">• Edited</span>}
               </p>
            </div>
          </Link>

          {currentUserId === post.userId && !isMitra && (
            <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
               <button onClick={() => setIsEditing(!isEditing)} className="p-1.5 rounded-full hover:bg-[#E5DCCA] text-[#8C7B70] hover:text-[#2F334F] transition-colors" title="Edit">
                  <Edit2 className="w-3.5 h-3.5" />
               </button>
               <button onClick={() => setShowDeleteAlert(true)} className="p-1.5 rounded-full hover:bg-red-50 text-[#8C7B70] hover:text-red-500 transition-colors" title="Delete">
                  <Trash2 className="w-3.5 h-3.5" />
               </button>
            </div>
          )}
       </div>

       {isEditing ? (
          <div className="mb-4 animate-in fade-in zoom-in-95 duration-200">
             <Textarea 
               value={editContent} 
               onChange={(e) => setEditContent(e.target.value)} 
               className="bg-white border-[#D4AF37] min-h-20 text-base focus-visible:ring-[#D4AF37]"
             />
             <div className="flex justify-end gap-2 mt-2">
                <Button size="sm" variant="ghost" onClick={() => setIsEditing(false)} className="h-8 w-8 p-0 rounded-full"><X className="w-4 h-4" /></Button>
                <Button size="sm" onClick={handleEdit} className="bg-[#2F334F] text-white h-8 w-8 p-0 rounded-full hover:bg-[#1E2135]"><Check className="w-4 h-4" /></Button>
             </div>
          </div>
       ) : (
          <div className="text-[#5D4037] text-base leading-relaxed mb-4 whitespace-pre-wrap pl-13">
             {renderContent(post.content)}
          </div>
       )}

       <div className="flex items-center gap-6 border-t border-[#E5DCCA]/50 pt-3 pl-13">
          <button onClick={handleLike} className={`flex items-center gap-2 transition-colors group ${isLiked ? 'text-red-500' : 'text-[#8C7B70] hover:text-red-500'}`}>
             <Heart className={`w-4 h-4 ${isLiked ? 'fill-red-500' : 'group-hover:scale-110 transition-transform'}`} />
             <span className="text-xs font-medium">{optimisticLikes}</span>
          </button>
          
          <button 
             onClick={() => setShowThread(!showThread)} 
             className={`flex items-center gap-2 transition-colors group ${showThread ? 'text-[#2F334F]' : 'text-[#8C7B70] hover:text-[#2F334F]'}`}
          >
             <MessageCircle className="w-4 h-4 group-hover:scale-110 transition-transform" />
             <span className="text-xs font-medium">{replies.length}</span>
             <span className="text-[10px] font-bold ml-1 hidden group-hover:inline-block">Reply</span>
          </button>
       </div>

       <AnimatePresence>
         {showThread && (
            <motion.div 
               initial={{ height: 0, opacity: 0 }} 
               animate={{ height: "auto", opacity: 1 }} 
               exit={{ height: 0, opacity: 0 }}
               className="overflow-hidden"
            >
               <div className="flex gap-3 mt-4 pl-13 pb-4">
                  <div className="flex-1 relative">
                     <Textarea 
                       value={commentText}
                       onChange={(e) => setCommentText(e.target.value)}
                       placeholder={`Reply to ${authorName}...`} 
                       className="min-h-12.5 bg-white border-[#E5DCCA] text-sm focus-visible:ring-[#D4AF37] pr-12 resize-none rounded-xl"
                     />
                     <div className="absolute bottom-2 right-2">
                        <Button 
                          size="icon" 
                          onClick={handleCommentSubmit} 
                          disabled={isPostingComment || !commentText} 
                          className="h-8 w-8 bg-[#2F334F] text-white hover:bg-[#1E2135] rounded-full"
                        >
                           {isPostingComment ? <Sparkles className="w-4 h-4 animate-spin"/> : <Reply className="w-4 h-4"/>}
                        </Button>
                     </div>
                  </div>
               </div>

               <div className="mt-2 space-y-2">
                  {replies.map((childPost: any) => (
                      <PostCard 
                        key={childPost.id} 
                        post={childPost} 
                        currentUserId={currentUserId} 
                        level={level + 1}
                      />
                  ))}
               </div>
            </motion.div>
         )}
       </AnimatePresence>

    </motion.div>

    <PremiumAlert 
       isOpen={showDeleteAlert}
       onClose={() => setShowDeleteAlert(false)}
       onConfirm={handleDelete}
       isLoading={isDeleting}
       title="Delete Post?"
       description="This action cannot be undone."
    />
    </>
  );
}
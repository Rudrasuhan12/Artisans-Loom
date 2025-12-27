"use client";

import { useState } from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Heart, MessageCircle, Trash2, Edit2, Check, X, CornerDownRight, Sparkles } from "lucide-react";
import { toggleLikeAction, deletePostAction, createPostAction, editPostAction } from "@/app/actions/forum";
import { formatDistanceToNow } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { toast } from "sonner";
import PremiumAlert from "@/components/ui/premium-alert";

const renderContent = (content: string) => {
  if (!content) return "";
  return content.split(" ").map((word, i) => {
    if (word.startsWith("@")) {
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
    setShowThread(true);
  };

  const indentClass = level > 0 && level < 4 ? "border-l-2 border-[#D4AF37]/20 ml-4 pl-4" : level >= 4 ? "ml-2 pl-2 border-l border-[#D4AF37]/10" : "";

  return (
    <>
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-[#FFFBF5] rounded-xl p-5 border border-[#E5DCCA] shadow-sm hover:shadow-md transition-all relative group ${indentClass} mb-4`}
    >
       <div className="flex justify-between items-start mb-3">
          <Link href={isMitra ? "#" : `/profile/${post.userId}`} className="flex items-center gap-3 hover:opacity-80 transition-opacity">
            <Avatar className={`h-10 w-10 border ${isMitra ? 'border-[#D4AF37] ring-2 ring-[#D4AF37]/20' : 'border-[#D4AF37]/30'}`}>
               <AvatarFallback className={`${isMitra ? 'bg-[#2F334F] text-[#D4AF37]' : 'bg-[#D4AF37] text-white'} font-bold`}>
                 {isMitra ? <Sparkles className="w-5 h-5" /> : authorInitial}
               </AvatarFallback>
            </Avatar>
            <div>
               <div className="flex items-center gap-2">
                 <h4 className="font-bold text-[#4A3526] text-sm">{authorName}</h4>
                 {isMitra && (
                    <span className="bg-[#2F334F] text-[#D4AF37] text-[10px] px-2 py-0.5 rounded-full flex items-center gap-1">
                      ✨ AI Guide
                    </span>
                 )}
               </div>
               <p className="text-[10px] text-[#8C7B70]">
                  {post.createdAt ? formatDistanceToNow(new Date(post.createdAt)) : "Just now"} ago
                  {isEdited && <span className="ml-1 italic opacity-70">(edited)</span>}
               </p>
            </div>
          </Link>

          {currentUserId === post.userId && !isMitra && (
            <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
               <button onClick={() => setIsEditing(!isEditing)} className="text-[#8C7B70] hover:text-[#2F334F]">
                  <Edit2 className="w-4 h-4" />
               </button>
               <button onClick={() => setShowDeleteAlert(true)} className="text-[#8C7B70] hover:text-red-500">
                  <Trash2 className="w-4 h-4" />
               </button>
            </div>
          )}
       </div>

       {isEditing ? (
          <div className="mb-4">
             <Textarea 
               value={editContent} 
               onChange={(e) => setEditContent(e.target.value)} 
               className="bg-white border-[#D4AF37] min-h-20"
             />
             <div className="flex justify-end gap-2 mt-2">
                <Button size="sm" variant="ghost" onClick={() => setIsEditing(false)}><X className="w-4 h-4" /></Button>
                <Button size="sm" onClick={handleEdit} className="bg-[#2F334F] text-white"><Check className="w-4 h-4" /></Button>
             </div>
          </div>
       ) : (
          <p className="text-[#5D4037] text-base leading-relaxed mb-4 whitespace-pre-wrap pl-2">
             {renderContent(post.content)}
          </p>
       )}

       <div className="flex items-center gap-6 border-t border-[#E5DCCA]/50 pt-3 pl-2">
          <button onClick={handleLike} className={`flex items-center gap-2 transition-colors ${isLiked ? 'text-red-500' : 'text-[#8C7B70] hover:text-red-500'}`}>
             <Heart className={`w-5 h-5 ${isLiked ? 'fill-red-500' : ''}`} />
             <span className="text-sm font-medium">{optimisticLikes}</span>
          </button>
          
          <button 
             onClick={() => setShowThread(!showThread)} 
             className={`flex items-center gap-2 transition-colors ${showThread ? 'text-[#2F334F]' : 'text-[#8C7B70] hover:text-[#2F334F]'}`}
          >
             <MessageCircle className="w-5 h-5" />
             <span className="text-sm font-medium">{replies.length}</span>
             {replies.length > 0 && !showThread && (
               <span className="text-xs text-[#D97742] ml-1">View Replies</span>
             )}
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
               <div className="flex gap-3 mt-4 pl-2 pr-2 pb-4 border-b border-[#E5DCCA]/50">
                  <div className="h-8 w-8 rounded-full bg-[#E5DCCA] shrink-0" />
                  <div className="flex-1 relative">
                     <Textarea 
                       value={commentText}
                       onChange={(e) => setCommentText(e.target.value)}
                       placeholder={`Reply to ${authorName}...`} 
                       className="min-h-15 bg-white border-[#E5DCCA] text-sm focus-visible:ring-[#D4AF37]"
                     />
                     <div className="flex justify-end mt-2">
                        <Button size="sm" onClick={handleCommentSubmit} disabled={isPostingComment || !commentText} className="bg-[#2F334F] text-white h-8 text-xs">
                           {isPostingComment ? "Replying..." : "Post Reply"}
                        </Button>
                     </div>
                  </div>
               </div>

               <div className="mt-4 pl-2 space-y-4">
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
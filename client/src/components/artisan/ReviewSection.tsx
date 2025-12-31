"use client";

import { useState } from "react";
import { Star, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { addReviewAction } from "@/app/actions/reviews";
import { toast } from "sonner";
import { formatDistanceToNow } from "date-fns";

export default function ReviewSection({ artisanId, reviews, currentUser }: any) {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (rating === 0) {
      toast.error("Please select a star rating.");
      return;
    }
    if (!comment.trim()) {
      toast.error("Please write a review.");
      return;
    }

    setIsSubmitting(true);
    const formData = new FormData();
    formData.append("artisanId", artisanId);
    formData.append("rating", rating.toString());
    formData.append("comment", comment);

    try {
      await addReviewAction(formData);
      toast.success("Review posted!");
      setComment("");
      setRating(0);
    } catch (error) {
      toast.error("Failed to post review.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-8">
      <h3 className="text-2xl font-serif font-bold text-[#2C1810]">
        Patron Reviews <span className="text-[#8C7B70] text-lg font-sans font-normal">({reviews.length})</span>
      </h3>

      {currentUser && currentUser.id !== artisanId && (
        <div className="bg-[#FFFBF5] p-6 rounded-2xl border border-[#E5DCCA] shadow-sm">
          <h4 className="font-bold text-[#4A3526] mb-3">Rate this Studio</h4>
          
          <div className="flex gap-1 mb-4">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                className="transition-transform hover:scale-110 focus:outline-none"
                onClick={() => setRating(star)}
                onMouseEnter={() => setHover(star)}
                onMouseLeave={() => setHover(rating)}
              >
                <Star
                  className={`w-6 h-6 ${
                    star <= (hover || rating) ? "fill-[#D4AF37] text-[#D4AF37]" : "text-[#E5DCCA]"
                  }`}
                />
              </button>
            ))}
          </div>

          <Textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Share your experience with this artisan's work..."
            className="bg-white border-[#E5DCCA] mb-4 min-h-25"
          />

          <div className="flex justify-end">
            <Button 
              onClick={handleSubmit} 
              disabled={isSubmitting}
              className="bg-[#2F334F] text-white hover:bg-[#1E2135]"
            >
              {isSubmitting ? "Posting..." : "Post Review"}
            </Button>
          </div>
        </div>
      )}

      <div className="space-y-6">
        {reviews.length === 0 ? (
          <p className="text-[#8C7B70] italic">No reviews yet. Be the first to review!</p>
        ) : (
          reviews.map((review: any) => (
            <div key={review.id} className="border-b border-[#E5DCCA] pb-6 last:border-0">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  <Avatar className="w-8 h-8 border border-[#E5DCCA]">
                    <AvatarFallback className="bg-[#F3E5AB] text-[#4A3526] text-xs">
                      {review.author.name?.[0] || "U"}
                    </AvatarFallback>
                  </Avatar>
                  <p className="font-bold text-[#4A3526] text-sm">{review.author.name}</p>
                </div>
                <span className="text-xs text-[#8C7B70]">{formatDistanceToNow(new Date(review.createdAt))} ago</span>
              </div>
              
              <div className="flex gap-1 mb-2">
                {[...Array(5)].map((_, i) => (
                  <Star 
                    key={i} 
                    className={`w-3 h-3 ${i < review.rating ? "fill-[#D4AF37] text-[#D4AF37]" : "text-[#E5DCCA]"}`} 
                  />
                ))}
              </div>

              <p className="text-[#5D4037] text-sm leading-relaxed">{review.comment}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
"use client";

import { useState, useEffect, Suspense, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { X, ChevronLeft, ChevronRight, Loader2, Play, Sparkles, BookOpen, MapPin } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface Story {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  heroImage: string | null;
  featuredArtisan: {
    name: string | null;
    profile: { location: string | null } | null;
  };
}

function StoriesContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [stories, setStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState(true);
  const [isTriggering, setIsTriggering] = useState(false);
  const [viewMode, setViewMode] = useState<"gallery" | "reels">("gallery");
  const [currentReelIndex, setCurrentReelIndex] = useState(0);
  const [progress, setProgress] = useState(0);

  const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "https://artisans-loom-backend.onrender.com";

  // 1. Fetch Stories
  const fetchStories = useCallback(async () => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/stories`);
      if (!response.ok) throw new Error("Failed to fetch");
      const data = await response.json();
      setStories(data);
    } catch (error) {
      console.error("Fetch Error:", error);
    } finally {
      setLoading(false);
    }
  }, [BACKEND_URL]);

  useEffect(() => { fetchStories(); }, [fetchStories]);

  // 2. Trigger AI Storyteller
  const handleTriggerStory = async () => {
    setIsTriggering(true);
    try {
      const res = await fetch(`${BACKEND_URL}/api/stories/trigger`);
      const result = await res.text();
      if (result.includes("Success")) {
        toast.success("A new artisan has been featured!");
        fetchStories();
      } else {
        toast.error(result || "No new artisans to feature right now.");
      }
    } catch (error) {
      toast.error("Failed to connect to storyteller.");
    } finally {
      setIsTriggering(false);
    }
  };

  // 3. Reels Logic (Auto-advance)
  useEffect(() => {
    if (viewMode !== "reels" || stories.length === 0) return;
    const timer = setInterval(() => {
      setProgress((prev) => (prev < 100 ? prev + 1 : prev));
    }, 45);
    return () => clearInterval(timer);
  }, [viewMode, currentReelIndex, stories.length]);

  useEffect(() => {
    if (progress >= 100) {
      if (currentReelIndex < stories.length - 1) {
        setCurrentReelIndex(prev => prev + 1);
        setProgress(0);
      } else {
        setViewMode("gallery");
      }
    }
  }, [progress, currentReelIndex, stories.length]);

  if (loading) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#FDFBF7] gap-4">
      <Loader2 className="w-12 h-12 animate-spin text-[#D4AF37]" />
      <p className="font-serif italic text-[#4A3526]">Unrolling the heritage loom...</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#FDFBF7] pb-20">
      
      {/* --- REELS OVERLAY VIEW --- */}
      {viewMode === "reels" && stories.length > 0 && (
        <div className="fixed inset-0 bg-black z-[100] flex items-center justify-center overflow-hidden">
          <div className="absolute top-4 left-0 right-0 flex gap-2 px-4 z-50 max-w-md mx-auto">
            {stories.map((_, i) => (
              <div key={i} className="h-1 flex-1 bg-white/30 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-white transition-all duration-100 ease-linear"
                  style={{ width: i === currentReelIndex ? `${progress}%` : i < currentReelIndex ? "100%" : "0%" }}
                />
              </div>
            ))}
          </div>

          <button onClick={() => setViewMode("gallery")} className="absolute top-8 right-6 text-white z-50 p-2 hover:bg-white/10 rounded-full">
            <X size={32} />
          </button>

          <div className="relative w-full max-w-md h-screen md:h-[85vh] overflow-hidden rounded-none md:rounded-3xl border border-white/10">
            <Image 
              src={stories[currentReelIndex].heroImage || "/avatar.png"} 
              alt="Artisan" fill className="object-cover" priority
            />
            <div className="absolute bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-black via-black/40 to-transparent text-white">
              <span className="text-amber-400 font-bold text-xs uppercase tracking-widest">{stories[currentReelIndex].featuredArtisan.profile?.location}</span>
              <h2 className="text-2xl font-serif font-bold mb-2">{stories[currentReelIndex].featuredArtisan.name}</h2>
              <p className="text-sm text-gray-200 line-clamp-3 mb-6 italic">"{stories[currentReelIndex].excerpt}"</p>
              <Button 
                onClick={() => router.push(`/profile/${stories[currentReelIndex].id}`)}
                className="w-full bg-[#D4AF37] hover:bg-[#B8962D] text-black font-bold py-6 rounded-xl"
              >
                Visit Artisan Shop
              </Button>
            </div>
            {/* Tap areas */}
            <div className="absolute inset-0 flex">
              <div className="w-1/3 h-full" onClick={() => { if(currentReelIndex > 0) {setCurrentReelIndex(i => i-1); setProgress(0); }}} />
              <div className="w-2/3 h-full" onClick={() => { if(currentReelIndex < stories.length - 1) {setCurrentReelIndex(i => i+1); setProgress(0); }}} />
            </div>
          </div>
        </div>
      )}

      {/* --- MAIN DEDICATED PAGE CONTENT --- */}
      <div className="max-w-6xl mx-auto px-4 pt-12 space-y-12">
        
        {/* Header section with Trigger Button */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 border-b border-[#E5DCCA] pb-8">
          <div className="text-center md:text-left space-y-2">
            <h1 className="text-5xl font-serif font-bold text-[#4A3526]">Artisan Spotlights</h1>
            <p className="text-[#8C7B70] italic">Stories of heritage, one thread at a time.</p>
          </div>
          <div className="flex gap-4">
            <Button 
              onClick={() => setViewMode("reels")} 
              className="rounded-full bg-[#2F334F] hover:bg-[#1A1D2E] text-white px-6 gap-2"
            >
              <Play className="w-4 h-4 fill-current" /> Watch Reels
            </Button>
            <Button 
              disabled={isTriggering}
              onClick={handleTriggerStory}
              variant="outline" 
              className="rounded-full border-[#D4AF37] text-[#D4AF37] hover:bg-[#D4AF37] hover:text-white px-6 gap-2"
            >
              {isTriggering ? <Loader2 className="animate-spin w-4 h-4" /> : <Sparkles className="w-4 h-4" />}
              Craft New Story
            </Button>
          </div>
        </div>

        {stories.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-[#E5DCCA]">
            <BookOpen className="w-12 h-12 text-[#E5DCCA] mx-auto mb-4" />
            <h3 className="text-xl font-serif text-[#4A3526]">No stories published yet</h3>
            <p className="text-[#8C7B70] mb-6">Click 'Craft New Story' to feature an artisan!</p>
          </div>
        ) : (
          <>
            {/* Featured Story (Top) */}
            <div 
              onClick={() => { setCurrentReelIndex(0); setViewMode("reels"); }}
              className="relative h-[500px] rounded-[3rem] overflow-hidden group cursor-pointer shadow-2xl transition-transform hover:scale-[1.01]"
            >
              <Image src={stories[0].heroImage || "/avatar.png"} alt="Featured" fill className="object-cover transition-transform duration-1000 group-hover:scale-110" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#4A3526] via-transparent to-transparent opacity-80" />
              <div className="absolute bottom-10 left-10 right-10 space-y-4 text-white">
                <span className="bg-[#D4AF37] px-4 py-1 rounded-full text-xs font-bold uppercase tracking-widest text-black">Latest Spotlight</span>
                <h2 className="text-4xl font-serif font-bold">{stories[0].title}</h2>
                <p className="max-w-2xl text-gray-200 line-clamp-2">{stories[0].excerpt}</p>
                <div className="flex items-center gap-2 text-amber-400 font-medium pt-2">
                  <Play className="w-5 h-5 fill-current" /> Play Story Reel
                </div>
              </div>
            </div>

            {/* Grid of other stories */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {stories.slice(1).map((story, index) => (
                <div 
                  key={story.id} 
                  onClick={() => { setCurrentReelIndex(index + 1); setViewMode("reels"); }}
                  className="bg-white rounded-3xl border border-[#E5DCCA] overflow-hidden group cursor-pointer hover:shadow-xl transition-all"
                >
                  <div className="h-60 relative overflow-hidden">
                    <Image src={story.heroImage || "/avatar.png"} alt={story.title} fill className="object-cover group-hover:scale-110 transition-transform duration-500" />
                    <div className="absolute top-4 left-4">
                       <span className="px-3 py-1 bg-white/90 backdrop-blur rounded-full text-[10px] font-bold text-[#4A3526] shadow-sm flex items-center gap-1">
                         <MapPin className="w-3 h-3" /> {story.featuredArtisan.profile?.location}
                       </span>
                    </div>
                  </div>
                  <div className="p-6 space-y-3">
                    <h3 className="text-xl font-serif font-bold text-[#4A3526] line-clamp-2 group-hover:text-[#D4AF37] transition-colors">{story.title}</h3>
                    <p className="text-sm text-[#8C7B70] line-clamp-3 italic">"{story.excerpt}"</p>
                    <div className="pt-4 flex items-center justify-between text-[#D4AF37] font-bold text-xs uppercase tracking-tighter">
                      <span>By {story.featuredArtisan.name}</span>
                      <ChevronRight className="group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default function StoriesPage() {
  return (
    <Suspense fallback={<div className="bg-[#FDFBF7] h-screen w-screen" />}>
      <StoriesContent />
    </Suspense>
  );
}
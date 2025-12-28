"use client";

import { useState, useEffect, Suspense, useCallback } from "react";
import { useRouter } from "next/navigation";
import { X, ChevronRight, Loader2, Play, Sparkles, BookOpen, MapPin } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

// Enhanced interface for safer data access
interface Story {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  heroImage: string | null;
  featuredArtisanId?: string; // Flattened ID from backend map
  featuredArtisan: {
    id: string; 
    name: string | null;
    profile: { location: string | null } | null;
  } | null;
}

function StoriesContent() {
  const router = useRouter();
  const [stories, setStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState(true);
  const [isTriggering, setIsTriggering] = useState(false);
  const [viewMode, setViewMode] = useState<"gallery" | "reels">("gallery");
  const [currentReelIndex, setCurrentReelIndex] = useState(0);
  const [progress, setProgress] = useState(0);

  const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "https://artisans-loom-backend.onrender.com";

  // 1. Fetch Stories and Log Data for debugging
  const fetchStories = useCallback(async () => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/stories`);
      if (!response.ok) throw new Error("Failed to fetch");
      const data = await response.json();
      
      // LOG DATA: Check your browser console to see if 'id' exists in featuredArtisan
      console.log("Fetched Stories:", data); 
      
      setStories(data);
    } catch (error) {
      console.error("Fetch Error:", error);
      toast.error("Failed to load stories.");
    } finally {
      setLoading(false);
    }
  }, [BACKEND_URL]);

  useEffect(() => { fetchStories(); }, [fetchStories]);

  // 2. AI Storyteller Trigger
  const handleTriggerStory = async () => {
    setIsTriggering(true);
    try {
      const res = await fetch(`${BACKEND_URL}/api/stories/trigger`);
      const result = await res.text();
      if (result.includes("Success")) {
        toast.success("The loom has spun a new story!");
        fetchStories();
      } else {
        toast.error(result || "The artisans are busy, try again later.");
      }
    } catch (error) {
      toast.error("Connection to loom failed.");
    } finally {
      setIsTriggering(false);
    }
  };

  // 3. Reel Auto-advance logic
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
      <p className="font-serif italic text-[#4A3526]">Gathering threads of heritage...</p>
    </div>
  );

  const currentStory = stories[currentReelIndex];

  return (
    <div className="min-h-screen bg-[#FDFBF7] pb-20">
      
      {/* --- REELS OVERLAY VIEW --- */}
      {viewMode === "reels" && currentStory && (
        <div className="fixed inset-0 bg-black z-[100] flex items-center justify-center overflow-hidden">
          {/* Progress Indicators */}
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

          {/* Close Button */}
          <button onClick={() => setViewMode("gallery")} className="absolute top-8 right-6 text-white z-50 p-2 hover:bg-white/10 rounded-full transition-colors">
            <X size={32} />
          </button>

          <div className="relative w-full max-w-md h-screen md:h-[85vh] overflow-hidden rounded-none md:rounded-3xl border border-white/10 shadow-2xl">
            <Image 
              src={currentStory.heroImage || "/avatar.png"} 
              alt="Artisan Story" fill className="object-cover" priority
            />
            
            {/* Text Overlay Layer (High Z-Index) */}
            <div className="absolute bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-black via-black/60 to-transparent text-white z-30">
              <span className="text-amber-400 font-bold text-xs uppercase tracking-widest block mb-1">
                {currentStory.featuredArtisan?.profile?.location || "India"}
              </span>
              <h2 className="text-2xl font-serif font-bold mb-2">
                {currentStory.featuredArtisan?.name || "Featured Artisan"}
              </h2>
              <p className="text-sm text-gray-200 line-clamp-3 mb-6 italic leading-relaxed">
                "{currentStory.excerpt}"
              </p>
              
              {/* [FIXED REDIRECTION]: Checks flattened ID or nested ID */}
              <Button 
                onClick={(e) => {
                  e.stopPropagation(); 
                  const artisanId = currentStory.featuredArtisanId || currentStory.featuredArtisan?.id;
                  
                  if (artisanId) {
                    router.push(`/profile/${artisanId}`);
                  } else {
                    toast.error("Artisan profile not available.");
                    console.error("Missing ID for story:", currentStory);
                  }
                }}
                className="w-full bg-[#D4AF37] hover:bg-[#B8962D] text-black font-bold py-6 rounded-xl shadow-lg active:scale-95 transition-all"
              >
                Visit Artisan Shop
              </Button>
            </div>

            {/* Navigation Tap Areas (Layer between Image and Button) */}
            <div className="absolute inset-0 flex z-20">
              <div 
                className="w-1/3 h-full cursor-pointer" 
                onClick={(e) => { e.stopPropagation(); if(currentReelIndex > 0) {setCurrentReelIndex(i => i-1); setProgress(0); }}} 
              />
              <div 
                className="w-2/3 h-full cursor-pointer" 
                onClick={(e) => { e.stopPropagation(); if(currentReelIndex < stories.length - 1) {setCurrentReelIndex(i => i+1); setProgress(0); }}} 
              />
            </div>
          </div>
        </div>
      )}

      {/* --- MAIN PAGE GALLERY CONTENT --- */}
      <div className="max-w-6xl mx-auto px-4 pt-12 space-y-12">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 border-b border-[#E5DCCA] pb-8">
          <div className="text-center md:text-left space-y-2">
            <h1 className="text-5xl font-serif font-bold text-[#4A3526]">Artisan Spotlights</h1>
            <p className="text-[#8C7B70] italic font-serif">Stories of heritage, told through the hands of masters.</p>
          </div>
          <div className="flex gap-4">
            <Button 
              onClick={() => { setCurrentReelIndex(0); setViewMode("reels"); setProgress(0); }} 
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
          <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-[#E5DCCA] shadow-sm">
            <BookOpen className="w-12 h-12 text-[#E5DCCA] mx-auto mb-4" />
            <h3 className="text-xl font-serif text-[#4A3526]">The loom is empty</h3>
            <p className="text-[#8C7B70]">Click 'Craft New Story' to feature your first artisan.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {stories.map((story, index) => (
              <div 
                key={story.id} 
                onClick={() => { setCurrentReelIndex(index); setViewMode("reels"); setProgress(0); }}
                className="bg-white rounded-3xl border border-[#E5DCCA] overflow-hidden group cursor-pointer hover:shadow-xl transition-all duration-300"
              >
                <div className="h-60 relative overflow-hidden">
                  <Image 
                    src={story.heroImage || "/avatar.png"} 
                    alt={story.title} 
                    fill 
                    className="object-cover group-hover:scale-110 transition-transform duration-700" 
                  />
                  <div className="absolute top-4 left-4">
                     <span className="px-3 py-1 bg-white/90 backdrop-blur rounded-full text-[10px] font-bold text-[#4A3526] shadow-sm flex items-center gap-1">
                       <MapPin className="w-3 h-3 text-[#D4AF37]" /> {story.featuredArtisan?.profile?.location || "India"}
                     </span>
                  </div>
                </div>
                <div className="p-6 space-y-3">
                  <h3 className="text-xl font-serif font-bold text-[#4A3526] line-clamp-2 group-hover:text-[#D4AF37] transition-colors">
                    {story.title}
                  </h3>
                  <p className="text-sm text-[#8C7B70] line-clamp-3 italic leading-relaxed">
                    "{story.excerpt}"
                  </p>
                  <div className="pt-4 flex items-center justify-between text-[#D4AF37] font-bold text-xs uppercase tracking-tighter">
                    <span>By {story.featuredArtisan?.name || "Artisan"}</span>
                    <ChevronRight className="group-hover:translate-x-1 transition-transform duration-300" />
                  </div>
                </div>
              </div>
            ))}
          </div>
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
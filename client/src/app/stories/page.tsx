"use client";

import { useState, useEffect, Suspense, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { X, ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";

// Define the shape of our Story data from the backend
interface Story {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  heroImage: string | null;
  featuredArtisan: {
    name: string | null;
    profile: {
      location: string | null;
    } | null;
  };
}

function StoriesContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialId = searchParams.get("id");
  
  const [stories, setStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [progress, setProgress] = useState(0);

  // [UPDATE]: Define the backend URL dynamically
  // If you add NEXT_PUBLIC_BACKEND_URL to Vercel env vars, it will use that.
  // Otherwise, it defaults to your live Render URL.
  const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "https://artisans-loom-backend.onrender.com";

  // 1. Fetch stories from your Express Backend
  useEffect(() => {
    async function fetchStories() {
      try {
        // [FIX]: Changed from localhost:3001 to the dynamic BACKEND_URL
        const response = await fetch(`${BACKEND_URL}/api/stories`);
        
        if (!response.ok) throw new Error("Failed to fetch");
        
        const data = await response.json();
        setStories(data);

        // If an ID was passed in the URL, find its index
        if (initialId) {
          const index = data.findIndex((s: Story) => s.id === initialId);
          if (index !== -1) setCurrentIndex(index);
        }
      } catch (error) {
        console.error("Failed to fetch stories:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchStories();
  }, [initialId, BACKEND_URL]);

  const handleNext = useCallback(() => {
    if (currentIndex < stories.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setProgress(0);
    } else {
      router.push("/");
    }
  }, [currentIndex, router, stories.length]);

  const handlePrev = useCallback(() => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
      setProgress(0);
    }
  }, [currentIndex]);

  // 2. Immersive Timer Logic
  useEffect(() => {
    if (loading || stories.length === 0) return;

    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev < 100) return prev + 1;
        return prev;
      });
    }, 45); // Adjust speed (approx 4.5 seconds per story)
    
    return () => clearInterval(timer);
  }, [currentIndex, loading, stories.length]);

  // 3. Auto-navigation when progress finishes
  useEffect(() => {
    if (progress >= 100) {
      handleNext();
    }
  }, [progress, handleNext]);

  // Loading state
  if (loading) {
    return (
      <div className="fixed inset-0 bg-black flex flex-col items-center justify-center text-white gap-4">
        <Loader2 className="w-10 h-10 animate-spin text-[#D4AF37]" />
        <p className="font-serif italic text-lg">Gathering stories from the loom...</p>
      </div>
    );
  }

  // Empty state
  if (stories.length === 0) {
    return (
      <div className="fixed inset-0 bg-black flex flex-col items-center justify-center text-white p-6 text-center">
        <h2 className="text-2xl font-serif mb-4">No Stories Found</h2>
        <p className="text-gray-400 mb-8">Our artisans are currently busy at their craft. Check back in an hour!</p>
        <Button onClick={() => router.push("/")} variant="outline" className="border-[#D4AF37] text-white">
          Back to Home
        </Button>
      </div>
    );
  }

  const currentStory = stories[currentIndex];

  return (
    <div className="fixed inset-0 bg-black z-50 flex items-center justify-center font-sans overflow-hidden">
      {/* Progress Bars */}
      <div className="absolute top-4 left-0 right-0 flex gap-2 px-4 z-50 max-w-md mx-auto">
        {stories.map((_, i) => (
          <div key={i} className="h-1 flex-1 bg-white/30 rounded-full overflow-hidden">
            <div 
              className="h-full bg-white transition-all duration-100 ease-linear"
              style={{ width: i === currentIndex ? `${progress}%` : i < currentIndex ? "100%" : "0%" }}
            />
          </div>
        ))}
      </div>

      {/* Close Button */}
      <button 
        onClick={() => router.push("/")} 
        className="absolute top-8 right-6 text-white z-50 p-2 hover:bg-white/10 rounded-full transition-colors"
      >
        <X size={32} />
      </button>

      {/* Story Card */}
      <div className="relative w-full max-w-md h-[90vh] md:h-[800px] overflow-hidden rounded-2xl shadow-2xl border border-white/10">
        <Image 
          src={currentStory.heroImage || "/avatar.png"} 
          alt={currentStory.title} 
          fill 
          className="object-cover transition-opacity duration-500" 
          priority
        />
        
        {/* Text Overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-black/95 via-black/40 to-transparent text-white">
          <p className="text-amber-400 font-bold text-xs tracking-[0.2em] uppercase mb-1">
            {currentStory.featuredArtisan.profile?.location || "India"}
          </p>
          <h2 className="text-2xl font-serif font-bold mb-2 tracking-tight">
            {currentStory.featuredArtisan.name}
          </h2>
          <p className="text-gray-200 text-sm leading-relaxed mb-6 line-clamp-3">
            {currentStory.excerpt}
          </p>
          
          <Button 
            onClick={() => router.push(`/profile/${currentStory.id}`)}
            className="w-full bg-white text-black hover:bg-gray-200 rounded-lg py-6 font-bold shadow-lg transition-transform active:scale-95"
          >
            Visit Artisan Profile
          </Button>
        </div>

        {/* Tap areas for navigation */}
        <div className="absolute inset-0 flex">
          <div className="w-1/3 h-full cursor-pointer" onClick={handlePrev} />
          <div className="w-2/3 h-full cursor-pointer" onClick={handleNext} />
        </div>
      </div>
      
      {/* Desktop Controls */}
      <button onClick={handlePrev} className="hidden md:flex absolute left-10 text-white opacity-40 hover:opacity-100 transition-opacity">
        <ChevronLeft size={64} />
      </button>
      <button onClick={handleNext} className="hidden md:flex absolute right-10 text-white opacity-40 hover:opacity-100 transition-opacity">
        <ChevronRight size={64} />
      </button>
    </div>
  );
}

export default function StoriesPage() {
  return (
    <Suspense fallback={<div className="bg-black h-screen w-screen" />}>
      <StoriesContent />
    </Suspense>
  );
}
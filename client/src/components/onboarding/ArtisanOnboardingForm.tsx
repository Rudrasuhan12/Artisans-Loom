"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Sparkles, Loader2, ArrowRight } from "lucide-react";
import { onboardArtisanAction } from "@/app/actions/onboarding";
import { generateArtisanBio } from "@/app/actions/generateBio";
import { toast } from "sonner";

export default function ArtisanOnboardingForm() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [bio, setBio] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [craftType, setCraftType] = useState("");
  const [state, setState] = useState("");
  const [experience, setExperience] = useState("");

  const handleGenerateBio = async () => {
    if (!businessName || !craftType || !state) {
      toast.error("Please fill Business Name, Craft, and Location first!");
      return;
    }

    setIsGenerating(true);
    const result = await generateArtisanBio(businessName, craftType, state, experience);
    
    if (result.success) {
      setBio(result.bio || "");
      toast.success("Bio generated beautifully!");
    } else {
      toast.error("AI is taking a nap. Please write manually.");
    }
    setIsGenerating(false);
  };

  return (
    <form action={onboardArtisanAction} className="space-y-6">

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-sm font-medium text-[#4A3526]">Business Name</label>
          <Input 
            name="businessName" 
            placeholder="e.g., Sharma Handicrafts" 
            required 
            className="h-12 bg-white border-[#E5DCCA] focus-visible:ring-[#D4AF37]"
            value={businessName}
            onChange={(e) => setBusinessName(e.target.value)}
          />
        </div>
        
        <div className="space-y-2">
          <label className="text-sm font-medium text-[#4A3526]">Primary Craft</label>
          <Input 
            name="craftType" 
            placeholder="e.g., Pottery, Silk Weaving" 
            required 
            className="h-12 bg-white border-[#E5DCCA] focus-visible:ring-[#D4AF37]"
            value={craftType}
            onChange={(e) => setCraftType(e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-sm font-medium text-[#4A3526]">Location (State/City)</label>
          <Input 
            name="location" 
            placeholder="e.g., Varanasi, UP" 
            required 
            className="h-12 bg-white border-[#E5DCCA] focus-visible:ring-[#D4AF37]"
            value={state}
            onChange={(e) => setState(e.target.value)}
          />
        </div>
        
        <div className="space-y-2">
          <label className="text-sm font-medium text-[#4A3526]">Years of Experience</label>
          <Input 
            name="yearsOfExperience" 
            type="number" 
            placeholder="e.g., 15" 
            required 
            className="h-12 bg-white border-[#E5DCCA] focus-visible:ring-[#D4AF37]"
            value={experience}
            onChange={(e) => setExperience(e.target.value)}
          />
        </div>
      </div>

      <div className="space-y-3 pt-4">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium text-[#4A3526]">Your Story (Bio)</label>
          
          <Button 
            type="button" 
            onClick={handleGenerateBio}
            disabled={isGenerating}
            variant="ghost" 
            className="text-[#D97742] hover:bg-[#FFF5E1] hover:text-[#C05621] text-xs h-8 gap-1.5"
          >
            {isGenerating ? <Loader2 className="w-3 h-3 animate-spin" /> : <Sparkles className="w-3 h-3" />}
            {isGenerating ? "Weaving Words..." : "Generate with AI"}
          </Button>
        </div>

        <div className="relative">
          <Textarea 
            name="bio" 
            placeholder="Tell us about your heritage... or let AI write it for you!" 
            required 
            rows={5}
            className="bg-white border-[#E5DCCA] focus-visible:ring-[#D4AF37] resize-none leading-relaxed"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
          />
          <div className="absolute inset-0 pointer-events-none rounded-md shadow-[inset_0_0_10px_rgba(212,175,55,0.05)]"></div>
        </div>
      </div>

      <div className="pt-4">
        <Button type="submit" className="w-full h-14 text-lg font-serif bg-[#2F334F] hover:bg-[#1E2135] text-[#FDFBF7] shadow-xl">
          Complete Artisan Profile
        </Button>
      </div>

    </form>
  );
}
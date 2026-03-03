"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("App error:", error);
  }, [error]);

  return (
    <div className="min-h-screen bg-[#FDFBF7] flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white p-10 rounded-[3rem] border border-[#E5DCCA] shadow-xl text-center space-y-6">
        <div className="text-5xl">🪡</div>
        <h2 className="text-2xl font-serif font-bold text-[#4A3526]">
          Something went wrong
        </h2>
        <p className="text-[#8C7B70]">
          We hit a snag while weaving your page. Please try again.
        </p>
        <div className="flex gap-3 justify-center pt-2">
          <Button
            onClick={() => reset()}
            className="bg-[#2F334F] hover:bg-[#1E2135] text-white font-bold rounded-xl px-8 h-12"
          >
            Try Again
          </Button>
          <Button
            onClick={() => (window.location.href = "/")}
            variant="outline"
            className="border-[#E5DCCA] text-[#4A3526] font-bold rounded-xl px-8 h-12"
          >
            Go Home
          </Button>
        </div>
      </div>
    </div>
  );
}

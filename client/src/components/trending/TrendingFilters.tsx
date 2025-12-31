"use client";

import { Button } from "@/components/ui/button";
import { useRouter, useSearchParams } from "next/navigation";

const filters = [
  { label: "Today", value: "today" },
  { label: "This Week", value: "week" },
  { label: "This Month", value: "month" },
  { label: "This Year", value: "year" },
  { label: "All Time", value: "all" },
];

export default function TrendingFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentFilter = searchParams.get("range") || "week";

  const handleFilter = (value: string) => {
    router.push(`/trending?range=${value}`);
  };

  return (
    <div className="flex flex-wrap justify-center gap-4 mb-12">
      {filters.map((f) => {
        const isActive = currentFilter === f.value;
        return (
          <Button
            key={f.value}
            onClick={() => handleFilter(f.value)}
            className={`h-12 px-8 rounded-full font-bold transition-all shadow-md ${
              isActive
                ? "bg-[#D4AF37] text-[#2C1810] hover:bg-[#B8860B]"
                : "bg-white text-[#4A3526] border border-[#E5DCCA] hover:bg-[#FFF5E1]"
            }`}
          >
            {f.label}
          </Button>
        );
      })}
    </div>
  );
}
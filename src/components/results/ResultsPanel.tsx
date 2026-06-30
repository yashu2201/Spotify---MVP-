import React from "react";
import { EnrichedRecommendation } from "@/types/api";
import { ResultCard } from "./ResultCard";
import { ResultCardSkeleton } from "./ResultCardSkeleton";

interface ResultsPanelProps {
  recommendations: EnrichedRecommendation[] | null;
  assistantSummary?: string | null;
  isLoading?: boolean;
}

export function ResultsPanel({ recommendations, assistantSummary, isLoading }: ResultsPanelProps) {
  if (!isLoading && (!recommendations || recommendations.length === 0)) {
    return null;
  }

  return (
    <div className="w-full max-w-5xl mx-auto flex flex-col gap-6 mt-8">
      {!isLoading && assistantSummary && (
        <p className="text-zinc-400 italic text-center px-4">&quot;{assistantSummary}&quot;</p>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {isLoading
          ? Array.from({ length: 10 }).map((_, i) => <ResultCardSkeleton key={i} />)
          : recommendations?.map((rec, i) => (
              <ResultCard key={`${rec.artist}-${rec.track}-${i}`} recommendation={rec} />
            ))}
      </div>
    </div>
  );
}

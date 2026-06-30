import React from "react";
import { EnrichedRecommendation } from "@/types/api";

interface ResultCardProps {
  recommendation: EnrichedRecommendation;
}

function stringToColorHash(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  return hash;
}

export function ResultCard({ recommendation }: ResultCardProps) {
  return (
    <article 
      className="bg-brand-card border border-zinc-800/50 rounded-xl overflow-hidden hover:border-zinc-700 transition-all hover:-translate-y-1 hover:shadow-xl flex flex-col h-full group"
      aria-label={`${recommendation.track} by ${recommendation.artist}`}
    >
      <div className="p-4 pb-0">
        <div 
          className="w-full aspect-square rounded-lg flex-shrink-0 relative overflow-hidden bg-zinc-800"
        >
          <img 
            src={`https://picsum.photos/seed/${encodeURIComponent(recommendation.track + recommendation.artist)}/400/400`} 
            alt={`Album art for ${recommendation.track}`}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
        </div>
      </div>
      
      <div className="p-4 flex-grow flex flex-col">
        <h3 className="text-xl font-bold text-white leading-tight mb-1 group-hover:text-brand-green transition-colors line-clamp-1">{recommendation.track}</h3>
        <p className="text-xs font-medium text-zinc-400 mb-3">{recommendation.artist}</p>
        <p 
          className="text-zinc-300 text-sm leading-relaxed line-clamp-3 group-hover:line-clamp-none"
          title={recommendation.reason}
        >
          {recommendation.reason}
        </p>
      </div>
    </article>
  );
}

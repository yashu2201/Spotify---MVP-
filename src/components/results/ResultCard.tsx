"use client";

import React, { useState } from "react";
import { EnrichedRecommendation } from "@/types/api";
import { useStore } from "@/components/store/StoreProvider";

interface ResultCardProps {
  recommendation: EnrichedRecommendation;
  index?: number;
}

export function ResultCard({ recommendation, index = 0 }: ResultCardProps) {
  const { isSaved, toggleSave } = useStore();
  const [imgError, setImgError] = useState(false);
  const showRealArt = Boolean(recommendation.albumArtUrl) && !imgError;
  const saved = isSaved(recommendation.artist, recommendation.track);

  return (
    <article
      className="mb-fade-in group relative bg-brand-card border border-zinc-800/50 rounded-2xl overflow-hidden flex flex-col h-full transition-all duration-300 hover:-translate-y-1 hover:border-[color:rgba(var(--accent-rgb),0.4)] hover:shadow-[0_16px_44px_-16px_rgba(var(--accent-rgb),0.4)]"
      style={{ animationDelay: `${Math.min(index, 12) * 55}ms` }}
      aria-label={`${recommendation.track} by ${recommendation.artist}`}
    >
      <div className="p-3.5 pb-0">
        <div className="w-full aspect-square rounded-xl flex-shrink-0 relative overflow-hidden bg-zinc-800 shadow-lg">
          {showRealArt ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={recommendation.albumArtUrl}
              alt={`Album art for ${recommendation.track} by ${recommendation.artist}`}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              onError={() => setImgError(true)}
              loading="lazy"
            />
          ) : (
            <PlaceholderArt artist={recommendation.artist} track={recommendation.track} />
          )}

          {/* save heart */}
          <button
            onClick={() => toggleSave(recommendation)}
            aria-label={saved ? "Remove from Library" : "Save to Library"}
            title={saved ? "Saved" : "Save to Library"}
            className={`absolute top-2.5 right-2.5 w-9 h-9 rounded-full flex items-center justify-center backdrop-blur transition-all ${
              saved
                ? "bg-[color:var(--accent)] text-black scale-100"
                : "bg-black/50 text-white opacity-0 group-hover:opacity-100 hover:bg-black/70 hover:scale-110"
            }`}
          >
            <HeartIcon filled={saved} />
          </button>
        </div>
      </div>

      <div className="p-4 pt-3.5 flex-grow flex flex-col">
        <h3
          className="text-[15px] font-bold text-white leading-snug line-clamp-1 break-words group-hover:text-[color:var(--accent)] transition-colors"
          title={recommendation.track}
        >
          {recommendation.track}
        </h3>
        <p className="text-xs font-medium text-zinc-400 mt-0.5 mb-3 line-clamp-1 break-words" title={recommendation.artist}>
          {recommendation.artist}
          {recommendation.year ? <span className="text-zinc-600"> · {recommendation.year}</span> : null}
        </p>
        <p
          className="text-zinc-300/90 text-[13px] leading-relaxed line-clamp-3 break-words"
          title={recommendation.reason}
        >
          {recommendation.reason}
        </p>
      </div>
    </article>
  );
}

/** Deterministic gradient fallback when no album art is available. */
function PlaceholderArt({ artist, track }: { artist: string; track: string }) {
  const seed = `${artist}${track}`;
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = (hash << 5) - hash + seed.charCodeAt(i);
    hash |= 0;
  }
  const hue = Math.abs(hash) % 360;
  const hue2 = (hue + 60) % 360;

  return (
    <div
      className="w-full h-full flex items-center justify-center"
      style={{ background: `linear-gradient(135deg, hsl(${hue} 55% 30%), hsl(${hue2} 55% 18%))` }}
    >
      <svg width="38" height="38" viewBox="0 0 24 24" fill="none" stroke="white" strokeOpacity="0.55" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 18V5l12-2v13" />
        <circle cx="6" cy="18" r="3" />
        <circle cx="18" cy="16" r="3" />
      </svg>
    </div>
  );
}

function HeartIcon({ filled }: { filled: boolean }) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill={filled ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.29 1.51 4.04 3 5.5l7 7Z" />
    </svg>
  );
}

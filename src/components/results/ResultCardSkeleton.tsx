import React from "react";

export function ResultCardSkeleton({ index = 0 }: { index?: number }) {
  return (
    <article
      className="bg-brand-card border border-zinc-800/50 rounded-2xl overflow-hidden flex flex-col h-full"
      style={{ animationDelay: `${Math.min(index, 12) * 60}ms` }}
    >
      <div className="p-3 pb-0">
        <div className="w-full aspect-square rounded-xl bg-zinc-900/80 mb-shimmer flex items-center justify-center relative overflow-hidden">
          {/* music equalizer */}
          <div className="flex items-end gap-1.5 h-12">
            {[0, 1, 2, 3, 4].map((i) => (
              <span
                key={i}
                className="w-1.5 h-full rounded-full bg-[color:var(--accent)] mb-bar"
                style={{ animationDelay: `${i * 0.12}s` }}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="p-4 flex-grow flex flex-col gap-2.5">
        <div className="h-4 rounded-md w-3/4 bg-zinc-800/80 mb-shimmer" />
        <div className="h-3 rounded-md w-1/2 bg-zinc-800/60 mb-shimmer" />
        <div className="mt-1 space-y-2">
          <div className="h-2.5 rounded-md w-full bg-zinc-800/40 mb-shimmer" />
          <div className="h-2.5 rounded-md w-full bg-zinc-800/40 mb-shimmer" />
          <div className="h-2.5 rounded-md w-2/3 bg-zinc-800/40 mb-shimmer" />
        </div>
      </div>
    </article>
  );
}

import React from "react";

export function ResultCardSkeleton() {
  return (
    <article className="bg-brand-card border border-zinc-800/50 rounded-xl overflow-hidden flex flex-col h-full animate-pulse">
      <div className="p-4 pb-0">
        <div className="w-full aspect-square rounded-lg flex-shrink-0 bg-zinc-800/50 flex items-end p-4 relative" />
      </div>
      
      <div className="p-4 flex-grow flex flex-col gap-3 mt-2">
        <div className="h-6 bg-zinc-800/80 rounded-md w-3/4"></div>
        <div className="h-3 bg-zinc-800/50 rounded-md w-1/2"></div>
        
        <div className="space-y-2 mt-2">
          <div className="h-3 bg-zinc-800/40 rounded-md w-full"></div>
          <div className="h-3 bg-zinc-800/40 rounded-md w-full"></div>
          <div className="h-3 bg-zinc-800/40 rounded-md w-4/5"></div>
        </div>
      </div>
    </article>
  );
}

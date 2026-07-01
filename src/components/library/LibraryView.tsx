"use client";

import React from "react";
import { useStore } from "@/components/store/StoreProvider";
import { ResultCard } from "@/components/results/ResultCard";

export function LibraryView() {
  const { savedSongs, setView } = useStore();

  return (
    <div className="w-full max-w-5xl mx-auto pt-2">
      <div className="flex items-end justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <span className="text-[color:var(--accent)]">♥</span> Your Library
          </h2>
          <p className="text-sm text-zinc-500 mt-1">
            {savedSongs.length} saved {savedSongs.length === 1 ? "song" : "songs"}
          </p>
        </div>
        <button
          onClick={() => setView("chat")}
          className="px-4 py-2 rounded-full border border-zinc-700 text-sm text-zinc-300 hover:text-white hover:border-zinc-500 transition-colors"
        >
          ← Back to discovery
        </button>
      </div>

      {savedSongs.length === 0 ? (
        <div className="flex flex-col items-center justify-center text-center text-zinc-500 py-24 gap-3">
          <span className="text-5xl">🎶</span>
          <p className="text-lg text-zinc-300">No saved songs yet</p>
          <p className="text-sm text-zinc-600 max-w-sm">
            Tap the ♥ on any recommendation and it&apos;ll show up here.
          </p>
          <button
            onClick={() => setView("chat")}
            className="mt-2 px-5 py-2 rounded-full bg-[color:var(--accent)] text-black font-semibold text-sm hover:opacity-90 transition-opacity"
          >
            Start discovering
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {savedSongs.map((song, i) => (
            <ResultCard key={`${song.artist}-${song.track}-${i}`} recommendation={song} index={i} />
          ))}
        </div>
      )}
    </div>
  );
}

"use client";

import React from "react";

interface RefineBarProps {
  onRefine: (prompt: string) => void;
  disabled?: boolean;
}

// One-tap steering. These read naturally as follow-up messages, and the backend
// already sends conversation history + priorTrackKeys so they never repeat songs.
const REFINE_CHIPS: { label: string; prompt: string }[] = [
  { label: "More obscure", prompt: "Give me more obscure, lesser-known artists this time." },
  { label: "More mainstream", prompt: "Make these more mainstream and well-known." },
  { label: "More upbeat", prompt: "Make them more upbeat and energetic." },
  { label: "Calmer", prompt: "Make them calmer and more mellow." },
  { label: "Different genre", prompt: "Try a noticeably different genre while keeping the overall vibe." },
  { label: "Less like these", prompt: "Give me songs quite different from the ones you just suggested." },
];

const SHOW_MORE_PROMPT =
  "Show me 10 more songs that fit my request, all different from the ones you've suggested so far.";

export function RefineBar({ onRefine, disabled }: RefineBarProps) {
  return (
    <div className="flex flex-col gap-3 border-t border-zinc-800/60 pt-5">
      <div className="flex items-center gap-3 flex-wrap">
        <button
          onClick={() => onRefine(SHOW_MORE_PROMPT)}
          disabled={disabled}
          className="flex items-center gap-2 px-4 py-2 rounded-full bg-[color:var(--accent)] text-black font-semibold text-sm hover:opacity-90 transition-opacity disabled:opacity-50"
        >
          <RefreshIcon /> Show 10 more
        </button>
        <span className="text-xs text-zinc-500">Not quite right? Nudge it:</span>
      </div>

      <div className="flex flex-wrap gap-2">
        {REFINE_CHIPS.map((c) => (
          <button
            key={c.label}
            onClick={() => onRefine(c.prompt)}
            disabled={disabled}
            className="px-4 py-1.5 rounded-full border border-zinc-800 bg-[#1b1f1e] text-xs font-medium text-zinc-300 hover:text-white hover:border-[color:rgba(var(--accent-rgb),0.5)] hover:bg-[color:rgba(var(--accent-rgb),0.08)] transition-all disabled:opacity-50"
          >
            {c.label}
          </button>
        ))}
      </div>
    </div>
  );
}

function RefreshIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 12a9 9 0 0 1 15-6.7L21 8" />
      <path d="M21 3v5h-5" />
      <path d="M21 12a9 9 0 0 1-15 6.7L3 16" />
      <path d="M3 21v-5h5" />
    </svg>
  );
}

"use client";

import React, { useState } from "react";
import { useAuth } from "./AuthProvider";
import { SpotifyLogo } from "@/components/ui/SpotifyLogo";

const FEATURES = [
  "A one-line reason for every single pick",
  "Real songs, verified against music catalogs",
  "The whole app themes itself to your mood",
];

const SAMPLE_VIBES = ["late night drive", "focus flow", "rainy day indie", "gym hype"];

export function LoginScreen() {
  const { login } = useAuth();
  const [name, setName] = useState("");

  const handleContinue = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) return;
    login({ name: trimmed, via: "email" });
  };

  // Cosmetic Spotify button — logs in with the entered name (or a friendly default).
  const handleSpotifyLogin = () => {
    login({ name: name.trim() || "Spotify Listener", via: "spotify" });
  };

  return (
    <div className="flex-1 relative flex items-stretch bg-brand-dark overflow-hidden">
      {/* ambient animated glow */}
      <div className="pointer-events-none absolute -top-40 -left-20 w-[560px] h-[560px] rounded-full bg-brand-green/10 blur-[130px] animate-pulse" />
      <div className="pointer-events-none absolute -bottom-48 right-0 w-[460px] h-[460px] rounded-full bg-emerald-500/10 blur-[120px] animate-pulse [animation-delay:1.2s]" />

      <div className="relative w-full grid md:grid-cols-2">
        {/* ---- Hero ---- */}
        <div className="flex flex-col justify-center gap-6 sm:gap-7 p-8 sm:p-12 lg:p-16">
          <div className="flex items-center gap-2.5">
            <SpotifyLogo size={34} />
            <span className="text-lg font-bold text-white tracking-tight">Music Buddy</span>
          </div>

          <div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white leading-[1.1]">
              Discover music by <span className="text-brand-green">describing a feeling.</span>
            </h1>
            <p className="text-zinc-400 mt-4 text-sm sm:text-base max-w-md leading-relaxed">
              Tell Music Buddy your mood, vibe, or moment — get ten songs, each with a reason why it fits.
            </p>
          </div>

          {/* animated equalizer */}
          <div className="flex items-end gap-1.5 h-9">
            {[0, 1, 2, 3, 4, 5, 6].map((i) => (
              <span
                key={i}
                className="w-1.5 h-full rounded-full bg-brand-green/80 mb-bar"
                style={{ animationDelay: `${i * 0.13}s` }}
              />
            ))}
          </div>

          <ul className="space-y-2.5">
            {FEATURES.map((f) => (
              <li key={f} className="flex items-center gap-3 text-sm text-zinc-300">
                <span className="w-5 h-5 rounded-full bg-brand-green/15 flex items-center justify-center flex-shrink-0">
                  <CheckIcon />
                </span>
                {f}
              </li>
            ))}
          </ul>

          <div className="hidden sm:flex flex-wrap gap-2 pt-1">
            {SAMPLE_VIBES.map((v) => (
              <span
                key={v}
                className="px-3 py-1 rounded-full border border-zinc-800 bg-white/[0.03] text-xs text-zinc-500"
              >
                &ldquo;{v}&rdquo;
              </span>
            ))}
          </div>
        </div>

        {/* ---- Login card ---- */}
        <div className="flex items-center justify-center p-6 sm:p-10 md:p-12">
          <div className="w-full max-w-sm bg-brand-card/70 backdrop-blur-xl border border-zinc-800/60 rounded-3xl p-6 sm:p-8 shadow-2xl">
            <h2 className="text-xl font-bold text-white text-center">Get started</h2>
            <p className="text-zinc-500 text-sm text-center mt-1 mb-6">Jump in — it&apos;s free.</p>

            <button
              type="button"
              onClick={handleSpotifyLogin}
              className="w-full flex items-center justify-center gap-2.5 bg-white text-black font-bold py-3.5 rounded-full hover:bg-zinc-100 transition-colors"
            >
              <SpotifyLogo size={20} /> Continue with Spotify
            </button>

            <div className="flex items-center gap-3 my-5">
              <div className="h-px bg-zinc-800 flex-1" />
              <span className="text-zinc-600 text-[11px] uppercase tracking-widest">or</span>
              <div className="h-px bg-zinc-800 flex-1" />
            </div>

            <form onSubmit={handleContinue} className="space-y-3">
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your name"
                className="w-full px-4 py-3.5 bg-brand-sidebar border border-zinc-800 rounded-full text-center text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-brand-green/40 transition"
              />
              <button
                type="submit"
                disabled={!name.trim()}
                className="w-full bg-brand-green text-black font-bold py-3.5 rounded-full hover:opacity-90 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Continue
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

function CheckIcon() {
  return (
    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#7bfca2" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

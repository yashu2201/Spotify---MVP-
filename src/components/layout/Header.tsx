"use client";

import React from "react";
import { useAuth } from "@/components/auth/AuthProvider";
import { useStore } from "@/components/store/StoreProvider";
import { moodTheme } from "@/lib/theme/mood";

export function Header() {
  const { user, logout } = useAuth();
  const { active, setSidebarOpen } = useStore();
  const initial = user?.name?.trim()?.[0]?.toUpperCase() ?? "?";
  const theme = active?.mood ? moodTheme(active.mood) : null;

  return (
    <header className="flex justify-between items-center py-6 md:py-7 gap-3">
      <div className="flex items-center gap-3 min-w-0">
        <button
          onClick={() => setSidebarOpen(true)}
          aria-label="Open menu"
          className="md:hidden text-zinc-300 hover:text-white p-1 -ml-1 flex-shrink-0"
        >
          <MenuIcon />
        </button>
        <h2 className="text-zinc-200 text-base md:text-lg font-medium truncate">
          <span className="hidden sm:inline">Tell me what you&apos;re in the mood for</span>
          <span className="sm:hidden">What&apos;s the vibe?</span>
        </h2>
        {theme && (
          <span className="hidden md:flex items-center gap-2 text-xs font-medium px-3 py-1 rounded-full bg-zinc-800/60 text-zinc-300 border border-zinc-700/50 flex-shrink-0">
            <span className="w-2 h-2 rounded-full bg-[color:var(--accent)]" />
            {theme.label}
          </span>
        )}
      </div>

      <div className="flex items-center gap-2 text-zinc-300">
        <div className="w-9 h-9 rounded-full bg-[color:rgba(var(--accent-rgb),0.2)] border border-[color:rgba(var(--accent-rgb),0.4)] flex items-center justify-center text-[color:var(--accent)] font-bold text-sm">
          {initial}
        </div>
        <span className="text-sm text-zinc-200 hidden sm:inline max-w-[120px] truncate" title={user?.name}>
          {user?.name}
        </span>
        <button
          onClick={logout}
          aria-label="Log out"
          title="Log out"
          className="p-2 rounded-full text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
        >
          <LogoutIcon />
        </button>
      </div>
    </header>
  );
}

function MenuIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="3" y1="6" x2="21" y2="6" />
      <line x1="3" y1="12" x2="21" y2="12" />
      <line x1="3" y1="18" x2="21" y2="18" />
    </svg>
  );
}

function LogoutIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <polyline points="16 17 21 12 16 7" />
      <line x1="21" x2="9" y1="12" y2="12" />
    </svg>
  );
}

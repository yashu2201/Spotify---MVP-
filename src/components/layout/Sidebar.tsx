"use client";

import React from "react";
import { useStore } from "@/components/store/StoreProvider";
import { SpotifyLogo } from "@/components/ui/SpotifyLogo";

const QUICK_VIBES: { label: string; query: string }[] = [
  { label: "Focus", query: "instrumental focus music for deep work, no lyrics" },
  { label: "Party", query: "high energy party bangers to dance to" },
  { label: "Chill", query: "chill lo-fi beats to relax and unwind" },
  { label: "Sad", query: "sad emotional songs for a rainy day" },
  { label: "Romance", query: "romantic love songs for a slow evening" },
  { label: "Workout", query: "high tempo motivating songs for a workout" },
];

export function Sidebar() {
  const {
    view,
    setView,
    conversations,
    activeId,
    startNewChat,
    selectConversation,
    deleteConversation,
    savedSongs,
    queuePrompt,
    sidebarOpen,
    setSidebarOpen,
  } = useStore();

  const close = () => setSidebarOpen(false);

  return (
    <aside
      className={`fixed md:static inset-y-0 left-0 z-50 w-64 flex-shrink-0 bg-brand-sidebar flex flex-col h-full border-r border-zinc-800/50 transform transition-transform duration-300 md:translate-x-0 ${
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      }`}
    >
      <div className="p-6 pb-4 flex items-start justify-between">
        <div className="flex items-center gap-2.5">
          <SpotifyLogo size={28} />
          <div>
            <h1 className="text-xl font-bold text-[color:var(--accent)] tracking-tight leading-none">Music Buddy</h1>
            <p className="text-[10px] text-zinc-400 font-bold tracking-[0.2em] mt-1 uppercase">AI Music Discovery</p>
          </div>
        </div>
        <button
          onClick={close}
          aria-label="Close menu"
          className="md:hidden text-zinc-400 hover:text-white p-1 -mr-1"
        >
          <CloseIcon />
        </button>
      </div>

      <div className="px-4">
        <button
          onClick={() => {
            startNewChat();
            close();
          }}
          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[color:var(--accent)] text-black font-semibold text-sm hover:opacity-90 transition-opacity"
        >
          <PlusIcon /> New chat
        </button>
      </div>

      <nav className="px-4 pt-4 space-y-1">
        <button
          onClick={() => {
            setView("chat");
            close();
          }}
          className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl font-medium text-sm transition-colors ${
            view === "chat"
              ? "text-[color:var(--accent)] bg-[color:rgba(var(--accent-rgb),0.1)]"
              : "text-zinc-400 hover:text-zinc-200 hover:bg-white/5"
          }`}
        >
          <HomeIcon /> Discover
        </button>
        <button
          onClick={() => {
            setView("library");
            close();
          }}
          className={`w-full flex items-center justify-between px-4 py-2.5 rounded-xl font-medium text-sm transition-colors ${
            view === "library"
              ? "text-[color:var(--accent)] bg-[color:rgba(var(--accent-rgb),0.1)]"
              : "text-zinc-400 hover:text-zinc-200 hover:bg-white/5"
          }`}
        >
          <span className="flex items-center gap-3">
            <LibraryIcon /> Library
          </span>
          {savedSongs.length > 0 && (
            <span className="text-[10px] font-bold bg-zinc-700/70 text-zinc-200 rounded-full px-1.5 py-0.5 min-w-[18px] text-center">
              {savedSongs.length}
            </span>
          )}
        </button>
      </nav>

      <div className="px-6 pt-6">
        <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider mb-3">Quick vibes</p>
        <div className="grid grid-cols-2 gap-2">
          {QUICK_VIBES.map((v) => (
            <button
              key={v.label}
              onClick={() => {
                queuePrompt(v.query);
                close();
              }}
              className="px-3 py-2 rounded-lg border border-zinc-800 bg-[#1b1f1e] text-xs font-medium text-zinc-300 hover:text-white hover:border-[color:rgba(var(--accent-rgb),0.5)] hover:bg-[color:rgba(var(--accent-rgb),0.08)] transition-all"
            >
              {v.label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-6 pt-6 min-h-0">
        <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider mb-2">Recent</p>
        {conversations.length === 0 ? (
          <p className="text-xs text-zinc-600">Your chats will appear here.</p>
        ) : (
          <div className="space-y-0.5 -mx-2">
            {conversations.map((c) => (
              <div
                key={c.id}
                className={`group flex items-center gap-1 rounded-lg transition-colors ${
                  view === "chat" && activeId === c.id ? "bg-white/10" : "hover:bg-white/5"
                }`}
              >
                <button
                  onClick={() => {
                    selectConversation(c.id);
                    close();
                  }}
                  className="flex-1 text-left px-3 py-2 text-sm text-zinc-300 truncate"
                  title={c.title}
                >
                  {c.title}
                </button>
                <button
                  onClick={() => deleteConversation(c.id)}
                  aria-label="Delete conversation"
                  className="opacity-0 group-hover:opacity-100 text-zinc-500 hover:text-red-400 px-2 transition-all"
                >
                  <TrashIcon />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </aside>
  );
}

function PlusIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="5" x2="12" y2="19" />
      <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

function HomeIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <polyline points="9 22 9 12 15 12 15 22" />
    </svg>
  );
}

function LibraryIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m16 6 4 14" />
      <path d="M12 6v14" />
      <path d="M8 8v12" />
      <path d="M4 4v16" />
    </svg>
  );
}

function TrashIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="3 6 5 6 21 6" />
      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
    </svg>
  );
}

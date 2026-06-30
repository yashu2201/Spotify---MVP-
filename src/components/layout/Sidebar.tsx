import React from "react";
import Link from "next/link";

export function Sidebar() {
  return (
    <aside className="w-64 flex-shrink-0 bg-brand-sidebar flex flex-col h-full border-r border-zinc-800/50">
      <div className="p-8">
        <h1 className="text-2xl font-bold text-brand-green tracking-tight">Spotify - Music Buddy</h1>
        <p className="text-[10px] text-zinc-400 font-bold tracking-[0.2em] mt-1 uppercase">AI Music Discovery</p>
      </div>

      <nav className="flex-1 px-4 py-4 space-y-2">
        <Link href="#" className="flex items-center gap-4 px-4 py-3 text-brand-green bg-brand-green/10 rounded-xl font-medium transition-colors">
          <HomeIcon />
          Home
        </Link>
        <Link href="#" className="flex items-center gap-4 px-4 py-3 text-zinc-400 hover:text-zinc-200 hover:bg-white/5 rounded-xl font-medium transition-colors">
          <CompassIcon />
          Discover
        </Link>
        <Link href="#" className="flex items-center gap-4 px-4 py-3 text-zinc-400 hover:text-zinc-200 hover:bg-white/5 rounded-xl font-medium transition-colors">
          <LibraryIcon />
          Library
        </Link>
        <Link href="#" className="flex items-center gap-4 px-4 py-3 text-zinc-400 hover:text-zinc-200 hover:bg-white/5 rounded-xl font-medium transition-colors mt-8">
          <SettingsIcon />
          Settings
        </Link>
      </nav>

      <div className="p-6">
        <div className="bg-[#232726] rounded-xl p-4">
          <p className="text-[10px] text-brand-green font-bold uppercase tracking-wider mb-1">Currently Vibing</p>
          <p className="text-zinc-200 font-medium text-sm">Lofi Hip Hop Radio</p>
        </div>
      </div>
    </aside>
  );
}

function HomeIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
      <polyline points="9 22 9 12 15 12 15 22"/>
    </svg>
  );
}

function CompassIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/>
      <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"/>
    </svg>
  );
}

function LibraryIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m16 6 4 14"/>
      <path d="M12 6v14"/>
      <path d="M8 8v12"/>
      <path d="M4 4v16"/>
    </svg>
  );
}

function SettingsIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/>
      <circle cx="12" cy="12" r="3"/>
    </svg>
  );
}

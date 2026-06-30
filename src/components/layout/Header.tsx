import React from "react";

export function Header() {
  return (
    <header className="flex justify-between items-center py-8">
      <h2 className="text-zinc-200 text-lg font-medium">
        Tell me what you're in the mood for
      </h2>
      <div className="flex items-center gap-6 text-zinc-300">
        <button aria-label="Search" className="hover:text-white transition-colors">
          <SearchIcon />
        </button>
        <button aria-label="Profile" className="hover:text-white transition-colors">
          <UserIcon />
        </button>
      </div>
    </header>
  );
}

function SearchIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8"/>
      <path d="m21 21-4.3-4.3"/>
    </svg>
  );
}

function UserIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="8" r="5"/>
      <path d="M20 21a8 8 0 0 0-16 0"/>
    </svg>
  );
}

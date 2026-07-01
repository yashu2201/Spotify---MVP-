import React from "react";

/** Crisp inline Spotify glyph — scales cleanly on any background. */
export function SpotifyLogo({ size = 26, color = "#1DB954" }: { size?: number; color?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill={color}
      aria-hidden="true"
      className="flex-shrink-0"
    >
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.59 14.42a.62.62 0 0 1-.86.21c-2.35-1.44-5.3-1.76-8.79-.96a.625.625 0 1 1-.28-1.22c3.81-.87 7.08-.5 9.72 1.11.3.18.39.57.21.86zm1.23-2.74a.78.78 0 0 1-1.07.26c-2.69-1.65-6.79-2.13-9.97-1.17a.781.781 0 1 1-.45-1.5c3.64-1.1 8.16-.56 11.25 1.34.37.23.49.71.24 1.07zm.11-2.85C14.81 8.99 9.5 8.8 6.44 9.73a.94.94 0 1 1-.54-1.8c3.52-1.07 9.38-.86 13.08 1.34a.937.937 0 0 1-.96 1.61z" />
    </svg>
  );
}

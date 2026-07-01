import { Mood } from "@/types/api";

export interface MoodTheme {
  accent: string; // hex
  accentRgb: string; // "r, g, b" for rgba() usage
  label: string;
  emoji: string;
}

// Each mood maps to an accent color that themes the whole UI.
export const MOOD_THEMES: Record<Mood, MoodTheme> = {
  calm: { accent: "#5eead4", accentRgb: "94, 234, 212", label: "Calm", emoji: "🌿" },
  sad: { accent: "#7aa2e3", accentRgb: "122, 162, 227", label: "Melancholy", emoji: "🌧️" },
  energetic: { accent: "#fb7185", accentRgb: "251, 113, 133", label: "Energetic", emoji: "⚡" },
  focus: { accent: "#38bdf8", accentRgb: "56, 189, 248", label: "Focus", emoji: "🎯" },
  happy: { accent: "#fbbf24", accentRgb: "251, 191, 36", label: "Happy", emoji: "☀️" },
  romantic: { accent: "#f472b6", accentRgb: "244, 114, 182", label: "Romantic", emoji: "💗" },
  dark: { accent: "#a78bfa", accentRgb: "167, 139, 250", label: "Dark", emoji: "🌑" },
  dreamy: { accent: "#c084fc", accentRgb: "192, 132, 252", label: "Dreamy", emoji: "✨" },
};

// Default brand accent when no mood is active.
export const DEFAULT_THEME: MoodTheme = {
  accent: "#7bfca2",
  accentRgb: "123, 252, 162",
  label: "Music Buddy",
  emoji: "🎵",
};

export function moodTheme(mood?: Mood | null): MoodTheme {
  if (mood && MOOD_THEMES[mood]) return MOOD_THEMES[mood];
  return DEFAULT_THEME;
}

/** Apply the accent as CSS variables on the document root, with a smooth transition. */
export function applyMoodAccent(mood?: Mood | null) {
  if (typeof document === "undefined") return;
  const theme = moodTheme(mood);
  const root = document.documentElement;
  root.style.setProperty("--accent", theme.accent);
  root.style.setProperty("--accent-rgb", theme.accentRgb);
}

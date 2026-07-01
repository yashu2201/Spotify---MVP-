export interface RecommendRequest {
  message: string;
  history?: { role: "user" | "assistant"; content: string }[];
  priorTrackKeys?: string[];
}

export type Mood =
  | "calm"
  | "sad"
  | "energetic"
  | "focus"
  | "happy"
  | "romantic"
  | "dark"
  | "dreamy";

export interface EnrichedRecommendation {
  artist: string;
  track: string;
  reason: string;
  albumArtUrl?: string;
  albumName?: string;
  year?: string;
}

export interface RecommendResponse {
  recommendations: EnrichedRecommendation[];
  assistantSummary?: string;
  mood?: Mood;
  meta?: {
    resolved: number;
    dropped: number;
    latencyMs: number;
  };
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  recommendations?: EnrichedRecommendation[];
  mood?: Mood;
}

export interface Conversation {
  id: string;
  title: string;
  messages: ChatMessage[];
  priorTrackKeys: string[];
  mood?: Mood;
  updatedAt: number;
}

export interface SavedSong extends EnrichedRecommendation {
  savedAt: number;
}

export interface HealthResponse {
  status: "ok";
  timestamp: string;
}

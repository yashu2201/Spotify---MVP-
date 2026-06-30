export interface RecommendRequest {
  message: string;
  history?: { role: "user" | "assistant"; content: string }[];
  priorTrackKeys?: string[];
}

export interface EnrichedRecommendation {
  artist: string;
  track: string;
  reason: string;
  albumArtUrl?: string;
  albumName?: string;
}

export interface RecommendResponse {
  recommendations: EnrichedRecommendation[];
  assistantSummary?: string;
  meta?: {
    resolved: number;
    dropped: number;
    latencyMs: number;
  };
}

export interface HealthResponse {
  status: "ok";
  timestamp: string;
}

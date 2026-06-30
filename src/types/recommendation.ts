import { z } from "zod";

export const LlmRecommendationSchema = z.object({
  artist: z.string().min(1).max(200),
  track: z.string().min(1).max(200),
  reason: z.string().min(10).max(250),
});

export const LlmResponseSchema = z.object({
  recommendations: z.array(LlmRecommendationSchema).min(1).max(15),
  assistantSummary: z.string().max(300).optional(),
});

export type LlmRecommendation = z.infer<typeof LlmRecommendationSchema>;
export type LlmResponse = z.infer<typeof LlmResponseSchema>;

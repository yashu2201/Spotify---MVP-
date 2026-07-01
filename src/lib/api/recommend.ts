import { RecommendRequest, RecommendResponse } from "@/types/api";

export async function fetchRecommendations(
  body: RecommendRequest
): Promise<RecommendResponse> {
  const res = await fetch("/api/recommend", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const errBody = await res.json().catch(() => ({}));
    throw new Error(errBody.error ?? "Something went wrong fetching recommendations.");
  }

  return res.json();
}

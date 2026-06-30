import { RecommendResponse } from "@/types/api";

export async function fetchRecommendations(
  message: string
): Promise<RecommendResponse> {
  const res = await fetch("/api/recommend", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message }),
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error ?? "Something went wrong fetching recommendations.");
  }

  return res.json();
}

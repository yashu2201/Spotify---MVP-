import type { HealthResponse } from "@/types/api";

export async function GET() {
  const response: HealthResponse = {
    status: "ok",
    timestamp: new Date().toISOString(),
  };

  return Response.json(response);
}

import { RecommendResponse } from "@/types/api";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const message = body?.message;

    if (!message || typeof message !== "string" || message.trim().length < 3) {
      return Response.json({ error: "Please enter a valid message (at least 3 characters)." }, { status: 400 });
    }
    
    // Connect to Python Backend (FastAPI on Render/Local)
    const backendUrl = process.env.PYTHON_BACKEND_URL || "http://localhost:8000";
    
    const response = await fetch(`${backendUrl}/recommend`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ message })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return Response.json({ error: errorData.detail || "Couldn't process recommendations." }, { status: response.status });
    }

    const data: RecommendResponse = await response.json();
    return Response.json(data);
    
  } catch (error: any) {
    console.error("Recommend API Proxy Error:", error);
    return Response.json({ error: "An unexpected error occurred while connecting to the backend." }, { status: 500 });
  }
}

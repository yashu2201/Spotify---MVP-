import OpenAI from "openai";

export function getClient(): OpenAI {
  const provider = process.env.LLM_PROVIDER || "openai";
  
  if (provider === "groq") {
    return new OpenAI({
      apiKey: process.env.LLM_API_KEY,
      baseURL: "https://api.groq.com/openai/v1",
    });
  }

  // Fallback default
  return new OpenAI({
    apiKey: process.env.LLM_API_KEY,
  });
}

export async function completeChat(
  messages: { role: "system" | "user" | "assistant"; content: string }[]
): Promise<string> {
  const client = getClient();
  const model = process.env.LLM_MODEL || "llama-3.1-8b-instant";
  
  const response = await client.chat.completions.create({
    model,
    messages,
    temperature: 0.7,
    max_tokens: 2000,
    response_format: { type: "json_object" },
  });

  const content = response.choices[0]?.message?.content;
  if (!content) {
    throw new Error("No content returned from LLM.");
  }

  return content;
}

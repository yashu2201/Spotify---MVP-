import { loadEnv } from "./load-env";
import { completeChat } from "../src/lib/llm/client";
import { parseLlmResponse } from "../src/lib/llm/parse-response";
import { SYSTEM_PROMPT } from "../src/lib/llm/prompts";

loadEnv();

async function main() {
  if (!process.env.LLM_API_KEY) {
    console.error("FAIL: LLM_API_KEY is not set. Copy .env.example to .env.local and add your key.");
    process.exit(1);
  }

  const messages = [
    { role: "system" as const, content: SYSTEM_PROMPT },
    {
      role: "user" as const,
      content:
        'Recommend exactly 2 sad indie songs as JSON. Each reason should be one sentence tied to "sad indie".',
    },
  ];

  console.log("Validating LLM API...");
  const start = Date.now();

  try {
    const raw = await completeChat(messages);
    const parsed = parseLlmResponse(raw);
    const latencyMs = Date.now() - start;

    console.log("PASS: LLM returned valid JSON matching LlmResponseSchema");
    console.log(`  Latency: ${latencyMs}ms`);
    console.log(`  Recommendations: ${parsed.recommendations.length}`);
    console.log(`  Model: ${process.env.LLM_MODEL ?? "gpt-4o-mini"}`);

    for (const rec of parsed.recommendations) {
      console.log(`  - ${rec.track} by ${rec.artist}`);
    }

    if (parsed.assistantSummary) {
      console.log(`  Summary: ${parsed.assistantSummary}`);
    }
  } catch (error) {
    console.error("FAIL:", error instanceof Error ? error.message : error);
    process.exit(1);
  }
}

main();

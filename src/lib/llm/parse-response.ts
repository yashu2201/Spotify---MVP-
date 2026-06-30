import { LlmResponse, LlmResponseSchema } from "@/types/recommendation";

export class LlmParseError extends Error {
  public rawContent: string;
  constructor(message: string, rawContent: string) {
    super(message);
    this.name = "LlmParseError";
    this.rawContent = rawContent;
  }
}

export function parseLlmResponse(raw: string): LlmResponse {
  try {
    const parsedJson = JSON.parse(raw);
    const result = LlmResponseSchema.safeParse(parsedJson);
    
    if (!result.success) {
      throw new LlmParseError(`Zod Validation Error: ${result.error.message}`, raw);
    }
    
    return result.data;
  } catch (error: any) {
    if (error instanceof LlmParseError) {
      throw error;
    }
    throw new LlmParseError(`JSON Parse Error: ${error.message}`, raw);
  }
}

export async function parseWithRetry(
  messages: { role: "system" | "user" | "assistant"; content: string }[],
  raw: string,
  completeChatFn: (msgs: any[]) => Promise<string>
): Promise<LlmResponse> {
  try {
    return parseLlmResponse(raw);
  } catch (error: any) {
    if (error instanceof LlmParseError) {
      // Retry once
      const retryMessages = [
        ...messages,
        { role: "assistant", content: raw } as const,
        { 
          role: "user", 
          content: "Your previous response was invalid JSON or failed schema validation. Return ONLY valid JSON matching the exact schema." 
        } as const
      ];
      
      const retryRaw = await completeChatFn(retryMessages);
      return parseLlmResponse(retryRaw); // Throw on second failure
    }
    throw error;
  }
}

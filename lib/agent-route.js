import { createGeminiJsonResponse } from "@/lib/gemini";

export function createAgentRoute(instructions, prompt) {
  return async function GET() {
    try {
      const result = await createGeminiJsonResponse({ instructions, input: prompt });
      return Response.json(result);
    } catch (error) {
      console.error("Agent response error:", error);
      return Response.json({ error: "Unable to generate an agent response." }, { status: 502 });
    }
  };
}

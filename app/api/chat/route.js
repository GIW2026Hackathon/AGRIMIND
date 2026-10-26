import { createGeminiResponse } from "@/lib/gemini";

const DEFAULT_FARMER = {
  name: "Farmer",
  location: "Kenya",
  crop: "crops",
  stage: "growing",
  size: "farm",
};

function sanitizeHistory(history) {
  if (!Array.isArray(history)) return [];

  return history
    .filter((item) => item && typeof item.text === "string")
    .slice(-10)
    .map((item) => ({
      role: item.role === "ai" || item.role === "assistant" ? "assistant" : "user",
      content: item.text.slice(0, 2_000),
    }));
}

export async function POST(request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "The chat request must contain valid JSON." }, { status: 400 });
  }

  const { message, farmer = {}, weather = {}, history = [] } = body || {};

  if (typeof message !== "string" || !message.trim()) {
    return Response.json({ error: "A chat message is required." }, { status: 400 });
  }

  if (!process.env.GEMINI_API_KEY) {
    return Response.json({ error: "The AI chat service is not configured. Add GEMINI_API_KEY to .env.local." }, { status: 503 });
  }

  try {
    const profile = { ...DEFAULT_FARMER, ...farmer };
    const system =
      `You are AgriMind, a friendly farming assistant for ${profile.name} in ${profile.location}. ` +
      `They grow ${profile.crop} at the ${profile.stage} stage on a ${profile.size}. ` +
      `Current weather: ${weather.temp ?? "unknown"}°C, ${weather.humidity ?? "unknown"}% humidity. ` +
      "Give practical, safe, concise guidance in simple language. Keep replies to three sentences or fewer.";

    const historyText = sanitizeHistory(history)
      .map((item) => `${item.role}: ${item.content}`)
      .join("\n");
    const reply = await createGeminiResponse({
      instructions: system,
      input: `${historyText}\nuser: ${message.trim().slice(0, 2_000)}`.trim(),
      maxOutputTokens: 300,
    });

    return Response.json({ reply });
  } catch (error) {
    console.error("Chat route error:", error);
    return Response.json({ error: error instanceof Error ? error.message : "The AI chat service failed." }, { status: 502 });
  }
}

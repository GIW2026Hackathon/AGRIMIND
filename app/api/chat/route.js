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

function sanitizeDiagnosis(diagnosis) {
  if (!diagnosis || typeof diagnosis !== "object" || Array.isArray(diagnosis)) return null;

  const text = (value, limit = 500) => typeof value === "string" ? value.trim().slice(0, limit) : "";
  const list = (value) => Array.isArray(value)
    ? value.filter((item) => typeof item === "string").slice(0, 8).map((item) => item.slice(0, 300))
    : [];
  const confidence = Number.isFinite(diagnosis.confidence)
    ? Math.round(diagnosis.confidence <= 1 ? diagnosis.confidence * 100 : diagnosis.confidence)
    : null;

  return {
    crop: text(diagnosis.crop, 100),
    condition: text(diagnosis.condition, 150),
    name: text(diagnosis.name, 150),
    scientificName: text(diagnosis.scientific_name, 150),
    isHealthy: typeof diagnosis.is_healthy === "boolean" ? diagnosis.is_healthy : null,
    confidence: confidence === null ? null : Math.max(0, Math.min(100, confidence)),
    severity: text(diagnosis.severity, 100),
    severityPercentage: Number.isFinite(diagnosis.severity_percentage)
      ? Math.max(0, Math.min(100, diagnosis.severity_percentage))
      : null,
    summary: text(diagnosis.summary),
    symptoms: list(diagnosis.symptoms),
    treatment: list(diagnosis.treatment),
    prevention: list(diagnosis.prevention),
    demo: diagnosis.demo === true,
  };
}

export async function POST(request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "The chat request must contain valid JSON." }, { status: 400 });
  }

  const { message, farmer = {}, weather = {}, history = [], diagnosis: rawDiagnosis } = body || {};

  if (typeof message !== "string" || !message.trim()) {
    return Response.json({ error: "A chat message is required." }, { status: 400 });
  }

  if (!process.env.GEMINI_API_KEY) {
    return Response.json({
      error: "The AI chat service is not configured. Add GEMINI_API_KEY to your Render service's Environment settings, then redeploy.",
    }, { status: 503 });
  }

  try {
    const profile = { ...DEFAULT_FARMER, ...farmer };
    const diagnosis = sanitizeDiagnosis(rawDiagnosis);
    const system =
      `You are AgriMind, a friendly farming assistant for ${profile.name} in ${profile.location}. ` +
      `They grow ${profile.crop} at the ${profile.stage} stage on a ${profile.size}. ` +
      `Current weather: ${weather.temp ?? "unknown"}°C, ${weather.humidity ?? "unknown"}% humidity. ` +
      "Give practical, safe guidance in simple language. Clearly explain uncertainty and do not treat an image diagnosis as certain. " +
      (diagnosis
        ? `The latest leaf scan returned this data: ${JSON.stringify(diagnosis)}. Explain what these scan findings mean and use its symptoms, severity, treatment, and prevention details where relevant.`
        : "") +
      " Keep replies concise unless the user asks for more detail.";

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

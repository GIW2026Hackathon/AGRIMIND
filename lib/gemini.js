const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/interactions";
const GEMINI_MODEL = process.env.GEMINI_MODEL || "gemini-3.8-flash";
const MAX_ATTEMPTS = 2;
const RETRYABLE_STATUS_CODES = new Set([429, 500, 502, 503, 504]);

const delay = (milliseconds) => new Promise((resolve) => setTimeout(resolve, milliseconds));

async function createInteraction({ instructions, input, maxOutputTokens }) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is not configured. Add it to .env.local.");
  }

  let data;
  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt += 1) {
    let response;
    try {
      response = await fetch(GEMINI_API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": apiKey,
        },
        body: JSON.stringify({
          model: GEMINI_MODEL,
          input,
          system_instruction: instructions,
          generation_config: { max_output_tokens: maxOutputTokens },
        }),
        signal: AbortSignal.timeout(15_000),
      });
    } catch (error) {
      console.error("Gemini network request failed:", error);
      if (error?.name === "TimeoutError" || error?.name === "AbortError") {
        throw new Error("Gemini did not respond within 15 seconds. The model may be overloaded; please try again shortly.");
      }
      throw new Error("Could not reach Gemini. Check your internet connection and try again.");
    }

    data = await response.json().catch(() => ({}));
    if (response.ok) break;

    const message = data.error?.message || `Gemini request failed with status ${response.status}.`;
    if (!RETRYABLE_STATUS_CODES.has(response.status) || attempt === MAX_ATTEMPTS) {
      console.error("Gemini API request failed:", response.status, message);
      if (response.status === 429 || response.status === 503) {
        throw new Error("Gemini is temporarily busy. Please try again in a moment.");
      }
      throw new Error(message);
    }

    const retryAfter = Number(response.headers.get("Retry-After"));
    const waitTime = Number.isFinite(retryAfter) && retryAfter > 0
      ? Math.min(retryAfter * 1000, 2_000)
      : 500;
    await delay(waitTime);
  }

  const text = data.steps
    ?.filter((step) => step.type === "model_output")
    .flatMap((step) => step.content || [])
    .filter((item) => item.type === "text")
    .map((item) => item.text || "")
    .join("")
    .trim();

  if (!text) {
    throw new Error(data.status === "failed"
      ? "Gemini could not complete the request."
      : "Gemini returned no text response.");
  }

  return text;
}

export function createGeminiResponse({ instructions, input, maxOutputTokens = 400 }) {
  return createInteraction({ instructions, input, maxOutputTokens });
}

export async function createGeminiJsonResponse({ instructions, input, maxOutputTokens = 400 }) {
  const text = await createInteraction({
    instructions: `${instructions}\nReturn only valid JSON. Do not include markdown fences or explanatory text.`,
    input,
    maxOutputTokens,
  });
  return JSON.parse(text.replace(/```json|```/g, "").trim());
}

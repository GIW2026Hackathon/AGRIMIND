// lib/gemini.js
// Gemini Interactions API client (same endpoint and response shape as Google's
// current quickstart). Same exports as before: createGeminiResponse,
// createGeminiJsonResponse.

const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/interactions";

// gemini-3.5-flash is the model used in Google's current quickstart.
// Override with GEMINI_MODEL in .env.local / Vercel env vars.
const GEMINI_MODEL = process.env.GEMINI_MODEL || "gemini-3.5-flash";
const GEMINI_FALLBACK_MODELS = (process.env.GEMINI_FALLBACK_MODELS || "gemini-3.1-flash-lite")
  .split(",")
  .map((model) => model.trim())
  .filter((model) => model && model !== GEMINI_MODEL);

// Keep enough time for a fallback model to run within typical hosting request limits.
const REQUEST_TIMEOUT_MS = Number(process.env.GEMINI_TIMEOUT_MS) || 12_000;
const RETRYABLE_STATUS_CODES = new Set([429, 500, 502, 503, 504]);

async function createInteraction({ instructions, input, maxOutputTokens }) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is not configured. Add it to .env.local and your hosting environment settings.");
  }

  const models = [GEMINI_MODEL, ...GEMINI_FALLBACK_MODELS];
  let lastError;

  for (const model of models) {
    try {
      const response = await fetch(GEMINI_API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": apiKey,
        },
        body: JSON.stringify({
          model,
          input,
          system_instruction: instructions,
          generation_config: { max_output_tokens: maxOutputTokens },
          store: false, // chat history is kept by our app, not stored by Google
        }),
        signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
      });

      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        const message = data.error?.message || `Gemini request failed with status ${response.status}.`;
        if (!RETRYABLE_STATUS_CODES.has(response.status) && response.status !== 404) {
          throw new Error(message);
        }
        lastError = new Error(message);
        console.error(`Gemini model ${model} failed with status ${response.status}; trying fallback if available.`);
        continue;
      }

      const text = data.steps
        ?.filter((step) => step.type === "model_output")
        .flatMap((step) => step.content || [])
        .filter((item) => item.type === "text")
        .map((item) => item.text || "")
        .join("")
        .trim();

      if (text) return text;

      lastError = new Error(data.status === "failed"
        ? "Gemini could not complete the request."
        : "Gemini returned no text response.");
      console.error(`Gemini model ${model} returned no text; trying fallback if available.`);
    } catch (error) {
      const timedOut = error?.name === "TimeoutError" || error?.name === "AbortError";
      const message = timedOut
        ? `Gemini did not respond within ${Math.round(REQUEST_TIMEOUT_MS / 1000)} seconds.`
        : error instanceof Error
          ? error.message
          : "Could not reach Gemini.";
      lastError = new Error(message);
      console.error(`Gemini request failed for model ${model}:`, error?.name || "Error", message);

      if (!timedOut && !/fetch failed|network|socket|ECONN|ENOTFOUND/i.test(message)) {
        throw lastError;
      }
    }
  }

  throw new Error(
    `Gemini could not respond using ${models.join(" or ")}. ${lastError?.message || "Please try again shortly."}`
  );
}

export function createGeminiResponse({ instructions, input, maxOutputTokens = 600 }) {
  return createInteraction({ instructions, input, maxOutputTokens });
}

export async function createGeminiJsonResponse({ instructions, input, maxOutputTokens = 600 }) {
  const text = await createInteraction({
    instructions: instructions + "\nReturn only valid JSON. Do not include markdown fences or explanatory text.",
    input,
    maxOutputTokens,
  });
  return JSON.parse(text.replace(/```json|```/g, "").trim());
}
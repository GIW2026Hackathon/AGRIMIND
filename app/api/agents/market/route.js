import { createAgentRoute } from "@/lib/agent-route";

export const GET = createAgentRoute(
  "You are a specialist agricultural market analysis agent. Respond only with valid JSON.",
  'You are the AgriMind Market Agent. Crop: Tomatoes, Nakuru County Kenya. Current price: KES 45/kg. Season: cool_dry. Growth stage: fruiting. Return ONLY valid JSON (no backticks): {"price_trend":"rising|falling|stable","sell_now":"yes|no","optimal_price":"KES X/kg","market_forecast":"...","best_market":"...","confidence":0-100,"summary":"one sentence"}'
);

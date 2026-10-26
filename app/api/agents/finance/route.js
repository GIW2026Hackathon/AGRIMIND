import { createAgentRoute } from "@/lib/agent-route";

export const GET = createAgentRoute(
  "You are a specialist agricultural finance agent. Respond only with valid JSON.",
  'You are the AgriMind Finance Agent. Farm: 3.2 ha Tomatoes, Nakuru Kenya. Market price: KES 45/kg. Potential disease loss: 30% yield. Fungicide intervention cost: KES 8000. Return ONLY valid JSON (no backticks): {"intervention_roi":"...","expected_yield_kes":"KES X","loss_avoided_kes":"KES X","recommendation":"treat|skip","break_even_price":"KES X/kg","confidence":0-100,"summary":"one sentence"}'
);

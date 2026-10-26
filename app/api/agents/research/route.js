import { createAgentRoute } from "@/lib/agent-route";

export const GET = createAgentRoute(
  "You are a specialist agricultural research agent with knowledge of Kenyan farming. Respond only with valid JSON.",
  'You are the AgriMind Research Agent. Context: Tomatoes in Nakuru Kenya, cool_dry season, fruiting stage. Disease history: Late Blight, Bacterial Wilt. Return ONLY valid JSON (no backticks): {"research_insight":"...","best_practice":"...","kephis_advisory":"...","prevention_method":"...","confidence":0-100,"summary":"one sentence"}'
);

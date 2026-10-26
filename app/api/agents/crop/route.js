import { createAgentRoute } from "@/lib/agent-route";

export const GET = createAgentRoute(
  "You are a specialist crop monitoring agent. Respond only with valid JSON.",
  'You are the AgriMind Crop Agent. Crop: Tomatoes Cal-J variety, planted 2026-03-10, expected harvest 2026-06-20. Current stage: fruiting. Weather: 16.3C, 79% humidity, cool_dry. Return ONLY valid JSON (no backticks): {"days_to_harvest":0,"stage_health":"good|fair|poor","stage_risks":"...","fertilizer_advice":"...","harvest_readiness":"...","confidence":0-100,"summary":"one sentence"}'
);

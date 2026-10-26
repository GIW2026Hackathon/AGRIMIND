import { createAgentRoute } from "@/lib/agent-route";

export const GET = createAgentRoute(
  "You are a specialist pest management agent. Respond only with valid JSON.",
  'You are the AgriMind Pest Agent. Crop: Tomatoes fruiting stage, Nakuru Kenya. Weather: 16.3C, 79% humidity, 19.5km/h wind, cool_dry season. Return ONLY valid JSON (no backticks): {"pest_risk":"HIGH|MODERATE|LOW","pests_detected":["..."],"infestation_probability":0-100,"control_method":"...","scouting_advice":"...","confidence":0-100,"summary":"one sentence"}'
);

import { createAgentRoute } from "@/lib/agent-route";

export const GET = createAgentRoute(
  "You are a specialist irrigation management agent. Respond only with valid JSON.",
  'You are the AgriMind Irrigation Agent. Farm: Tomatoes fruiting stage, 3.2 ha, Nakuru Kenya. Weather: 16.3C, 79% humidity, 0mm rainfall, soil moisture 62%. Return ONLY valid JSON (no backticks): {"irrigate_today":"yes|no","water_amount_mm":"...","next_irrigation":"...","reasoning":"...","confidence":0-100,"summary":"one sentence"}'
);

import { createAgentRoute } from "@/lib/agent-route";

export const GET = createAgentRoute(
  "You are a specialist weather intelligence agent. Respond only with valid JSON.",
  'You are the AgriMind Weather Agent. Analyse current weather conditions for Kisii, Kenya. Temperature: 16.3C, Humidity: 79%, Rainfall: 0mm, Wind: 19.5km/h, Season: cool_dry. Return ONLY valid JSON (no backticks): {"weather_risk":"HIGH|MODERATE|LOW","risk_window":"...","conditions_summary":"...","alert_level":"HIGH|MODERATE|LOW","confidence":0-100,"summary":"one sentence"}'
);

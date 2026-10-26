// app/api/core/route.js
// AgriMind Layer 6 — Core Engine
// Receives all 8 agent outputs, fuses them into unified farm intelligence
// and saves results to Supabase health_scores table

import { createGeminiJsonResponse } from "@/lib/gemini";
import { getServerSupabase } from "@/lib/server-supabase";

async function callGemini(instructions, input) {
  return createGeminiJsonResponse({ instructions, input, maxOutputTokens: 1000 });
}

// ─── POST: run core fusion ─────────────────────────────────────────
export async function POST(request) {
  try {
    const sb = getServerSupabase();
    const body = await request.json();
    const { farm_id, agents } = body;

    if (!agents || Object.keys(agents).length === 0) {
      return Response.json(
        { error: "No agent outputs provided. Run /api/agents/run first." },
        { status: 400 }
      );
    }

    // Build agent summary string
    const agentSummary = Object.entries(agents)
      .map(([id, r]) => id.toUpperCase() + " AGENT: " + (r.summary || "no summary"))
      .join("\n");

    const agentDetails = Object.entries(agents)
      .map(([id, r]) => {
        return id + ": " +
          "confidence=" + (r.confidence || 0) + "%, " +
          "risk=" + (r.disease_risk || r.weather_risk || r.pest_risk || "N/A") + ", " +
          "action=" + (r.recommended_action || r.irrigate_today || r.recommendation || "none");
      })
      .join("; ");

    // Build fusion prompt
    const prompt =
      "You are the AgriMind Core Reasoning Engine.\n" +
      "Fuse these 8 specialist agent outputs into unified farm intelligence.\n\n" +
      "AGENT SUMMARIES:\n" + agentSummary + "\n\n" +
      "AGENT DETAILS: " + agentDetails + "\n\n" +
      "Return ONLY valid JSON (no backticks, no markdown):\n" +
      "{" +
        "\"overall_risk\":\"HIGH or MODERATE or LOW\"," +
        "\"risk_score\":0," +
        "\"state_assessment\":\"2 sentences about current farm state\"," +
        "\"predicted_future\":\"what will happen in next 7 days\"," +
        "\"top_threat\":\"single biggest threat right now\"," +
        "\"top_opportunity\":\"single best opportunity right now\"," +
        "\"immediate_action\":\"do this in next 24 hours\"," +
        "\"this_week\":\"do this over next 7 days\"," +
        "\"dimension_scores\":{" +
          "\"weather\":0," +
          "\"disease\":0," +
          "\"crop\":0," +
          "\"market\":0," +
          "\"research\":0," +
          "\"pest\":0," +
          "\"finance\":0," +
          "\"sensor\":0" +
        "}," +
        "\"correlations\":[\"insight 1\",\"insight 2\",\"insight 3\"]," +
        "\"confidence\":0," +
        "\"executive_summary\":\"3 sentences maximum\"" +
      "}";

    // Run core fusion
    const fusion = await callGemini(
      "You are the AgriMind Core Reasoning Engine. " +
      "Fuse all agent intelligence into a unified actionable farm report. " +
      "Respond ONLY with valid JSON. No markdown, no backticks, no explanation.",
      prompt
    );

    // Save to Supabase health_scores if farm_id provided
    if (farm_id) {
      const { error: dbError } = await sb.from("health_scores").insert({
        farm_id,
        score:        Math.max(0, 100 - (fusion.risk_score || 0)),
        risk_level:   (fusion.overall_risk || "low").toLowerCase(),
        risk_score:   fusion.risk_score || 0,
        diseases:     { fusion, agents },
        weather_snapshot: agents.weather || null,
        generated_at: new Date().toISOString(),
      });

      if (dbError) {
        console.error("Supabase write error:", dbError.message);
      }

      // Write HIGH risk alerts to alerts table
      const riskLevel = (fusion.overall_risk || "").toUpperCase();
      if (riskLevel === "HIGH" || riskLevel === "MODERATE") {
        await sb.from("alerts").insert({
          farm_id,
          severity:    riskLevel === "HIGH" ? "high" : "moderate",
          category:    "core_engine",
          title:       "Core Engine: " + riskLevel + " RISK DETECTED",
          description: fusion.immediate_action || fusion.executive_summary,
          source_data: fusion,
          triggered_at: new Date().toISOString(),
          dismissed:   false,
          acted_upon:  false,
        });
      }
    }

    return Response.json({
      success: true,
      farm_id: farm_id || null,
      fusion,
      agents_fused: Object.keys(agents).length,
      timestamp: new Date().toISOString(),
    });

  } catch (error) {
    console.error("Core Engine error:", error);
    return Response.json(
      { error: error.message },
      { status: 500 }
    );
  }
}

// ─── GET: health check ─────────────────────────────────────────────
export async function GET() {
  return Response.json({
    engine: "AgriMind Core Engine",
    layer: 6,
    status: "ready",
    description: "POST with { farm_id, agents } to run core fusion",
    example_body: {
      farm_id: "uuid-from-farm-profiles-table",
      agents: {
        weather:    { summary: "...", confidence: 85, weather_risk: "MODERATE" },
        disease:    { summary: "...", confidence: 88, disease_risk: "HIGH" },
        irrigation: { summary: "...", confidence: 91, irrigate_today: "no" },
        market:     { summary: "...", confidence: 76, price_trend: "rising" },
        crop:       { summary: "...", confidence: 85, days_to_harvest: 19 },
        research:   { summary: "...", confidence: 93, kephis_advisory: "..." },
        pest:       { summary: "...", confidence: 79, pest_risk: "LOW" },
        finance:    { summary: "...", confidence: 84, intervention_roi: "340%" },
      },
    },
  });
}

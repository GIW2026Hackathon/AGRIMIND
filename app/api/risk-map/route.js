import { getServerSupabase } from "@/lib/server-supabase";
 
export async function GET() {
  const sb = getServerSupabase();
  const { data: farms } = await sb
    .from("farm_profiles")
    .select("id, farm_name, county, lat, lon");
 
  const { data: healthScores } = await sb
    .from("health_scores")
    .select("farm_id, risk_score, risk_level")
    .order("generated_at", { ascending: false });
 
  // Map latest risk score per farm
  const riskByFarm = {};
  (healthScores || []).forEach(h => {
    if (!riskByFarm[h.farm_id]) riskByFarm[h.farm_id] = h;
  });
 
  // Aggregate risk by county
  const countyRisk = {};
  (farms || []).forEach(f => {
    const risk = riskByFarm[f.id]?.risk_score || 0;
    if (!countyRisk[f.county]) countyRisk[f.county] = { total: 0, count: 0, lat: f.lat, lon: f.lon };
    countyRisk[f.county].total += risk;
    countyRisk[f.county].count += 1;
  });
 
  const counties = Object.entries(countyRisk).map(([county, d]) => {
    const avg = d.total / d.count;
    const risk = avg >= 80 ? "very-high" : avg >= 60 ? "high" : avg >= 40 ? "moderate" : avg >= 20 ? "low" : "very-low";
    return { name: county, avgRisk: Math.round(avg), risk, farmCount: d.count, lat: d.lat, lon: d.lon };
  });
 
  return Response.json({ counties });
}
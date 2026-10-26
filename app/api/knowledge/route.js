import { getServerSupabase } from "@/lib/server-supabase";

export async function GET() {
  try {
    const supabase = getServerSupabase();
    // Fetch all entities in parallel
    const [
      { data: farms },
      { data: crops },
      { data: diseases },
      { data: weather },
      { data: alerts },
      { data: interventions },
    ] = await Promise.all([
      supabase.from("farm_profiles").select("id,farm_name,farmer_name,county,subcounty,lat,lon,primary_crop,size_ha,elevation_band"),
      supabase.from("crop_records").select("id,farm_id,crop_type,variety,growth_stage,planted_at,expected_harvest,area_ha"),
      supabase.from("disease_history").select("id,farm_id,crop_record_id,disease_name,pathogen_type,severity,confirmed,reported_at,county,weather_snapshot"),
      supabase.from("weather_readings").select("id,county,temperature_c,humidity_pct,rainfall_mm,wind_speed_kmh,season,recorded_at").order("recorded_at", { ascending: false }).limit(10),
      supabase.from("alerts").select("id,farm_id,severity,category,title,triggered_at"),
      supabase.from("intervention_outcomes").select("id,farm_id,disease_id,action_type,outcome,applied_at"),
    ]);

    // ── Build nodes ───────────────────────────────────────
    const nodes = [];
    const edges = [];

    // County node (shared)
    nodes.push({
      id: "county_nakuru",
      type: "county",
      label: "Nakuru County",
      data: { farms: farms?.length || 0 },
    });

    // Farm nodes
    farms?.forEach(f => {
      nodes.push({
        id: "farm_" + f.id,
        type: "farm",
        label: f.farm_name,
        data: f,
      });
      // Farm → County
      edges.push({
        id: "e_farm_county_" + f.id,
        source: "farm_" + f.id,
        target: "county_nakuru",
        label: "located in",
      });
    });

    // Crop nodes
    crops?.forEach(c => {
      nodes.push({
        id: "crop_" + c.id,
        type: "crop",
        label: c.crop_type,
        data: c,
      });
      // Farm → Crop
      edges.push({
        id: "e_farm_crop_" + c.id,
        source: "farm_" + c.farm_id,
        target: "crop_" + c.id,
        label: "grows",
      });
    });

    // Disease nodes
    const diseaseMap = {};
    diseases?.forEach(d => {
      const key = "disease_" + d.disease_name.replace(/\s/g, "_").toLowerCase();
      if (!diseaseMap[key]) {
        diseaseMap[key] = {
          id: key,
          type: "disease",
          label: d.disease_name,
          data: { pathogen_type: d.pathogen_type, count: 0, severity: d.severity },
        };
        nodes.push(diseaseMap[key]);
      }
      diseaseMap[key].data.count++;

      // Crop → Disease
      edges.push({
        id: "e_crop_disease_" + d.id,
        source: "crop_" + d.crop_record_id,
        target: key,
        label: "shows",
      });
    });

    // Weather node
    if (weather && weather.length > 0) {
      const latest = weather[0];
      nodes.push({
        id: "weather_nakuru",
        type: "weather",
        label: "Live Weather",
        data: latest,
      });
      // County → Weather
      edges.push({
        id: "e_county_weather",
        source: "county_nakuru",
        target: "weather_nakuru",
        label: "conditions",
      });
    }

    // ── Summary stats ─────────────────────────────────────
    const summary = {
      totalFarms:     farms?.length || 0,
      totalCrops:     crops?.length || 0,
      totalDiseases:  Object.keys(diseaseMap).length,
      totalWeather:   weather?.length || 0,
      totalAlerts:    alerts?.length || 0,
      highRiskFarms:  diseases?.filter(d => d.severity === "high").length || 0,
      nodes:          nodes.length,
      edges:          edges.length,
    };

    return Response.json({ nodes, edges, summary });

  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}
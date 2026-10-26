export async function POST(request) {
  const { raw_id } = await request.json();

  const { data: raw } = await sb
    .from("raw_ingestion")
    .select("*")
    .eq("id", raw_id)
    .single();

  const payload = raw.raw_payload;

  const errors = validate(payload, raw.source_id);

  if (errors.length > 0) {
    await sb
      .from("raw_ingestion")
      .update({
        status: "failed",
        error_msg: errors.join(", ")
      })
      .eq("id", raw_id);

    return Response.json({
      status: "failed",
      errors
    });
  }

  const normalized = normalize(payload);

  if (raw.source_id === "weather") {
    await sb.from("weather_readings").insert({
      source_id: raw.source_id,
      temperature_c: normalized.temperature_c,
      humidity_pct: normalized.humidity_pct,
      rainfall_mm: normalized.rainfall_mm || 0,
      wind_speed_kmh: normalized.wind_speed_kmh || 0,
      county: normalized.county || "Nakuru",
      lat: normalized.lat,
      lon: normalized.lon,
      recorded_at: normalized.recorded_at,
      hour_of_day: normalized.hour_of_day,
      season: normalized.season,
      raw_id: raw_id
    });
  }

  await sb
    .from("raw_ingestion")
    .update({
      status: "normalized",
      pipeline_step: "geotag"
    })
    .eq("id", raw_id);

  return Response.json({
    status: "success",
    normalized
  });
}
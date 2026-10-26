import { getServerSupabase } from "@/lib/server-supabase";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const city = searchParams.get("city") || "Kisii, Kenya";
  const apiKey = process.env.OPENWEATHER_KEY;
  const baseUrl = "https://api.openweathermap.org/data/2.5";

  if (!apiKey) {
    return Response.json({ error: "Weather is not configured. Add OPENWEATHER_KEY to .env.local." }, { status: 503 });
  }

  let current;
  let forecast;
  try {
    const [currentResponse, forecastResponse] = await Promise.all([
      fetch(`${baseUrl}/weather?q=${encodeURIComponent(city)}&appid=${apiKey}&units=metric`),
      fetch(`${baseUrl}/forecast?q=${encodeURIComponent(city)}&appid=${apiKey}&units=metric&cnt=40`),
    ]);

    current = await currentResponse.json();
    forecast = await forecastResponse.json();

    if (!currentResponse.ok) {
      return Response.json({ error: current.message || "Unable to load current weather." }, { status: currentResponse.status });
    }
    if (!forecastResponse.ok) {
      return Response.json({ error: forecast.message || "Unable to load the weather forecast." }, { status: forecastResponse.status });
    }
  } catch (error) {
    console.error("OpenWeather request failed:", error);
    return Response.json({ error: "Could not reach the weather service." }, { status: 502 });
  }

  const month = new Date().getMonth() + 1;
  const season =
    month >= 3 && month <= 5  ? "long_rains"  :
    month >= 10 && month <= 12 ? "short_rains" :
    month >= 6 && month <= 9  ? "cool_dry"    : "hot_dry";

  const hourOfDay = (new Date().getUTCHours() + 3) % 24;

  if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_KEY) {
    try {
      const supabase = getServerSupabase();
      const { error: dbError } = await supabase
        .from("weather_readings")
        .insert({
          source_id:      "weather",
          county:         city.split(",")[0].trim(),
          lat:            current.coord.lat,
          lon:            current.coord.lon,
          temperature_c:  Math.round(current.main.temp * 10) / 10,
          humidity_pct:   current.main.humidity,
          rainfall_mm:    current.rain?.["1h"] || 0,
          wind_speed_kmh: Math.round(current.wind.speed * 3.6 * 10) / 10,
          wind_direction: current.wind.deg?.toString(),
          pressure_hpa:   current.main.pressure,
          description:    current.weather[0].description,
          recorded_at:    new Date().toISOString(),
          utc_offset:     3,
          hour_of_day:    hourOfDay,
          season,
        });

      if (dbError) {
        console.error("Supabase weather write failed:", dbError.message);
      }
    } catch (error) {
      console.error("Supabase weather write failed:", error);
    }
  }

  return Response.json({ current, forecast });
}
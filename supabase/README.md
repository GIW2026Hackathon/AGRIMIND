# AgriMind database

The initial migration creates the Supabase Postgres tables currently queried or
written by the application. A new database will have an empty schema; it will
not contain demo farms or fabricated observations.

## Create the database

1. Create a Supabase project and open **SQL Editor**.
2. Run the SQL in `migrations/202610260001_initial_schema.sql`.
3. Copy the project URL and API keys from the Supabase project settings into
   the matching variables in the root `.env.local`.
4. Keep `SUPABASE_SERVICE_KEY` server-side only. Never add it to a
   `NEXT_PUBLIC_` variable or expose it in browser code.
5. Restart the Next.js dev server after changing environment variables.

The app's server routes use the service-role key, so they can access these
tables. Row-level security is enabled with no browser-facing policies by
default. Add policies tied to `auth.uid()` before allowing users to access
Supabase directly from a browser.

## Tables

- `farm_profiles`: farm identity, location, farmer and land details.
- `crop_records`: crops planted and their varieties, stages and dates.
- `disease_history`: disease observations linked to a farm and optionally a
  crop record.
- `weather_readings`: weather measurements by county and timestamp.
- `raw_ingestion`: original source payloads and ingestion pipeline status.
- `health_scores`: AI-generated farm health and risk snapshots.
- `alerts`: risk notifications and their dismissed/actioned state.
- `intervention_outcomes`: farm actions and recorded outcomes.

Weather readings can be fetched without Supabase configured. They are saved
to the database only when the Supabase URL and service key are configured.

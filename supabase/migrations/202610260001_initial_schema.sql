create table public.farm_profiles (
  id uuid primary key default gen_random_uuid(),
  farmer_id uuid references auth.users(id) on delete set null,
  farm_name text not null,
  farmer_name text not null,
  county text not null,
  subcounty text,
  lat double precision,
  lon double precision,
  primary_crop text,
  size_ha numeric(10, 2) check (size_ha is null or size_ha > 0),
  elevation_band text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (lat is null or lat between -90 and 90),
  check (lon is null or lon between -180 and 180)
);

create table public.crop_records (
  id uuid primary key default gen_random_uuid(),
  farm_id uuid not null references public.farm_profiles(id) on delete cascade,
  crop_type text not null,
  variety text,
  growth_stage text,
  planted_at date,
  expected_harvest date,
  area_ha numeric(10, 2) check (area_ha is null or area_ha > 0),
  created_at timestamptz not null default now(),
  check (expected_harvest is null or planted_at is null or expected_harvest >= planted_at)
);

create table public.raw_ingestion (
  id uuid primary key default gen_random_uuid(),
  source_id text not null,
  raw_payload jsonb not null,
  status text not null default 'pending'
    check (status in ('pending', 'processing', 'normalized', 'failed')),
  pipeline_step text not null default 'collect',
  error_msg text,
  created_at timestamptz not null default now(),
  processed_at timestamptz
);

create table public.weather_readings (
  id uuid primary key default gen_random_uuid(),
  source_id text not null,
  raw_id uuid references public.raw_ingestion(id) on delete set null,
  county text not null,
  lat double precision,
  lon double precision,
  temperature_c numeric(6, 2),
  humidity_pct numeric(5, 2) check (humidity_pct is null or humidity_pct between 0 and 100),
  rainfall_mm numeric(8, 2) not null default 0 check (rainfall_mm >= 0),
  wind_speed_kmh numeric(7, 2) not null default 0 check (wind_speed_kmh >= 0),
  wind_direction text,
  pressure_hpa numeric(7, 2),
  description text,
  recorded_at timestamptz not null default now(),
  utc_offset smallint,
  hour_of_day smallint check (hour_of_day is null or hour_of_day between 0 and 23),
  season text,
  check (lat is null or lat between -90 and 90),
  check (lon is null or lon between -180 and 180)
);

create table public.disease_history (
  id uuid primary key default gen_random_uuid(),
  farm_id uuid not null references public.farm_profiles(id) on delete cascade,
  crop_record_id uuid references public.crop_records(id) on delete set null,
  disease_name text not null,
  pathogen_type text,
  severity text not null default 'moderate'
    check (severity in ('low', 'moderate', 'high')),
  confirmed boolean not null default false,
  reported_at timestamptz not null default now(),
  county text,
  weather_snapshot jsonb not null default '{}'::jsonb,
  notes text,
  created_at timestamptz not null default now()
);

create table public.health_scores (
  id uuid primary key default gen_random_uuid(),
  farm_id uuid not null references public.farm_profiles(id) on delete cascade,
  score numeric(5, 2) not null check (score between 0 and 100),
  risk_level text not null check (risk_level in ('low', 'moderate', 'high')),
  risk_score numeric(5, 2) not null check (risk_score between 0 and 100),
  diseases jsonb not null default '{}'::jsonb,
  weather_snapshot jsonb not null default '{}'::jsonb,
  generated_at timestamptz not null default now()
);

create table public.alerts (
  id uuid primary key default gen_random_uuid(),
  farm_id uuid references public.farm_profiles(id) on delete cascade,
  severity text not null check (severity in ('low', 'moderate', 'high', 'info')),
  category text not null,
  title text not null,
  description text,
  source_data jsonb not null default '{}'::jsonb,
  triggered_at timestamptz not null default now(),
  dismissed boolean not null default false,
  acted_upon boolean not null default false,
  created_at timestamptz not null default now()
);

create table public.intervention_outcomes (
  id uuid primary key default gen_random_uuid(),
  farm_id uuid not null references public.farm_profiles(id) on delete cascade,
  disease_id uuid references public.disease_history(id) on delete set null,
  action_type text not null,
  outcome text,
  applied_at timestamptz,
  notes text,
  created_at timestamptz not null default now()
);

create index crop_records_farm_id_idx on public.crop_records(farm_id);
create index disease_history_farm_id_idx on public.disease_history(farm_id);
create index disease_history_crop_record_id_idx on public.disease_history(crop_record_id);
create index raw_ingestion_status_created_at_idx on public.raw_ingestion(status, created_at desc);
create index weather_readings_county_recorded_at_idx on public.weather_readings(county, recorded_at desc);
create index weather_readings_raw_id_idx on public.weather_readings(raw_id);
create index health_scores_farm_generated_at_idx on public.health_scores(farm_id, generated_at desc);
create index alerts_farm_triggered_at_idx on public.alerts(farm_id, triggered_at desc);
create index intervention_outcomes_farm_id_idx on public.intervention_outcomes(farm_id);

create function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger farm_profiles_set_updated_at
before update on public.farm_profiles
for each row execute function public.set_updated_at();

alter table public.farm_profiles enable row level security;
alter table public.crop_records enable row level security;
alter table public.raw_ingestion enable row level security;
alter table public.weather_readings enable row level security;
alter table public.disease_history enable row level security;
alter table public.health_scores enable row level security;
alter table public.alerts enable row level security;
alter table public.intervention_outcomes enable row level security;

grant all on public.farm_profiles to service_role;
grant all on public.crop_records to service_role;
grant all on public.raw_ingestion to service_role;
grant all on public.weather_readings to service_role;
grant all on public.disease_history to service_role;
grant all on public.health_scores to service_role;
grant all on public.alerts to service_role;
grant all on public.intervention_outcomes to service_role;

create extension if not exists "pgcrypto";

--
-- Tournaments
--
create table if not exists tournaments (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,
  location text,
  format text,
  start_date date,
  end_date date,
  created_by uuid references auth.users(id),
  created_at timestamptz default now()
);

--
-- Teams
--
create table if not exists teams (
  id uuid primary key default gen_random_uuid(),
  tournament_id uuid not null references tournaments(id) on delete cascade,
  name text not null,
  members jsonb not null default '[]'::jsonb, -- array of { name, email }
  created_by uuid references auth.users(id),
  created_at timestamptz default now()
);

--
-- Rounds
--
create table if not exists rounds (
  id uuid primary key default gen_random_uuid(),
  tournament_id uuid not null references tournaments(id) on delete cascade,
  round_number int not null,
  created_by uuid references auth.users(id),
  created_at timestamptz default now()
);

--
-- Pairings (draws)
-- store team references by id for integrity
--
create table if not exists pairings (
  id uuid primary key default gen_random_uuid(),
  round_id uuid not null references rounds(id) on delete cascade,
  room text,
  affirmative_team_id uuid references teams(id),
  negative_team_id uuid references teams(id),
  adjudicator text,
  created_at timestamptz default now()
);

--
-- Indexes (helpful)
--
create index if not exists idx_tournaments_slug on tournaments(slug);
create index if not exists idx_teams_tournament on teams(tournament_id);
create index if not exists idx_rounds_tournament on rounds(tournament_id);
create index if not exists idx_pairings_round on pairings(round_id);

--
-- Row Level Security (enable then create starter policies)
--
alter table tournaments enable row level security;
alter table teams enable row level security;
alter table rounds enable row level security;
alter table pairings enable row level security;

-- Tournaments policies
create policy "Public read tournaments" on tournaments
  for select using (true);

create policy "Auth insert tournaments" on tournaments
  for insert with check (auth.role() = 'authenticated');

create policy "Owner update tournaments" on tournaments
  for update using (created_by = auth.uid()) with check (created_by = auth.uid());

create policy "Owner delete tournaments" on tournaments
  for delete using (created_by = auth.uid());

-- Teams policies
create policy "Public read teams" on teams
  for select using (true);

create policy "Auth insert teams" on teams
  for insert with check (auth.role() = 'authenticated');

create policy "Owner update teams" on teams
  for update using (created_by = auth.uid()) with check (created_by = auth.uid());

create policy "Owner delete teams" on teams
  for delete using (created_by = auth.uid());

-- Rounds policies
create policy "Public read rounds" on rounds
  for select using (true);

create policy "Auth insert rounds" on rounds
  for insert with check (auth.role() = 'authenticated');

create policy "Owner update rounds" on rounds
  for update using (created_by = auth.uid()) with check (created_by = auth.uid());

create policy "Owner delete rounds" on rounds
  for delete using (created_by = auth.uid());

-- Pairings policies
create policy "Public read pairings" on pairings
  for select using (true);

create policy "Auth insert pairings" on pairings
  for insert with check (auth.role() = 'authenticated');

create policy "Owner update pairings" on pairings
  for update using (true) with check (true); -- tune as needed

create policy "Owner delete pairings" on pairings
  for delete using (true); -- tune as needed

--
-- Example: lightweight standings view (optional)
-- Replace/extend with real aggregation logic for your scoring system
--
drop view if exists standings_view;

create view standings_view as
select
  t.id as team_id,
  t.tournament_id,
  t.name as team_name,
  jsonb_array_length(t.members) as members_count,
  0::int as wins,   -- placeholder, populate with proper aggregation
  0::int as losses, -- placeholder
  0::int as draws,  -- placeholder
  0::int as points  -- placeholder
from teams t;

-- Migration to update tournaments table to match form fields
-- Run this in your Supabase SQL Editor

-- Drop the old tournaments table and recreate with new schema
-- WARNING: This will delete existing tournament data. If you have data you want to keep,
-- you should first export it and then re-insert it after the migration.

DROP TABLE IF EXISTS pairings CASCADE;
DROP TABLE IF EXISTS rounds CASCADE;
DROP TABLE IF EXISTS teams CASCADE;
DROP TABLE IF EXISTS tournaments CASCADE;
DROP VIEW IF EXISTS standings_view;

-- Recreate tournaments table with new schema
create table tournaments (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,
  date date,
  time time,
  rounds int not null,
  out_rounds int not null default 0,
  members_per_team int not null,
  created_by uuid references auth.users(id),
  created_at timestamptz default now()
);

-- Recreate teams table (no changes)
create table teams (
  id uuid primary key default gen_random_uuid(),
  tournament_id uuid not null references tournaments(id) on delete cascade,
  name text not null,
  members jsonb not null default '[]'::jsonb,
  created_by uuid references auth.users(id),
  created_at timestamptz default now()
);

-- Recreate rounds table (no changes)
create table rounds (
  id uuid primary key default gen_random_uuid(),
  tournament_id uuid not null references tournaments(id) on delete cascade,
  round_number int not null,
  created_by uuid references auth.users(id),
  created_at timestamptz default now()
);

-- Recreate pairings table (no changes)
create table pairings (
  id uuid primary key default gen_random_uuid(),
  round_id uuid not null references rounds(id) on delete cascade,
  room text,
  affirmative_team_id uuid references teams(id),
  negative_team_id uuid references teams(id),
  adjudicator text,
  created_at timestamptz default now()
);

-- Recreate indexes
create index idx_tournaments_slug on tournaments(slug);
create index idx_teams_tournament on teams(tournament_id);
create index idx_rounds_tournament on rounds(tournament_id);
create index idx_pairings_round on pairings(round_id);

-- Enable RLS
alter table tournaments enable row level security;
alter table teams enable row level security;
alter table rounds enable row level security;
alter table pairings enable row level security;

-- Recreate RLS policies
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
  for update using (true) with check (true);

create policy "Owner delete pairings" on pairings
  for delete using (true);

-- Recreate standings view
create view standings_view as
select
  t.id as team_id,
  t.tournament_id,
  t.name as team_name,
  jsonb_array_length(t.members) as members_count,
  0::int as wins,
  0::int as losses,
  0::int as draws,
  0::int as points
from teams t;

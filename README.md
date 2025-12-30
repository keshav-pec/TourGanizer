# TourGanizer

Modern tournament management (Vite + React) with Supabase-ready auth, data, and storage. Organized around organizer-friendly flows: create tournaments, manage rounds, record results, and view standings.

## Features
- 🏠 **Home/Login**: Auth scaffold (Supabase-ready) with username-based routing
- 🗂️ **Organizer Dashboard**: View recent tournaments and navigate to tournament dashboards
- 🏆 **Tournament Dashboard** (`/tournament/:slug`): Info tab with tournament meta and registered teams
- 📅 **Rounds (Draws)** (`/tournament/:slug/rounds`): Round listing/table ready for Supabase-fed draws
- 📊 **Standings** (`/tournament/:slug/standings`): Standings table with export hook placeholder
- 📝 **Create Tournament**: Dynamic form with teams/members, draft + payment CTA hooks
- 📱 **Responsive UI**: Navbar/footer, consistent layout, mobile-friendly spacing

## Quick Start
```bash
npm install
npm run dev   # http://localhost:5173

# Production
npm run build
npm run preview
```

## Project Structure
```
src/
├── contexts/
│   └── AuthContext.jsx      # Supabase-ready hooks (replace stubs)
├── lib/                     # (create) supabase.js client
├── pages/
│   ├── HomePage.jsx
│   ├── LoginPage.jsx
│   ├── TournamentsPage.jsx
│   ├── CreateTournamentPage.jsx
│   ├── TournamentDashboard.jsx
│   ├── DrawPage.jsx
│   ├── ResultsPage.jsx
│   └── StandingsPage.jsx
├── styles/
│   └── index.css
├── App.jsx
└── main.jsx
```

## Supabase Integration Guide

### 1) Install client
```bash
npm install @supabase/supabase-js
```

### 2) Configure environment
Create `.env` (or `.env.local`) at repo root:
```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-public-anon-key
```

### 3) Create client helper
`src/lib/supabase.js`
```js
import { createClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL
const key = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(url, key)
```

### 4) Wire AuthContext (replace stubs)
`src/contexts/AuthContext.jsx`
```js
import { supabase } from '../lib/supabase'

async function signUp(email, password) {
  const { data, error } = await supabase.auth.signUp({ email, password })
  if (error) throw error
  return data
}

async function signIn(email, password) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password })
  if (error) throw error
  return data
}

async function signOut() {
  const { error } = await supabase.auth.signOut()
  if (error) throw error
}

// In useEffect, keep user in sync
useEffect(() => {
  const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
    setUser(session?.user ?? null)
  })
  return () => listener.subscription.unsubscribe()
}, [])
```

### 5) Minimal database schema
```sql
-- tournaments
create table if not exists tournaments (
  id uuid primary key default uuid_generate_v4(),
  slug text unique not null,
  name text not null,
  location text,
  start_date date,
  end_date date,
  created_by uuid references auth.users(id),
  created_at timestamp with time zone default now()
);

-- teams
create table if not exists teams (
  id uuid primary key default uuid_generate_v4(),
  tournament_id uuid references tournaments(id) on delete cascade,
  name text not null,
  members jsonb not null default '[]'::jsonb,
  status text default 'confirmed',
  created_at timestamp with time zone default now()
);

-- rounds
create table if not exists rounds (
  id uuid primary key default uuid_generate_v4(),
  tournament_id uuid references tournaments(id) on delete cascade,
  round_number int not null,
  created_at timestamp with time zone default now()
);

-- pairings (draws)
create table if not exists pairings (
  id uuid primary key default uuid_generate_v4(),
  round_id uuid references rounds(id) on delete cascade,
  room text,
  affirmative text,
  negative text,
  adjudicator text,
  created_at timestamp with time zone default now()
);

alter table tournaments enable row level security;
alter table teams enable row level security;
alter table rounds enable row level security;
alter table pairings enable row level security;

-- RLS policies (starter)
create policy "Public read tournaments" on tournaments for select using (true);
create policy "Auth insert tournaments" on tournaments for insert with check (auth.role() = 'authenticated');
create policy "Public read teams" on teams for select using (true);
create policy "Auth insert teams" on teams for insert with check (auth.role() = 'authenticated');
create policy "Public read rounds" on rounds for select using (true);
create policy "Auth insert rounds" on rounds for insert with check (auth.role() = 'authenticated');
create policy "Public read pairings" on pairings for select using (true);
create policy "Auth insert pairings" on pairings for insert with check (auth.role() = 'authenticated');
```

### 6) Replace mock data calls (examples)
- `TournamentsPage.jsx`: fetch tournaments
```js
const { data, error } = await supabase.from('tournaments').select('*').order('created_at', { ascending: false })
if (error) throw error
setTournaments(data)
```

- `TournamentDashboard.jsx`: fetch tournament + teams
```js
const { data: tournament } = await supabase
  .from('tournaments')
  .select('*')
  .eq('slug', slug)
  .single()

const { data: teams } = await supabase
  .from('teams')
  .select('name, members, status')
  .eq('tournament_id', tournament.id)
```

- `DrawPage.jsx`: fetch rounds + pairings
```js
const { data: rounds } = await supabase
  .from('rounds')
  .select('id, round_number, pairings:pairings(*)')
  .eq('tournament_id', tournament.id)
  .order('round_number')
```

- `StandingsPage.jsx`: fetch standings view/materialized view
```js
const { data: standings } = await supabase
  .from('standings_view')
  .select('*')
  .eq('tournament_id', tournament.id)
  .order('rank')
```

### 7) Common gotchas
- Ensure `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` exist in your env and hosting platform
- Enable RLS on every table; add policies before testing inserts/selects
- Use `slug` as the public identifier; keep `id` as internal
- For local dev on Vite, restart after env changes

## Tech Stack
- Frontend: Vite + React 18
- Router: React Router v6 (username + tournament slug routes)
- Styles: Custom CSS (responsive, navbar/footer shared)
- Backend: Supabase (Postgres, Auth, Storage-ready)

## Deployment
- Frontend: `npm run build` then deploy `dist/` (Vercel/Netlify)
- Env vars on host: `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`
- Supabase: push SQL schema (SQL Editor) and configure RLS

## License
MIT

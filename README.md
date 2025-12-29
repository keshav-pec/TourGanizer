# TourGanizer

A modern tournament management system built with Vite + React, designed to be connected with Supabase for backend, authentication, and database.

## Features

- 🏆 **Tournament Management** — Create and manage multiple tournaments
- 🎯 **Draw Generation** — Automated pairing with conflict resolution
- 📊 **Results & Standings** — Real-time standings and comprehensive tracking
- 👥 **Team & Adjudicator Management** — Complete participant tracking
- 🔐 **Authentication Ready** — Pluggable auth context (stub included, Supabase-ready)

## Quick Start

### Install dependencies
```bash
npm install
```

### Run development server
```bash
npm run dev
```

Visit `http://localhost:5173`

### Build for production
```bash
npm run build
npm run preview
```

## Project Structure

```
src/
├── components/       # Reusable UI components
│   └── Layout.jsx   # Main app layout with nav
├── contexts/        # React contexts
│   └── AuthContext.jsx  # Auth provider (stub, Supabase-ready)
├── pages/           # Route pages
│   ├── HomePage.jsx
│   ├── LoginPage.jsx
│   ├── TournamentsPage.jsx
│   ├── CreateTournamentPage.jsx
│   ├── TournamentDashboard.jsx
│   ├── DrawPage.jsx
│   ├── ResultsPage.jsx
│   └── StandingsPage.jsx
├── styles/
│   └── index.css    # Global styles
├── App.jsx          # Main app with routing
└── main.jsx         # Entry point
```

## Connecting Supabase

### 1. Install Supabase client
```bash
npm install @supabase/supabase-js
```

### 2. Create `.env` file
```bash
cp .env.example .env
```

Fill in your Supabase credentials:
```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-public-anon-key
```

### 3. Initialize Supabase client

Create `src/lib/supabase.js`:
```js
import { createClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL
const key = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(url, key)
```

### 4. Update AuthContext

Replace the stub methods in `src/contexts/AuthContext.jsx`:
```js
import { supabase } from '../lib/supabase'

// In signUp:
const { data, error } = await supabase.auth.signUp({ email, password })

// In signIn:
const { data, error } = await supabase.auth.signInWithPassword({ email, password })

// In signOut:
await supabase.auth.signOut()

// Subscribe to auth changes in useEffect:
supabase.auth.onAuthStateChange((_event, session) => {
  setUser(session?.user ?? null)
})
```

### 5. Database Schema (example)

```sql
-- Tournaments table
create table tournaments (
  id uuid default uuid_generate_v4() primary key,
  slug text unique not null,
  name text not null,
  location text,
  date date,
  created_by uuid references auth.users(id),
  created_at timestamp default now()
);

-- Enable RLS
alter table tournaments enable row level security;

-- Policy: anyone can read, authenticated can create
create policy "Public tournaments are viewable by anyone"
  on tournaments for select using (true);

create policy "Authenticated users can create tournaments"
  on tournaments for insert with check (auth.role() = 'authenticated');
```

### 6. Replace mock data fetches

In pages like `TournamentsPage.jsx`, replace:
```js
// OLD: setTournaments(mockTournaments)

// NEW:
const { data, error } = await supabase.from('tournaments').select('*')
if (data) setTournaments(data)
```

## Tech Stack

- **Frontend**: Vite + React 18
- **Routing**: React Router v6
- **Styling**: Custom CSS (modern, responsive)
- **Backend** (when ready): Supabase (Postgres + Auth + Storage)
- **Deployment**: Vercel / Netlify (frontend) + Supabase (backend)

## Development Notes

- All auth functions are stubbed with localStorage — swap for Supabase when ready
- Mock data is used throughout — replace with Supabase queries
- RLS policies should enforce data access on the server side
- Pages are fully responsive and accessibility-ready

## Deployment

### Frontend (Vercel/Netlify)
```bash
npm run build
# Deploy dist/ folder
```

### Environment Variables
Set `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` in your hosting platform.

## License

MIT

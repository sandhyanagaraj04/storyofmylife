# Aeon — Story of my life

> Your life, mapped — second by second.

Aeon turns a single fact — your **date of birth** — into a living, navigable
autobiography. The past is a timeline you can zoom into (Year → Month → Day);
the future is a **vision board** of milestones, each split into what you
already *have* and what's still *pending*.

This is the **Phase 1** build (Capture & Dream), implemented as a
React + Vite + TypeScript app that matches `aeon-prototype.html` exactly —
glassmorphism + aurora design system, all five flows, and local persistence.

## Stack

- **React 18 + Vite + TypeScript**
- **Zustand** over an in-memory document, persisted through a `Backend`
  abstraction (`src/backend.ts`) — `LocalBackend` (`localStorage`) or
  `SupabaseBackend` (normalized Postgres tables).
- **Supabase** for email/password auth + per-user data with Row-Level
  Security. Optional: with no env vars set, the app runs in local-only mode.
- **React Router** — `/login`, `/`, `/timeline`, `/year/:y`, `/year/:y/:m`,
  `/year/:y/:m/:d`, `/vision`, `/milestone/:id`.
- Design tokens as CSS variables in `src/index.css`; conic-gradient rings /
  gradient bars (no chart lib).

## Two modes

| | Local mode | Cloud mode |
|---|---|---|
| Trigger | no Supabase env vars | `VITE_SUPABASE_URL` + `VITE_SUPABASE_ANON_KEY` set |
| Auth | none — straight to onboarding | email + password login required |
| Storage | browser `localStorage` | Supabase Postgres, per user, RLS-protected |

## Cloud setup (login + server data)

1. Create a free project at [supabase.com](https://supabase.com).
2. **SQL Editor → New query** → paste all of [`supabase/schema.sql`](./supabase/schema.sql) → **Run**.
   (Creates `profiles`, `milestones`, `requirements`, `entries`, RLS policies,
   and a trigger that auto-creates a profile on signup.)
3. **Authentication → Providers → Email**: for instant signup without an email
   round-trip, turn **off** "Confirm email" (optional, but smoother for a demo).
4. **Settings → API**: copy the **Project URL** and the **anon public** key.
5. Put them in `.env.local` (see `.env.example`) for local dev, and add the
   same two vars in **Vercel → Project → Settings → Environment Variables**
   for production. Redeploy.

The anon key is publishable (safe in the browser); RLS is what keeps each
user's data private.

## Flows

0. **Login** (`/login`, cloud mode) — email + password sign-in / signup.
1. **Onboarding** (`/`) — name + DOB + place → generates the timeline.
2. **Life Timeline** (`/timeline`) — 90-cell year grid with age labels,
   lived / this-year / ahead colouring, and gold milestone markers.
3. **Drill** (`/year/...`) — Year → Month → Day, with timestamped entry
   logging and keyword auto-classification (`guessCat`).
4. **Vision Board** (`/vision`) — 15 horizons, 6 category filters,
   milestone cards with live progress, and a New Milestone modal.
5. **Milestone detail** (`/milestone/:id`) — progress ring + Have/Pending
   columns; ticking a pending item moves it to Have and recomputes progress
   everywhere.

## Develop

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # type-check + production build
npm run preview  # serve the build
```

All data stays in the browser's `localStorage` — single-user, no backend.

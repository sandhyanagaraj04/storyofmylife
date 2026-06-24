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
- **Zustand** over a single JSON document, persisted to `localStorage`
  (key `aeon`) behind a small storage layer so a future sync backend drops in.
- **React Router** — `/`, `/timeline`, `/year/:y`, `/year/:y/:m`,
  `/year/:y/:m/:d`, `/vision`, `/milestone/:id`.
- Design tokens as CSS variables in `src/index.css`; conic-gradient rings /
  gradient bars (no chart lib).

## Flows

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

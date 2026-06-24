-- ============================================================
-- Aeon — Phase 2 schema (normalized, per-user, RLS-protected)
-- Paste this whole file into the Supabase SQL editor and run it.
-- ============================================================

-- 1) PROFILE: 1:1 with auth.users — the "spine" + UI prefs
create table if not exists public.profiles (
  id             uuid primary key references auth.users on delete cascade,
  name           text not null default 'Friend',
  dob            date,
  place          text not null default 'Earth',
  life_span      int  not null default 90,
  active_horizon text not null default '5y',
  active_cat     text not null default 'All',
  created_at     timestamptz not null default now()
);

-- 2) MILESTONES
create table if not exists public.milestones (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null references auth.users on delete cascade,
  title      text not null,
  why        text not null default '',
  cat        text not null,
  hz         text not null,
  created_at timestamptz not null default now()
);
create index if not exists milestones_user_idx on public.milestones(user_id);

-- 3) REQUIREMENTS (the have/need items under a milestone)
create table if not exists public.requirements (
  id           uuid primary key default gen_random_uuid(),
  milestone_id uuid not null references public.milestones on delete cascade,
  user_id      uuid not null references auth.users on delete cascade,
  kind         text not null check (kind in ('have','need')),
  t            text not null,
  d            text not null default '',
  position     int  not null default 0,
  created_at   timestamptz not null default now()
);
create index if not exists requirements_milestone_idx on public.requirements(milestone_id);
create index if not exists requirements_user_idx on public.requirements(user_id);

-- 4) ENTRIES (timeline log; ekey = "Y-M-D" with 0-indexed month)
create table if not exists public.entries (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null references auth.users on delete cascade,
  ekey       text not null,
  time       text not null,
  t          text not null,
  d          text not null default '',
  cat        text not null default '',
  created_at timestamptz not null default now()
);
create index if not exists entries_user_idx on public.entries(user_id);
create index if not exists entries_user_key_idx on public.entries(user_id, ekey);

-- ============================================================
-- Row-Level Security: every row is private to its owner
-- ============================================================
alter table public.profiles     enable row level security;
alter table public.milestones   enable row level security;
alter table public.requirements enable row level security;
alter table public.entries      enable row level security;

-- profiles: owner can do everything to their own row
drop policy if exists "own profile" on public.profiles;
create policy "own profile" on public.profiles
  for all using (auth.uid() = id) with check (auth.uid() = id);

-- milestones / requirements / entries: owner-only via user_id
drop policy if exists "own milestones" on public.milestones;
create policy "own milestones" on public.milestones
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "own requirements" on public.requirements;
create policy "own requirements" on public.requirements
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "own entries" on public.entries;
create policy "own entries" on public.entries
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- ============================================================
-- Auto-create a profile row whenever a new auth user signs up
-- ============================================================
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, name)
  values (new.id, coalesce(new.raw_user_meta_data->>'name', 'Friend'))
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

create table if not exists public.lobby_profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  username text unique not null,
  variant text not null default 'default',
  name_color text not null default '#ffffff',
  created_at timestamptz not null default now(),
  constraint lobby_profiles_username_format
    check (username ~ '^[A-Za-z0-9_]+$' and char_length(username) between 3 and 16)
);

alter table public.lobby_profiles enable row level security;

drop policy if exists "lobby_profiles read all" on public.lobby_profiles;
create policy "lobby_profiles read all" on public.lobby_profiles
  for select using (true);

drop policy if exists "lobby_profiles insert self" on public.lobby_profiles;
create policy "lobby_profiles insert self" on public.lobby_profiles
  for insert with check (auth.uid() = id);

drop policy if exists "lobby_profiles update self" on public.lobby_profiles;
create policy "lobby_profiles update self" on public.lobby_profiles
  for update using (auth.uid() = id);

create table if not exists public.chat_events (
  id bigserial primary key,
  created_at timestamptz not null default now(),
  from_username text not null check (char_length(from_username) between 3 and 16),
  text text not null check (char_length(text) between 1 and 120),
  is_guest boolean not null default false
);

create index if not exists chat_events_created_at_idx
  on public.chat_events (created_at desc);

alter table public.chat_events enable row level security;

drop policy if exists "chat_events read all" on public.chat_events;
create policy "chat_events read all" on public.chat_events
  for select using (true);

drop policy if exists "chat_events insert any" on public.chat_events;
create policy "chat_events insert any" on public.chat_events
  for insert with check (true);

create or replace function public.guard_chat_text()
returns trigger language plpgsql as $$
declare
  banned text[] := array['damn', 'crap'];
  pattern text := '\m(' || array_to_string(banned, '|') || ')\M';
begin
  if new.text ~* pattern then
    new.text := regexp_replace(new.text, pattern, repeat('*', 4), 'gi');
  end if;
  return new;
end;
$$;

drop trigger if exists guard_chat_text on public.chat_events;
create trigger guard_chat_text
  before insert on public.chat_events
  for each row execute function public.guard_chat_text();

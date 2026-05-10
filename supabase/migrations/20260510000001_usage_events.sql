-- Per-call usage events (web translate + CLI translate)
create table if not exists public.usage_events (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  words integer not null default 0,
  target_language text not null,
  created_at timestamptz default now()
);

alter table public.usage_events enable row level security;

create policy "Users can view own usage_events"
  on public.usage_events for select
  using (auth.uid() = user_id);

create policy "Service role manages usage_events"
  on public.usage_events for all
  using (true);

create index on public.usage_events(user_id, created_at);

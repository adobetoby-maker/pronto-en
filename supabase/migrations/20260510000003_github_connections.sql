create table if not exists public.github_connections (
  user_id      uuid references auth.users(id) on delete cascade primary key,
  access_token text not null,
  github_login text,
  connected_at timestamptz default now()
);

alter table public.github_connections enable row level security;

create policy "Users manage own github_connections"
  on public.github_connections for all
  using (auth.uid() = user_id);

create policy "Service role manages github_connections"
  on public.github_connections for all
  using (true);

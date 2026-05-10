-- Pronto schema
-- Users extend auth.users via profiles
create table public.profiles (
  id uuid references auth.users(id) on delete cascade primary key,
  email text not null,
  full_name text,
  avatar_url text,
  created_at timestamptz default now()
);
alter table public.profiles enable row level security;
create policy "Users can view own profile" on public.profiles for select using (auth.uid() = id);
create policy "Users can update own profile" on public.profiles for update using (auth.uid() = id);

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, email, full_name)
  values (new.id, new.email, new.raw_user_meta_data->>'full_name');
  return new;
end;
$$;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Subscriptions (Stripe sync)
create table public.subscriptions (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  stripe_customer_id text unique,
  stripe_subscription_id text unique,
  plan text not null default 'flex', -- flex | studio | agency
  status text not null default 'active', -- active | canceled | past_due | trialing
  words_included integer default 0, -- 0 = pay-as-you-go (flex)
  words_used integer default 0,
  current_period_start timestamptz,
  current_period_end timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
alter table public.subscriptions enable row level security;
create policy "Users can view own subscription" on public.subscriptions for select using (auth.uid() = user_id);

-- Projects (each user's localization projects)
create table public.projects (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  name text not null,
  platform text not null, -- react|nextjs|vue|flutter|ios|android|wordpress|webflow|shopify|squarespace|framer|wix|phoenix|go-i18n
  source_language text not null default 'en',
  target_languages text[] not null default '{}',
  github_repo text,
  site_url text, -- for non-dev platforms (WordPress, Webflow, etc.)
  config jsonb default '{}', -- tone, formality, domain, do_not_translate list
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
alter table public.projects enable row level security;
create policy "Users can manage own projects" on public.projects for all using (auth.uid() = user_id);

-- Translation jobs (each pronto translate run)
create table public.translation_jobs (
  id uuid default gen_random_uuid() primary key,
  project_id uuid references public.projects(id) on delete cascade not null,
  user_id uuid references auth.users(id) on delete cascade not null,
  status text not null default 'queued', -- queued | running | complete | failed
  target_languages text[] not null default '{}',
  strings_total integer default 0,
  strings_changed integer default 0,
  words_processed integer default 0,
  cost_usd numeric(10,4) default 0,
  error text,
  started_at timestamptz,
  completed_at timestamptz,
  created_at timestamptz default now()
);
alter table public.translation_jobs enable row level security;
create policy "Users can view own jobs" on public.translation_jobs for select using (auth.uid() = user_id);
create policy "Service role manages jobs" on public.translation_jobs for all using (true);

-- Usage tracking (for metered billing + dashboards)
create table public.usage (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  project_id uuid references public.projects(id) on delete set null,
  job_id uuid references public.translation_jobs(id) on delete set null,
  words integer not null default 0,
  cost_usd numeric(10,4) default 0,
  recorded_at timestamptz default now()
);
alter table public.usage enable row level security;
create policy "Users can view own usage" on public.usage for select using (auth.uid() = user_id);

-- API keys (for CLI authentication)
create table public.api_keys (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  name text not null default 'Default',
  key_hash text not null unique, -- bcrypt hash of the actual key
  key_prefix text not null, -- first 8 chars for display (e.g. "pronto_a")
  last_used_at timestamptz,
  created_at timestamptz default now()
);
alter table public.api_keys enable row level security;
create policy "Users can manage own api keys" on public.api_keys for all using (auth.uid() = user_id);

-- Team members (Agency plan)
create table public.team_members (
  id uuid default gen_random_uuid() primary key,
  owner_id uuid references auth.users(id) on delete cascade not null,
  member_id uuid references auth.users(id) on delete cascade not null,
  role text not null default 'translator', -- translator | developer | admin
  invited_at timestamptz default now(),
  accepted_at timestamptz,
  unique(owner_id, member_id)
);
alter table public.team_members enable row level security;
create policy "Owners can manage team" on public.team_members for all using (auth.uid() = owner_id);
create policy "Members can view their membership" on public.team_members for select using (auth.uid() = member_id);

-- Translation memory (shared cache to save cost)
create table public.translation_memory (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  source_language text not null,
  target_language text not null,
  source_text text not null,
  translated_text text not null,
  platform text,
  created_at timestamptz default now(),
  unique(user_id, source_language, target_language, source_text)
);
alter table public.translation_memory enable row level security;
create policy "Users can manage own translation memory" on public.translation_memory for all using (auth.uid() = user_id);

-- Indexes
create index on public.projects(user_id);
create index on public.translation_jobs(project_id);
create index on public.translation_jobs(user_id, status);
create index on public.usage(user_id, recorded_at);
create index on public.api_keys(user_id);
create index on public.translation_memory(user_id, source_language, target_language);

create table if not exists public.newsletter_subscribers (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  email text not null,
  source text null,
  confirmed boolean not null default false,
  constraint newsletter_subscribers_email_key unique (email)
);

alter table public.newsletter_subscribers enable row level security;

-- Anonymous users can subscribe
create policy "anon_insert" on public.newsletter_subscribers
  for insert
  with check (true);

-- Only service_role can read
create policy "service_role_select" on public.newsletter_subscribers
  for select
  using (auth.role() = 'service_role');

-- Only service_role can update
create policy "service_role_update" on public.newsletter_subscribers
  for update
  using (auth.role() = 'service_role')
  with check (auth.role() = 'service_role');

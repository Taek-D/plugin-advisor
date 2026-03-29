create table if not exists public.feedback (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  page text not null,
  rating smallint null check (rating between 1 and 5),
  message text not null,
  contact text null
);

alter table public.feedback enable row level security;

-- Anonymous users can submit feedback
create policy "anon_insert" on public.feedback
  for insert
  with check (true);

-- Only service_role can read (admin backend)
create policy "service_role_select" on public.feedback
  for select
  using (auth.role() = 'service_role');

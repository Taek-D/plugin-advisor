-- Custom plugins table: stores admin-added plugins and hidden core plugin IDs
create table if not exists public.custom_plugins (
  id text primary key,
  action text not null check (action in ('added', 'deleted')),
  plugin_data jsonb null,
  created_at timestamptz not null default now()
);

alter table public.custom_plugins enable row level security;

-- Only service_role can access (admin backend only)
create policy "service_role_full_access" on public.custom_plugins
  for all
  using (auth.role() = 'service_role')
  with check (auth.role() = 'service_role');

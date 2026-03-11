-- Fix: plugin_suggestions had RLS enabled but zero policies defined

-- Public users can insert suggestions (submit form)
create policy "anon_insert" on public.plugin_suggestions
  for insert
  with check (true);

-- Only service_role can read/update (admin backend)
create policy "service_role_select" on public.plugin_suggestions
  for select
  using (auth.role() = 'service_role');

create policy "service_role_update" on public.plugin_suggestions
  for update
  using (auth.role() = 'service_role')
  with check (auth.role() = 'service_role');

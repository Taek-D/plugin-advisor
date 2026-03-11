create extension if not exists pgcrypto;

create table if not exists public.plugin_suggestions (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  status text not null default 'pending' check (status in ('pending', 'hold', 'approved', 'rejected')),
  plugin_name text null,
  repository_url text not null,
  normalized_repo text null,
  reason text not null,
  submitter_name text null,
  contact text null,
  source_page text null,
  admin_notes text null,
  reviewed_at timestamptz null
);

create index if not exists plugin_suggestions_status_idx
  on public.plugin_suggestions (status, created_at desc);

create index if not exists plugin_suggestions_normalized_repo_idx
  on public.plugin_suggestions (normalized_repo);

alter table public.plugin_suggestions enable row level security;

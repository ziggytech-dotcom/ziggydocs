-- ZiggyDocs Sprint 3 — Zapier webhook subscriptions
-- user_id matches auth.users (same pattern as all other zd_ tables)

create table if not exists zapier_subscriptions (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users(id) on delete cascade not null,
  event_type text not null,
  target_url text not null,
  secret text,
  created_at timestamptz default now() not null
);

create index if not exists zapier_subs_user_event_idx on zapier_subscriptions(user_id, event_type);

-- ZiggyDocs Sprint 2 schema additions
-- Sequential signing, bulk send, document archive, in-person mode, auto-void

-- =====================
-- 1. Sequential Signing
-- =====================
alter table zd_documents
  add column if not exists sequential_signing boolean not null default false;

alter table zd_recipients
  add column if not exists signing_order int not null default 1;

-- Index for sequential: quickly get next-in-order unsigned recipient
create index if not exists idx_zd_recipients_order
  on zd_recipients(document_id, signing_order)
  where signed_at is null and declined_at is null;

-- =====================
-- 2. Bulk Send
-- =====================
create table if not exists zd_bulk_sends (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users(id) on delete cascade not null,
  title text not null,
  document_count int not null default 0,
  created_at timestamptz not null default now()
);

alter table zd_bulk_sends enable row level security;

create policy "zd_bulk_sends_owner" on zd_bulk_sends
  for all using (auth.uid() = user_id);

alter table zd_documents
  add column if not exists bulk_send_id uuid references zd_bulk_sends(id) on delete set null;

create index if not exists idx_zd_documents_bulk_send_id on zd_documents(bulk_send_id);
create index if not exists idx_zd_bulk_sends_user_id on zd_bulk_sends(user_id);

-- =====================
-- 3. Auto-Void Expiration
-- =====================
alter table zd_documents
  add column if not exists voided_at timestamptz;

-- Replace status constraint to include 'voided'
alter table zd_documents drop constraint if exists zd_documents_status_check;
alter table zd_documents
  add constraint zd_documents_status_check
  check (status in ('draft','sent','viewed','signed','cancelled','declined','voided'));

-- Index for void-expired cron: quickly find sent/viewed docs past expiry
create index if not exists idx_zd_documents_expires_at
  on zd_documents(expires_at, status)
  where status in ('sent', 'viewed');

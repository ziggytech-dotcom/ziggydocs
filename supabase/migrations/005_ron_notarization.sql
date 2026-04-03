-- ZiggyDocs Sprint 3 — RON / Proof.com notarization
-- Migration: 20260401000300

-- =====================
-- 1. Notarization columns on zd_documents
-- =====================
alter table zd_documents
  add column if not exists notarization_required boolean not null default false;

alter table zd_documents
  add column if not exists proof_transaction_id text;

alter table zd_documents
  add column if not exists notarized_at timestamptz;

alter table zd_documents
  add column if not exists notarization_certificate_url text;

alter table zd_documents
  add column if not exists notarized_by text; -- notary name returned by Proof

-- Expand status to include 'notarization_requested' and 'notarized'
alter table zd_documents drop constraint if exists zd_documents_status_check;
alter table zd_documents
  add constraint zd_documents_status_check
  check (status in (
    'draft','sent','viewed','signed','cancelled','declined','voided',
    'notarization_requested','notarized'
  ));

-- =====================
-- 2. webhook_events — store raw incoming webhooks for idempotency + audit
-- =====================
create table if not exists zd_webhook_events (
  id uuid primary key default uuid_generate_v4(),
  provider text not null,           -- 'proof', 'zapier', etc.
  event_id text,                    -- provider-supplied idempotency key
  payload jsonb not null default '{}'::jsonb,
  processed_at timestamptz,
  created_at timestamptz not null default now()
);

create unique index if not exists idx_zd_webhook_events_provider_event_id
  on zd_webhook_events(provider, event_id)
  where event_id is not null;

create index if not exists idx_zd_webhook_events_provider
  on zd_webhook_events(provider, created_at desc);

-- =====================
-- Indexes
-- =====================
create index if not exists idx_zd_documents_notarization
  on zd_documents(notarization_required, status)
  where notarization_required = true;

create index if not exists idx_zd_documents_proof_transaction_id
  on zd_documents(proof_transaction_id)
  where proof_transaction_id is not null;

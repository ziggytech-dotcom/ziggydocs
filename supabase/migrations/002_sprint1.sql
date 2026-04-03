-- ZiggyDocs Sprint 1 schema additions
-- Auto-reminders, decline-to-sign support

-- zd_recipients: reminder tracking
alter table zd_recipients
  add column if not exists last_reminded_at timestamptz,
  add column if not exists reminder_count int not null default 0,
  add column if not exists declined_at timestamptz,
  add column if not exists decline_reason text;

-- zd_documents: update status check constraint to include 'declined'
alter table zd_documents drop constraint if exists zd_documents_status_check;
alter table zd_documents
  add constraint zd_documents_status_check
  check (status in ('draft','sent','viewed','signed','cancelled','declined'));

-- Index for cron job: quickly find unsigned, non-declined recipients on sent documents
create index if not exists idx_zd_recipients_unsigned
  on zd_recipients(document_id)
  where signed_at is null and declined_at is null;

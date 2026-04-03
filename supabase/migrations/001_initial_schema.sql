-- ZiggyDocs initial schema
-- All tables use zd_ prefix

create extension if not exists "uuid-ossp";

-- Documents storage bucket (run once in Supabase dashboard if not exists)
-- insert into storage.buckets (id, name, public) values ('zd-documents', 'zd-documents', false) on conflict do nothing;

-- =====================
-- zd_documents
-- =====================
create table if not exists zd_documents (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users(id) on delete cascade not null,
  title text not null,
  file_url text,                   -- storage path for original PDF
  signed_pdf_url text,             -- storage path for signed PDF
  status text not null default 'draft' check (status in ('draft','sent','viewed','signed','cancelled')),
  token text unique,               -- signing token (UUID)
  signer_name text,
  signer_ip text,
  signer_user_agent text,
  field_data_json jsonb default '{}'::jsonb,
  fields_json jsonb default '[]'::jsonb,
  template_id uuid,
  expires_at timestamptz,
  sent_at timestamptz,
  viewed_at timestamptz,
  signed_at timestamptz,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

-- =====================
-- zd_recipients
-- =====================
create table if not exists zd_recipients (
  id uuid primary key default uuid_generate_v4(),
  document_id uuid references zd_documents(id) on delete cascade not null,
  name text not null,
  email text not null,
  token text unique not null default uuid_generate_v4()::text,
  signed_at timestamptz,
  ip_address text,
  created_at timestamptz default now() not null
);

-- =====================
-- zd_fields
-- =====================
create table if not exists zd_fields (
  id uuid primary key default uuid_generate_v4(),
  document_id uuid references zd_documents(id) on delete cascade not null,
  recipient_id uuid references zd_recipients(id) on delete set null,
  type text not null check (type in ('signature','initials','name','date','checkbox','text')),
  page int not null default 1,
  x numeric not null,
  y numeric not null,
  width numeric not null,
  height numeric not null,
  value text,
  created_at timestamptz default now() not null
);

-- =====================
-- zd_templates
-- =====================
create table if not exists zd_templates (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users(id) on delete cascade not null,
  title text not null,
  file_url text,
  fields_json jsonb default '[]'::jsonb,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

-- =====================
-- zd_audit_log
-- =====================
create table if not exists zd_audit_log (
  id uuid primary key default uuid_generate_v4(),
  document_id uuid references zd_documents(id) on delete cascade not null,
  event text not null,
  actor text,
  metadata jsonb default '{}'::jsonb,
  ip_address text,
  user_agent text,
  created_at timestamptz default now() not null
);

-- =====================
-- Indexes
-- =====================
create index if not exists idx_zd_documents_user_id on zd_documents(user_id);
create index if not exists idx_zd_documents_token on zd_documents(token);
create index if not exists idx_zd_documents_status on zd_documents(status);
create index if not exists idx_zd_recipients_document_id on zd_recipients(document_id);
create index if not exists idx_zd_recipients_token on zd_recipients(token);
create index if not exists idx_zd_fields_document_id on zd_fields(document_id);
create index if not exists idx_zd_templates_user_id on zd_templates(user_id);
create index if not exists idx_zd_audit_log_document_id on zd_audit_log(document_id);

-- =====================
-- RLS
-- =====================
alter table zd_documents enable row level security;
alter table zd_recipients enable row level security;
alter table zd_fields enable row level security;
alter table zd_templates enable row level security;
alter table zd_audit_log enable row level security;

-- Documents: owners can do everything
create policy "zd_documents_owner" on zd_documents
  for all using (auth.uid() = user_id);

-- Recipients: owner of document can manage
create policy "zd_recipients_owner" on zd_recipients
  for all using (
    document_id in (select id from zd_documents where user_id = auth.uid())
  );

-- Fields: owner of document can manage
create policy "zd_fields_owner" on zd_fields
  for all using (
    document_id in (select id from zd_documents where user_id = auth.uid())
  );

-- Templates: owner can manage
create policy "zd_templates_owner" on zd_templates
  for all using (auth.uid() = user_id);

-- Audit log: owner can read
create policy "zd_audit_log_owner" on zd_audit_log
  for select using (
    document_id in (select id from zd_documents where user_id = auth.uid())
  );

-- Updated_at trigger
create or replace function update_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger zd_documents_updated_at before update on zd_documents
  for each row execute function update_updated_at();
create trigger zd_templates_updated_at before update on zd_templates
  for each row execute function update_updated_at();

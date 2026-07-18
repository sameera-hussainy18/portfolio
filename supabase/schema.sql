-- Portfolio database schema, RLS policies, and storage bucket.
-- Run this once in the Supabase SQL editor (Dashboard -> SQL Editor -> New query) on a fresh project.
-- Safe to re-run: guarded with "if not exists" / "on conflict" where practical.

-- =========================================================================
-- Tables
-- =========================================================================

create table if not exists public.tech_stack (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  category text not null check (category in ('language', 'framework', 'database', 'tool', 'cloud', 'other')),
  icon_slug text,
  display_order integer not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  summary text not null,
  description text,
  github_url text,
  live_url text,
  image_url text,
  featured boolean not null default false,
  display_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.project_tech_stack (
  project_id uuid not null references public.projects (id) on delete cascade,
  tech_stack_id uuid not null references public.tech_stack (id) on delete cascade,
  primary key (project_id, tech_stack_id)
);

create table if not exists public.internships (
  id uuid primary key default gen_random_uuid(),
  company text not null,
  role text not null,
  location text,
  start_date date not null,
  end_date date,
  description text,
  display_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.internship_tech_stack (
  internship_id uuid not null references public.internships (id) on delete cascade,
  tech_stack_id uuid not null references public.tech_stack (id) on delete cascade,
  primary key (internship_id, tech_stack_id)
);

create table if not exists public.certificates (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  issuer text not null,
  issue_date date not null,
  credential_url text,
  credential_id text,
  image_url text,
  display_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Safe to re-run against a database created before image_url existed.
alter table public.certificates add column if not exists image_url text;

-- "Get in Touch" — public contact form. Never read on the public site.
create table if not exists public.contact_messages (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  message text not null,
  is_read boolean not null default false,
  created_at timestamptz not null default now()
);

-- "Leave a Note" — private channel straight to the owner. Never read on the public site.
create table if not exists public.private_notes (
  id uuid primary key default gen_random_uuid(),
  name text,
  message text not null,
  image_path text,
  is_read boolean not null default false,
  created_at timestamptz not null default now()
);

create index if not exists contact_messages_created_at_idx on public.contact_messages (created_at desc);
create index if not exists private_notes_created_at_idx on public.private_notes (created_at desc);

-- =========================================================================
-- updated_at trigger for the three mutable content tables
-- =========================================================================

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_updated_at on public.projects;
create trigger set_updated_at before update on public.projects
for each row execute function public.set_updated_at();

drop trigger if exists set_updated_at on public.internships;
create trigger set_updated_at before update on public.internships
for each row execute function public.set_updated_at();

drop trigger if exists set_updated_at on public.certificates;
create trigger set_updated_at before update on public.certificates
for each row execute function public.set_updated_at();

-- =========================================================================
-- Row Level Security
-- Content tables: anyone can read, only a logged-in admin (authenticated) can write.
-- Message/note tables: anyone can insert, only a logged-in admin can read/update/delete.
-- =========================================================================

alter table public.tech_stack enable row level security;
alter table public.projects enable row level security;
alter table public.project_tech_stack enable row level security;
alter table public.internships enable row level security;
alter table public.internship_tech_stack enable row level security;
alter table public.certificates enable row level security;
alter table public.contact_messages enable row level security;
alter table public.private_notes enable row level security;

drop policy if exists "public read tech_stack" on public.tech_stack;
create policy "public read tech_stack" on public.tech_stack for select using (true);
drop policy if exists "admin write tech_stack" on public.tech_stack;
create policy "admin write tech_stack" on public.tech_stack for all to authenticated using (true) with check (true);

drop policy if exists "public read projects" on public.projects;
create policy "public read projects" on public.projects for select using (true);
drop policy if exists "admin write projects" on public.projects;
create policy "admin write projects" on public.projects for all to authenticated using (true) with check (true);

drop policy if exists "public read project_tech_stack" on public.project_tech_stack;
create policy "public read project_tech_stack" on public.project_tech_stack for select using (true);
drop policy if exists "admin write project_tech_stack" on public.project_tech_stack;
create policy "admin write project_tech_stack" on public.project_tech_stack for all to authenticated using (true) with check (true);

drop policy if exists "public read internships" on public.internships;
create policy "public read internships" on public.internships for select using (true);
drop policy if exists "admin write internships" on public.internships;
create policy "admin write internships" on public.internships for all to authenticated using (true) with check (true);

drop policy if exists "public read internship_tech_stack" on public.internship_tech_stack;
create policy "public read internship_tech_stack" on public.internship_tech_stack for select using (true);
drop policy if exists "admin write internship_tech_stack" on public.internship_tech_stack;
create policy "admin write internship_tech_stack" on public.internship_tech_stack for all to authenticated using (true) with check (true);

drop policy if exists "public read certificates" on public.certificates;
create policy "public read certificates" on public.certificates for select using (true);
drop policy if exists "admin write certificates" on public.certificates;
create policy "admin write certificates" on public.certificates for all to authenticated using (true) with check (true);

drop policy if exists "anon insert contact_messages" on public.contact_messages;
create policy "anon insert contact_messages" on public.contact_messages for insert to anon, authenticated with check (true);
drop policy if exists "admin read contact_messages" on public.contact_messages;
create policy "admin read contact_messages" on public.contact_messages for select to authenticated using (true);
drop policy if exists "admin update contact_messages" on public.contact_messages;
create policy "admin update contact_messages" on public.contact_messages for update to authenticated using (true) with check (true);
drop policy if exists "admin delete contact_messages" on public.contact_messages;
create policy "admin delete contact_messages" on public.contact_messages for delete to authenticated using (true);

drop policy if exists "anon insert private_notes" on public.private_notes;
create policy "anon insert private_notes" on public.private_notes for insert to anon, authenticated with check (true);
drop policy if exists "admin read private_notes" on public.private_notes;
create policy "admin read private_notes" on public.private_notes for select to authenticated using (true);
drop policy if exists "admin update private_notes" on public.private_notes;
create policy "admin update private_notes" on public.private_notes for update to authenticated using (true) with check (true);
drop policy if exists "admin delete private_notes" on public.private_notes;
create policy "admin delete private_notes" on public.private_notes for delete to authenticated using (true);

-- =========================================================================
-- Storage: private bucket for "Leave a Note" image attachments
-- =========================================================================

insert into storage.buckets (id, name, public)
values ('note-attachments', 'note-attachments', false)
on conflict (id) do nothing;

drop policy if exists "anon upload note attachments" on storage.objects;
create policy "anon upload note attachments"
on storage.objects for insert
to anon, authenticated
with check (bucket_id = 'note-attachments');

drop policy if exists "admin read note attachments" on storage.objects;
create policy "admin read note attachments"
on storage.objects for select
to authenticated
using (bucket_id = 'note-attachments');

drop policy if exists "admin delete note attachments" on storage.objects;
create policy "admin delete note attachments"
on storage.objects for delete
to authenticated
using (bucket_id = 'note-attachments');

-- =========================================================================
-- Storage: public bucket for certificate images
-- =========================================================================

insert into storage.buckets (id, name, public)
values ('certificate-images', 'certificate-images', true)
on conflict (id) do nothing;

drop policy if exists "public read certificate images" on storage.objects;
create policy "public read certificate images"
on storage.objects for select
using (bucket_id = 'certificate-images');

drop policy if exists "admin write certificate images" on storage.objects;
create policy "admin write certificate images"
on storage.objects for insert
to authenticated
with check (bucket_id = 'certificate-images');

drop policy if exists "admin update certificate images" on storage.objects;
create policy "admin update certificate images"
on storage.objects for update
to authenticated
using (bucket_id = 'certificate-images')
with check (bucket_id = 'certificate-images');

drop policy if exists "admin delete certificate images" on storage.objects;
create policy "admin delete certificate images"
on storage.objects for delete
to authenticated
using (bucket_id = 'certificate-images');

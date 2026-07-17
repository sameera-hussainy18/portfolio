# Portfolio

A personal portfolio built with Next.js 16 (App Router), React 19, TypeScript, and Supabase.
Projects, internships, certificates, and tech stack all live in the database and are managed
through an authenticated `/admin` dashboard — no code changes or redeploys needed to update
content.

## Stack

- **Next.js 16** (App Router) + React 19 + TypeScript
- **Tailwind CSS v4** + **shadcn/ui** (Base UI primitives) for components
- **Supabase** — Postgres (content + RLS), Auth (single admin, email/password), Storage (private note attachments)
- **react-hook-form** + **zod** for all forms
- **Framer Motion** for scroll/hover motion
- Dynamic OG images via `next/og`

## 1. Create a Supabase project

1. Go to [supabase.com](https://supabase.com) and create a new project (the free tier is enough).
2. Once it's provisioned, open **Project Settings → API** and copy:
   - **Project URL**
   - **anon public** key
3. Copy `.env.local.example` to `.env.local` and fill in both values:

   ```bash
   cp .env.local.example .env.local
   ```

   ```
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   NEXT_PUBLIC_SITE_URL=http://localhost:3000
   ```

   No service-role key is needed anywhere — every admin write goes through Row Level Security
   as the logged-in admin user, and every public read/insert goes through RLS as `anon`.

## 2. Run the database schema

1. In the Supabase dashboard, open **SQL Editor → New query**.
2. Paste the entire contents of [`supabase/schema.sql`](supabase/schema.sql) and run it.

   This creates all tables (`projects`, `internships`, `certificates`, `tech_stack`, their
   join tables, `contact_messages`, `private_notes`), enables Row Level Security with the
   policies described below, and creates the private `note-attachments` storage bucket.

   It's safe to re-run — tables use `if not exists` and policies are dropped/recreated.

**RLS shape:** anyone can read `projects` / `internships` / `certificates` / `tech_stack`;
only an authenticated (logged-in) user can write to them. Anyone can insert into
`contact_messages` and `private_notes`; only an authenticated user can read, update, or
delete them — which is what keeps notes and messages off the public site entirely.

## 3. Load real content (optional)

[`supabase/seed.sql`](supabase/seed.sql) populates the database with Sameera's real projects,
internships, certificates, and tech stack (sourced from her resume and LinkedIn export). Run
it in the SQL editor right after `schema.sql` if you want the site populated immediately
instead of starting empty. It's idempotent — safe to re-run, and everything in it can still be
edited or removed afterward from `/admin`.

## 4. Create the admin user

There's no public sign-up page by design. Create the one admin account yourself:

1. Supabase dashboard → **Authentication → Users → Add user**.
2. Create a user with your email and a password.
3. Sign in at `/admin/login` with those credentials.

## 5. Run locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) for the public site, and
[http://localhost:3000/admin/login](http://localhost:3000/admin/login) to sign in.

If you skipped step 3, the database starts empty — nothing is hardcoded or fabricated. Log
into `/admin` and add projects, internships, certificates, and tech stack entries there; the
public pages read live from the database on every request.

## Project structure

```
src/
  app/
    (public pages)            home, projects, internships, certificates, tech-stack, contact
    admin/
      login/                  email/password sign-in (no public sign-up)
      (dashboard)/            auth-gated: overview, CRUD for all 4 content types, inbox
    api/og/                   dynamic OG image generation
    sitemap.ts, robots.ts
  components/                 ui/ (shadcn) + feature folders (home, projects, admin, ...)
  lib/
    supabase/                 browser + server Supabase clients
    actions/                  Server Actions (CRUD, contact/note submission, inbox)
    validations/              zod schemas
    queries.ts                read queries used by public + admin pages
  types/database.ts           hand-written Supabase types
  proxy.ts                    gates /admin/* (Next.js 16's renamed middleware convention)
supabase/schema.sql           full schema + RLS + storage bucket, run once in SQL editor
supabase/seed.sql             real content seed (optional), run once after schema.sql
public/profile.jpg            hero profile photo
```

## Editing site identity

`src/lib/site-config.ts` holds the name, tagline, bio, profile photo, and GitHub/LinkedIn links
shown across the site — edit it directly and redeploy to change any of it. Everything else
(projects, internships, certificates, tech stack) is edited live from `/admin`, no redeploy
needed.

## Deploying (Vercel)

1. Push this repo to GitHub and import it in Vercel.
2. Add the three environment variables from `.env.local` in the Vercel project settings —
   update `NEXT_PUBLIC_SITE_URL` to your real domain once you have one (it drives
   `metadataBase`, OG tags, and the sitemap).
3. Deploy. No build-time Supabase access is required — all content pages render at request
   time, so a fresh deploy immediately reflects whatever is in the database.

## Commands

```bash
npm run dev      # start the dev server
npm run build    # production build (also runs the TypeScript check)
npm run lint     # ESLint
```

# Zamin Gullari

Flower storefront (Next.js) with cart, checkout, personal cabinet, and admin catalog.

## Stack

| Service | Role |
|---------|------|
| **Vercel** | Hosting |
| **Supabase** | Auth + Postgres (products, orders, profiles) |
| **GitHub** | Source → Vercel deploy |
| **Cloudflare** | DNS for custom domain |
| **Sentry** | Production error tracking |
| **Telegram** | Optional order notifications |

Without Supabase env vars the app still runs locally on JSON files under `data/store/` (not durable on Vercel).

## Local development

```bash
npm install
cp .env.example .env.local
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Supabase setup

1. Create a free project at [supabase.com](https://supabase.com).
2. SQL Editor → run [`supabase/migrations/001_init.sql`](supabase/migrations/001_init.sql).
3. Project Settings → API → copy URL, `anon` key, `service_role` key into `.env.local`.
4. Auth → Providers → Email: disable “Confirm email” for smoother login UX (or keep it and confirm in dashboard).
5. Seed catalog + admin user:

```bash
npm run seed:supabase
```

This creates login **`zamin`** with password from `ZAMIN_ADMIN_PASSWORD` (default `zamin2026` in seed if unset).

6. Sign in at `/account` with `zamin` / your password → tile **Админка** → manage products & orders.

Reserved logins (`zamin`, `admin`, plus `NEXT_PUBLIC_ADMIN_LOGINS`) cannot be registered by customers.

## Admin

- **With Supabase:** log in as `zamin` in the normal account form. Session grants `/admin`.
- **Without Supabase (local FS):** use `/admin/login` with `ZAMIN_ADMIN_PASSWORD` / `ADMIN_PASSWORD`.

## Deploy on Vercel

1. Push the repo to GitHub.
2. [vercel.com](https://vercel.com) → Import project.
3. Add env vars from `.env.example` (Supabase + `ZAMIN_ADMIN_PASSWORD` + optional Sentry/Telegram).
4. Deploy. Run `npm run seed:supabase` once against the production Supabase project (from your machine with prod keys).

### Cloudflare DNS

After buying a domain (Namecheap etc.):

1. Add site in Cloudflare, switch nameservers.
2. Vercel → Project → Domains → add `yourdomain.com`.
3. Cloudflare DNS: CNAME `@` or `www` → `cname.vercel-dns.com` (as Vercel shows). Proxy can stay orange-clouded.

## Sentry

1. Create a project at [sentry.io](https://sentry.io) (Next.js).
2. Set `NEXT_PUBLIC_SENTRY_DSN` and `SENTRY_DSN` on Vercel.
3. Redeploy. Errors (with phones/passwords scrubbed) appear in Sentry.

## Backups

**Free Supabase has no automatic daily backups.** Protect data yourself.

### Quick dump (this repo)

```bash
npm run backup:supabase
```

Creates `backups/supabase-….json` (products, orders, profiles, auth user list without passwords).  
Copy the file to Google Drive / another PC.

Restore tables:

```bash
node --env-file=.env.local scripts/restore-supabase.mjs backups/supabase-XXXX.json
```

Admin password is not in the dump — re-run `npm run seed:supabase` if you need to recreate `zamin`.

### Better options

| Option | When |
|--------|------|
| **Manual `npm run backup:supabase` weekly** | Free tier, small shop |
| **Supabase Pro (~$25/mo)** | Daily backups, 7 days retention in Dashboard → Database → Backups |
| **PITR add-on** | Restore to any second (paid, on Pro+) |
| **`supabase db dump`** | Full SQL dump via [Supabase CLI](https://supabase.com/docs/reference/cli/supabase-db-dump) |

Schedule a reminder (or Windows Task Scheduler) to run `npm run backup:supabase` every day/week.

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Dev server |
| `npm run build` | Production build |
| `npm run seed:supabase` | Upsert products + `zamin` admin |
| `npm run backup:supabase` | JSON backup of DB tables |

## Notes

- Product images are URLs (no Storage upload yet).
- Payments stay cash / card-to-courier (no Stripe).
- Clerk / Pinecone / Upstash are intentionally not used.

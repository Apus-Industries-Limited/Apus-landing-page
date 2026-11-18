# Apus Industries Ltd — Corporate Website & Admin CRM/CMS

Production-ready corporate website and content management system for **Apus Industries Ltd** — a technology and engineering company (software development, web/mobile apps, electrical & electronics, solar & energy, digital infrastructure).

Built with **Next.js 15 (App Router), TypeScript (strict), Tailwind CSS, MongoDB + Mongoose, Auth.js (NextAuth v5) credentials auth, Zod, and Cloudflare R2** for media storage. Deployed on **Vercel**.

Design: premium, minimalist corporate aesthetic adapted from the Ynora reference layout (huge editorial headline, alternating light/black sections) — with the Apus cyan `#49CEE1` accent and the real AP logos, not Ynora's orange branding.

## What is included

**Public website** (all dynamic content from MongoDB, with graceful fallbacks when the DB is empty):

- `/` — hero, company intro, services, featured projects, why choose Apus, partners, testimonials, CTA
- `/about` — mission, vision, values, team directory (from CMS)
- `/services` and `/services/[slug]` — CMS-managed services with benefits, features, related projects
- `/projects` and `/projects/[slug]` — filter + search, gallery, client/industry/tech/date
- `/contact` — validated form; saves an inquiry with an `APUS-YYYY-XXXX` reference number; rate-limited
- `/privacy-policy`, `/terms-and-conditions`, custom 404, `sitemap.xml`, `robots.txt`, JSON-LD Organization schema

**Admin CRM/CMS** at `/admin` (login required; roles: Super Admin, Administrator, Content Manager):

- Dashboard with counts, recent inquiries and recently updated projects
- Services, Projects (draft/publish, gallery via R2), Testimonials (approve/reject/publish), Partners, Team
- Inquiries — status pipeline (New → Contacted → In Discussion → Proposal Sent → Converted → Closed / Rejected), internal notes, assignment, activity log, CSV export
- Media Library — presigned uploads direct to Cloudflare R2, browse/search/preview/copy URL/delete (with a reference check so in-use files cannot be deleted)
- Website Settings — company details, socials, SEO, homepage hero, footer, mission/vision/values
- Users — Super Admin only; bcrypt-hashed passwords
- Password reset — token-based (1 hour); without SMTP configured the token is logged server-side and a Super Admin can reset any password from Users

**Only seeded content:** the five service categories from the brief, plus the real contact details (email `apusindustries1@gmail.com`, phone `+2349029566770`, hours 9–5 Mon–Fri, `@apusindustries` on X/Instagram/LinkedIn). Team members, projects, testimonials and partners start **empty** — they are added through the CMS. Nothing is invented.

## Quick start (local)

```bash
npm install
cp .env.example .env.local   # fill in the values below
npm run seed                 # settings + 5 services + super-admin (only if ADMIN_SEED_* are set)
npm run dev                  # http://localhost:3000
```

## Environment variables

| Variable | Required | Notes |
|---|---|---|
| `MONGODB_URI` | Yes | MongoDB Atlas connection string, e.g. `mongodb+srv://user:pass@cluster.mongodb.net/apus?retryWrites=true&w=majority` |
| `NEXTAUTH_SECRET` | Yes | Long random string (`openssl rand -base64 32`) |
| `NEXTAUTH_URL` | Yes | `http://localhost:3000` locally; your production URL on Vercel |
| `NEXT_PUBLIC_SITE_URL` | Yes | Public site URL (canonical / sitemap / OG) |
| `R2_ACCOUNT_ID` | For uploads | Cloudflare account ID |
| `R2_ACCESS_KEY_ID` | For uploads | R2 API token access key |
| `R2_SECRET_ACCESS_KEY` | For uploads | R2 API token secret (never commit) |
| `R2_BUCKET` | For uploads | e.g. `apus-media` |
| `R2_PUBLIC_URL` | For uploads | Public delivery domain, e.g. `https://media.apusindustries.com` |
| `ADMIN_SEED_EMAIL` | Seed only | Email for the first super-admin |
| `ADMIN_SEED_PASSWORD` | Seed only | Min 8 characters; never commit real values |
| `ADMIN_SEED_NAME` | Seed only | Optional, defaults to `Apus Admin` |
| `SMTP_HOST` / `SMTP_PORT` / `SMTP_USER` / `SMTP_PASS` | Optional | Not wired to send mail yet — inquiries are stored in MongoDB and shown in the CRM |
| `NOTIFY_EMAIL` | Optional | Defaults to `apusindustries1@gmail.com` |

Without `MONGODB_URI` the public site still builds and renders (services fall back to the five seeded categories; projects/testimonials/team show honest empty states). The admin and contact form need the database.

## Deploy to Vercel (via GitHub — no Vercel connector used)

1. Push this repo to GitHub.
2. In Vercel, **Add New → Project → Import** the GitHub repo (framework: Next.js — `vercel.json` already sets this).
3. In **Settings → Environment Variables**, add the variables above (at least `MONGODB_URI`, `NEXTAUTH_SECRET`, `NEXTAUTH_URL`, `NEXT_PUBLIC_SITE_URL`, and the `R2_*` set).
4. Deploy. Then, locally with the same `.env.local`, run `npm run seed` once to create settings, services and the super-admin.
5. Sign in at `https://your-domain/admin/login` and add team, projects, testimonials and partners.

## Project structure

```
app/                  public site + /admin + /api
  api/                public GETs (published only) + /api/admin/* (role-guarded CRUD)
  (admin)/admin/      CRM pages (route group; /admin/login stays public)
  admin/login|forgot-password|reset-password
components/site/      header, footer, hero cards, contact form
components/admin/     shell, generic CRUD list/form, inquiry detail, media, settings
lib/                  db (cached Mongoose), auth (Auth.js), r2, validation (Zod),
                      settings (cached, with defaults), data (public fetch + seeded services),
                      rate-limit, utils
models/               User, Service, Project, Content (Testimonial/Partner/TeamMember),
                      Crm (Inquiry/Note/Activity, Media, WebsiteSettings)
scripts/seed.ts       settings + 5 services + super-admin (env-gated, no default password)
public/logos/         real AP logos (light = black mark, dark = cyan mark + wordmark)
docs/brand/           original logo JPG for reference only
```

## Brand assets

- `public/logos/apus-logo-light.png` — black AP mark, transparent (light backgrounds)
- `public/logos/apus-logo-dark.png` — cyan AP + "Apus Industries Limited" wordmark, transparent (dark backgrounds)
- `public/logos/apus-mark-cyan.png` — cyan AP mark only
- Accent: `#49CEE1` (from the logo). Ink `#0A0A0A`, light grey `#EDEDED`.

## Security notes

- Passwords hashed with bcrypt (12 rounds); `passwordHash` is `select: false` and never exposed by any API.
- Admin routes are guarded in `middleware.ts` (session check) and again in every route handler (role check). Never trust client-side authorization.
- Contact + auth + password-reset endpoints are rate-limited (in-memory token bucket; swap for Upstash Redis for multi-instance production).
- R2 uploads use presigned PUT URLs; only object keys + metadata are stored in MongoDB. Credentials never reach the client.
- Security headers are set in `next.config.ts`.
- Password reset: tokens are SHA-256 hashed in the DB, expire after 1 hour, and are never returned in an API response. To email reset links, configure SMTP and wire it in `app/api/admin/password-reset/route.ts` (the token is logged there today).

## Scripts

| Command | What it does |
|---|---|
| `npm run dev` | Development server |
| `npm run build` | Production build (must pass before deploying) |
| `npm run start` | Serve the production build |
| `npm run seed` | Seed settings + services + super-admin (needs `MONGODB_URI`) |
| `npm run typecheck` | `tsc --noEmit` |
| `npm run lint` | Next.js lint |

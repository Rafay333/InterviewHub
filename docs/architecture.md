# InterviewHub Architecture

## Purpose

Long-term interview preparation platform optimized for organic search traffic and Google AdSense. Built as a maintainable monorepo that can scale content volume (languages, categories, questions) over years.

## Repository layout

| Path | Role |
|------|------|
| `frontend/` | Next.js App Router (TypeScript) — public site, later admin UI |
| `backend/` | Express.js API (JavaScript) — business logic and data access |
| `database/` | SQL migrations and seeds — full schema in [`database/schema.sql`](../database/schema.sql) |
| `docs/` | Architecture and project documentation |

## Backend layers

Request flow:

```text
Route → Controller → Service → (Repository / DB) → Response
```

| Layer | Responsibility |
|-------|----------------|
| `routes/` | HTTP paths, method binding, validation wiring |
| `controllers/` | Parse request, call service, shape HTTP response |
| `services/` | Business rules |
| `middleware/` | Auth, errors, uploads |
| `config/` | Environment and app configuration |
| `utils/` | Shared helpers |

Do not put business logic in routes.

## Why this stack

| Technology | Reason |
|------------|--------|
| Next.js App Router | SSR/SSG for SEO and Core Web Vitals |
| Express + PostgreSQL (`pg`) | Originally planned; **current admin API uses Microsoft SQL Server (`mssql`)** because the schema was applied in SSMS |
| JWT + Passport Google OAuth | Auth when accounts ship (Phase 5) |
| Ubuntu VPS + Nginx + PM2 | Low-cost production hosting |

## MVP vs deferred

### MVP focus

- Public, no-login reading of interview content
- Admin CMS for questions, languages, categories, companies, blogs, pages
- SEO (metadata, sitemap, schema)
- AdSense placeholders in layout

### Deferred (store in schema later; implement after content MVP)

- User profile management UI
- Bookmarks
- Comments
- Reading history
- Premium membership, affiliates, job listings

Phase 2 may reserve `users` columns and empty related tables so we do not redesign later. No profile APIs or UI until explicitly scheduled.

## Development phases

1. **Project setup** — folders, env, health API, local run
2. **Database design** — tables, relationships, indexes, ER diagram
3. **Backend APIs** — public + admin CRUD
4. **Frontend** — layout, components, API integration
5. **Authentication** — email + Google, JWT, protected routes
6. **Admin CMS** — content and settings management
7. **SEO & performance** — metadata, sitemap, schema, CWV
8. **Test & deploy** — VPS, Nginx, PM2, HTTPS

Complete one phase before starting the next.

## Security baseline

- Passwords hashed with bcrypt (when auth ships)
- Parameterized SQL only (`pg` queries)
- Helmet, CORS locked to `CLIENT_URL`
- Validate inputs; never trust client data
- Secrets only in `.env` (gitignored)

## Cost principles

Prefer free/local tools first (local Postgres, single VPS). Avoid paid cloud services unless necessary for scale or reliability.

## UI design reference

Public MVP guest UI is specified in [`docs/design/README.md`](design/README.md) (architect-locked; mockups are references only). Implement in Phase 4 — not before.

SEO heading research for categories/languages: [`docs/seo-headings.md`](seo-headings.md).

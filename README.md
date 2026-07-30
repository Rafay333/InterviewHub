# InterviewHub

Production-grade interview preparation platform. Monorepo with Next.js frontend and Express API.

## Structure

```text
InterviewHub/
├── frontend/     # Next.js (App Router) — public site + future admin UI
├── backend/      # Express.js API
├── database/     # SQL migrations and seeds
└── docs/         # Architecture and project docs
```

## Prerequisites

- Node.js 20+ (LTS recommended)
- PostgreSQL 14+ (needed from Phase 2 onward)
- npm

## Local development

### Backend

```bash
cd backend
cp .env.example .env
npm install
npm run dev
```

API default: `http://localhost:5000`  
Health check: `GET http://localhost:5000/api/health`

### Frontend

```bash
cd frontend
cp .env.example .env.local
npm install
npm run dev
```

App default: `http://localhost:3000`

## Environment

Copy `.env.example` files — never commit real `.env` files or secrets.

## Current phase

**Phase 1 — Project setup** (complete when health check and Next.js both run).

Next: Phase 2 — Database design.

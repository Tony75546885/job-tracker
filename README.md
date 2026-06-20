# Job Application Tracker

Kanban-style web app for tracking job applications. Drag applications between columns (Applied / Interview / Offer / Rejected), set follow-up reminders, and use AI to auto-parse job postings.

[![CI](https://github.com/Tony75546885/job-tracker/actions/workflows/ci.yml/badge.svg)](https://github.com/Tony75546885/job-tracker/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

## Deploy

[![Deploy to Render](https://render.com/images/deploy-to-render-button.svg)](https://render.com/deploy?repo=https://github.com/Tony75546885/job-tracker)

## Stack

- **Frontend**: React (Vite), TypeScript, Tailwind CSS, dnd-kit, React Query
- **Backend**: Node.js, Express 5, TypeScript
- **Database**: PostgreSQL + Prisma ORM
- **Auth**: JWT (email + password, bcrypt)
- **AI**: Claude API (auto-parse job postings into structured data)

## Quick Start

### Prerequisites

- Node.js 20+ or Bun
- Docker (for PostgreSQL)

### 1. Start the database

```bash
docker compose up -d
```

### 2. Set up the backend

```bash
cd backend
cp .env.example .env
# Edit .env with your settings (defaults work with docker-compose)

bun install
npx prisma migrate dev
bun run dev
```

Backend runs on `http://localhost:3002`

### 3. Set up the frontend

```bash
cd frontend
bun install
bun run dev
```

Frontend runs on `http://localhost:5173` (proxies API requests to backend)

### 4. Open the app

Go to `http://localhost:5173`, register an account, and start tracking!

## API Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/auth/register` | No | Register new user |
| POST | `/api/auth/login` | No | Login |
| GET | `/api/auth/me` | Yes | Get current user |
| GET | `/api/applications` | Yes | List all applications |
| GET | `/api/applications/:id` | Yes | Get single application |
| POST | `/api/applications` | Yes | Create application |
| PUT | `/api/applications/:id` | Yes | Update application |
| PATCH | `/api/applications/:id/status` | Yes | Update status (drag & drop) |
| DELETE | `/api/applications/:id` | Yes | Delete application |
| POST | `/api/ai/parse-job` | Yes | Parse job posting with AI |

## AI Feature

The "Paste job description" button in the application form sends the text to Claude API, which extracts:
- Company name
- Position
- Tech stack
- Salary (if mentioned)

Requires `ANTHROPIC_API_KEY` in backend `.env`.

## Environment Variables

See `backend/.env.example` for all required variables.

## Tests

```bash
cd backend
bun run test
```

24 tests covering auth (registration, login, JWT) and CRUD operations.

## Deployment

- **Frontend**: Vercel (`cd frontend && vercel`)
- **Backend**: Railway or Render (set env vars, use `npm run build && npm start`)
- **Database**: Railway PostgreSQL or Supabase

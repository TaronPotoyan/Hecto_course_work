# Heckto

E-commerce storefront built with **Angular 21 (SSR)** and a **Node.js + TypeScript + PostgreSQL** API.

```
Heckto/
├── src/        Angular app (SSR via src/server.ts)
└── server/     REST API (Express 5, pg, JWT auth, Claude-powered support chat)
```

## Features

- Responsive layout (desktop → phone): mobile nav menu, filter drawer, stacked layouts
- Light / Dark / System themes (top bar → theme picker), saved per browser and applied before first paint
- Catalog, promotions and categories loaded from PostgreSQL
- Accounts: register / sign in (scrypt-hashed passwords, JWT)
- Newsletter sign-up
- Floating **support chatbot** (streams replies from Claude, knows the live catalog)

## Getting started

### 1. Database

Use any PostgreSQL 14+ instance. To start one with Docker:

```bash
cd server
docker compose up -d        # postgres on localhost:5432, user/pass postgres/postgres
```

### 2. API (`server/`)

```bash
cd server
cp .env.example .env        # set DATABASE_URL, JWT_SECRET (and ANTHROPIC_API_KEY for the chatbot)
npm install
npm run db:setup            # creates the database if needed, runs migrations, seeds the catalog
npm run dev                 # http://localhost:3000
```

The seed reads the catalog from `src/DB/indexDb.ts`, so edit products there and re-run `npm run db:seed`.

### 3. Frontend

```bash
npm install
npm start                   # http://localhost:4200, proxies /api → localhost:3000
```

Production: `npm run build && API_URL=http://localhost:3000 npm run serve:ssr:Heckto`
(the SSR server proxies `/api` to `API_URL`).

## API

| Method | Path | Description |
| --- | --- | --- |
| GET | `/api/health` | Health + DB check |
| GET | `/api/products?q=&type=&category=&brand=` | Products (optional filters) |
| GET | `/api/products/:id` | One product |
| GET | `/api/promotions` | Hero / discount promotions |
| GET | `/api/top-categories` | Top categories |
| POST | `/api/auth/register` | `{ name, email, password }` → `{ token, user }` |
| POST | `/api/auth/login` | `{ email, password }` → `{ token, user }` |
| GET | `/api/auth/me` | Current user (Bearer token) |
| POST | `/api/subscribers` | `{ email }` newsletter sign-up |
| POST | `/api/chat` | `{ messages: [{ role, content }] }` → Server-Sent Events stream |

### Support chatbot

`POST /api/chat` uses the Anthropic SDK (`claude-opus-5-5` by default, `CHAT_MODEL` to change) with the live
catalog in the system prompt. It is rate-limited to 20 messages/min per IP and history is capped at 20 turns.
Without `ANTHROPIC_API_KEY` the widget still works but replies that support isn't configured.

## Tests & lint

```bash
npm test          # Angular unit tests (Vitest)
npm run lint
cd server && npm run typecheck
```

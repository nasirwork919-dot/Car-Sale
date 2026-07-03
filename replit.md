# JustCarSale.com

## Overview
JustCarSale is a professional automotive marketplace and services platform (originally built in Google AI Studio). It's a React + Vite single-page application with a production Express + Prisma + PostgreSQL backend providing authentication and (growing) domain APIs, plus a small photo-sync/health endpoint in the frontend server.

## Tech Stack
- Frontend: React 19 + TypeScript, Vite 6, Tailwind CSS 4, Framer Motion (`motion`), lucide-react icons
- Frontend server: Express 4 (TypeScript, run via `tsx`) — serves the Vite dev middleware in development and static build output in production; also hosts the photo-sync/health endpoints and proxies `/api/*` to the backend
- Backend: Express 4 + TypeScript + Prisma ORM + PostgreSQL (Replit's built-in database), run via `tsx` on `localhost` only (not exposed to the public port)
- Auth: JWT (7-day expiry) + bcrypt password hashing

## Project Structure
- `server.ts` — Frontend Express server entry point (dev: Vite middleware mode; prod: serves `dist/`). Also proxies `/api/*` (except its own `/api/photo-sync/*` and `/api/health`) to the backend on `localhost:3001`.
- `server/` — Backend service: `index.ts` (entry point), `routes/`, `controllers/`, `middleware/`, `services/`, `utils/`, `prisma/schema.prisma`, `prisma/seed.ts`
- `src/` — React app source (`App.tsx`, `components/`, `data.ts`, `types.ts`) — frontend only, not touched by backend work
- `index.html` / `src/main.tsx` — Vite entry points
- `vite.config.ts` — Vite config (React + Tailwind plugins, dev server bound to `0.0.0.0` with `allowedHosts: true` for Replit's proxied preview)

## Backend Architecture
- Two Express processes run together under one workflow via `concurrently` (`npm run dev` = `dev:frontend` + `dev:backend`): frontend on `0.0.0.0:5000` (the only public/webview port), backend on `localhost:3001` (internal only).
- The frontend's `server.ts` forwards all other `/api/*` traffic to the backend using `http-proxy-middleware`. Two non-obvious fixes were required for this proxy to work correctly — see `.agents/memory/express-proxy-backend.md`.
- Database: PostgreSQL via Prisma. Schema in `server/prisma/schema.prisma` covers Users, BusinessProfiles, Vehicles, VehiclePhotos, Auctions, Bids, TransportRequests/Offers, Inspections, InsurancePolicies, Claims, OwnershipTransfers, StolenReports, Messages, Reviews, Bookings, Notifications, SpareParts, Documents, plus email verification / password reset tokens.
- Auth endpoints (all under `/api/auth`): `register`, `login`, `verify-email`, `forgot-password`, `reset-password`, `me` (JWT-protected), `complete-profile` (JWT-protected), `select-role` (JWT-protected; BUSINESS/INSURANCE/WORKSHOP/LOGISTICS upgrades are recorded as a pending notification requiring admin approval, not applied immediately).
- `requireAuth` / `requireRole(...)` middleware in `server/middleware/auth.ts` protect routes.
- Email sending is currently a console-log stub (`server/services/emailService.ts`) — no email provider is configured yet.
- Seed data: `npm run prisma:seed` creates 5 users (one per PERSONAL/BUSINESS/INSURANCE/WORKSHOP/GOVERNMENT role, password `Password123!`), 3 business profiles, 20 vehicles, 5 auctions.
- Useful scripts: `npm run prisma:generate`, `npm run prisma:migrate`, `npm run prisma:seed`.

## Replit Environment Setup
- Workflow "Start application" runs `npm run dev`, which starts both the frontend (port 5000, 0.0.0.0) and backend (port 3001, localhost) concurrently. Port 5000 is the only port Replit's webview/proxy uses.
- Vite dev server has `host: '0.0.0.0'` and `allowedHosts: true` so it works behind Replit's iframe proxy.
- PostgreSQL database is provisioned (Replit built-in); `DATABASE_URL` and related `PG*` vars are set automatically.
- `JWT_SECRET` is set as a generated shared env var (self-generated app secret, not a user-provided credential).
- The `@google/genai` dependency and `GEMINI_API_KEY` env var are present in the template but are not currently used anywhere in the codebase.

## User Preferences
- Do not modify anything under `src/` (the React frontend) without explicit request — backend work must live in `server/`.

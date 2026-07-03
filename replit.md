# JustCarSale.com

## Overview
JustCarSale is a professional automotive marketplace and services platform (originally built in Google AI Studio). It's a React + Vite single-page application with a small Express backend used for cross-device photo sync (mobile-to-desktop camera uploads) and a health check endpoint.

## Tech Stack
- Frontend: React 19 + TypeScript, Vite 6, Tailwind CSS 4, Framer Motion (`motion`), lucide-react icons
- Backend: Express 4 (TypeScript, run via `tsx`), serving the Vite dev middleware in development and static build output in production
- Single combined server/port: Express serves both the API routes and the Vite app on the same port

## Project Structure
- `server.ts` — Express server entry point (dev: Vite middleware mode; prod: serves `dist/`)
- `src/` — React app source (`App.tsx`, `components/`, `data.ts`, `types.ts`)
- `index.html` / `src/main.tsx` — Vite entry points
- `vite.config.ts` — Vite config (React + Tailwind plugins, dev server bound to `0.0.0.0` with `allowedHosts: true` for Replit's proxied preview)

## Replit Environment Setup
- Workflow "Start application" runs `npm run dev` (`tsx server.ts`), which serves the app on port 5000 (0.0.0.0), matching Replit's expected frontend port.
- Vite dev server has `host: '0.0.0.0'` and `allowedHosts: true` so it works behind Replit's iframe proxy.
- No database is used; in-memory Map stores temporary photo-sync sessions (non-persistent, resets on restart).
- The `@google/genai` dependency and `GEMINI_API_KEY` env var are present in the template but are not currently used anywhere in the codebase.

## User Preferences
None recorded yet.

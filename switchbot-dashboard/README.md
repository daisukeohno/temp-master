# Temp Master Dashboard

A fullstack web dashboard to monitor temperature readings from SwitchBot Meter devices.

## Features

- React 18 + TypeScript + Vite SPA styled with Tailwind CSS
- Temperature charts for all SwitchBot Meter devices using Recharts
- Multiple themes (Light / Dark / Ocean) switchable from the navbar, persisted in `localStorage`
- Time scale switching (hour/day/week/month/year)
- Auto-refresh every 30 seconds via TanStack Query (frontend) with background data collection every 2 minutes (backend)
- Meters with no updates for 7+ days are grouped into a separate "未更新のメーター" section
- Rate limiting protection with exponential backoff
- All API calls are cached - GET endpoints never call SwitchBot API directly

## Setup

### Backend

1. Navigate to the backend directory:
   ```bash
   cd switchbot-backend
   ```

2. Install dependencies:
   ```bash
   poetry install
   ```

3. Copy `.env.example` to `.env` and add your SwitchBot credentials:
   ```bash
   cp .env.example .env
   ```
   
   Get your credentials from the SwitchBot app:
   - Go to Profile > Preferences > About
   - Tap App Version 10 times to enable Developer Options
   - Go to Developer Options > Get Token

4. Start the development server:
   ```bash
   poetry run fastapi dev app/main.py
   ```

### Frontend

1. Navigate to the frontend directory:
   ```bash
   cd switchbot-frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. (Optional) Copy `.env.example` to `.env` to point the SPA at a non-default backend:
   ```bash
   cp .env.example .env
   ```
   `VITE_API_URL` is empty by default, which uses the same origin. During development the Vite dev
   server proxies `/api` and `/healthz` to `http://localhost:8000`, so no value is needed.

4. Start the development server:
   ```bash
   npm run dev
   ```

5. Open http://localhost:5173 in your browser

### Frontend scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Vite dev server on port 5173 (proxies `/api` and `/healthz` to port 8000) |
| `npm run build` | Type-check and build the production bundle into `dist/` |
| `npm run preview` | Serve the production build locally |
| `npm run lint` | ESLint (with Prettier compatibility) |
| `npm run format` | Format sources with Prettier |
| `npm run test` | Vitest + React Testing Library unit tests |

### Frontend stack

- React 18, TypeScript, Vite
- Tailwind CSS with CSS-variable theme tokens and a `data-theme` attribute strategy
- Recharts for temperature history charts
- TanStack Query for parallel data fetching and 30s auto-refresh

## API Endpoints

- `GET /api/meters` - Returns list of all meter devices with current temperature (from cache)
- `GET /api/meters/{device_id}/history` - Returns temperature history with time_scale parameter
- `POST /api/meters/refresh` - Triggers immediate data collection
- `GET /api/status` - Returns backend status and configuration
- `GET /api/backup` - Downloads the SQLite database file

## Docker

The `Dockerfile` is multi-stage: a `node:20-slim` stage runs `npm ci && npm run build` in
`switchbot-frontend/`, and the final Python stage copies the resulting `dist/` into
`switchbot-backend/static/`, which FastAPI serves (with an `index.html` SPA fallback).

```bash
cd switchbot-dashboard
docker build -t temp-master .
```

## Notes

- Temperature history is stored in memory and resets on backend restart
- Backend data collection interval: 2 minutes minimum
- Frontend refresh interval: 30 seconds
- SwitchBot API has strict rate limits (~10000 requests/day)

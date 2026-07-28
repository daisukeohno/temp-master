---
name: testing-temp-master
description: Test the Temp Master SwitchBot dashboard locally. Use when verifying UI changes, API connectivity, or branding updates.
---

# Testing Temp Master Dashboard

## Prerequisites

- Python 3.12+
- Poetry (dependency management)
- Node.js 20+ (frontend build)
- SwitchBot API credentials

## Devin Secrets Needed

- `SWITCHBOT_TOKEN` - SwitchBot API token
- `SWITCHBOT_SECRET` - SwitchBot API secret

## Local Development Setup

### 1. Install dependencies

```bash
cd switchbot-dashboard/switchbot-backend
poetry install --no-interaction
```

### 2. Create .env file

```bash
cd switchbot-dashboard/switchbot-backend
echo "SWITCHBOT_TOKEN=${SWITCHBOT_TOKEN}" > .env
echo "SWITCHBOT_SECRET=${SWITCHBOT_SECRET}" >> .env
```

### 3. Build the frontend and link it as static files

The frontend is a React 18 + TypeScript + Vite SPA. The Dockerfile builds it in a `node:20-slim`
stage and copies `switchbot-frontend/dist/` to `switchbot-backend/static/`. Locally, build it and
symlink `dist/`:

```bash
cd switchbot-dashboard/switchbot-frontend
npm ci
npm run build
cd ../..
ln -s $(pwd)/switchbot-dashboard/switchbot-frontend/dist switchbot-dashboard/switchbot-backend/static
```

**Important:** The static directory check in `main.py` happens at module import time (`STATIC_DIR = Path(__file__).resolve().parent.parent / "static"`). If you create the symlink after starting the server, you must restart the server.

Alternatively, run the Vite dev server (hot reload, proxies `/api` and `/healthz` to port 8000):

```bash
cd switchbot-dashboard/switchbot-frontend
npm run dev   # http://localhost:5173
```

### 4. Start the server

```bash
cd switchbot-dashboard/switchbot-backend
poetry run fastapi run app/main.py --host 0.0.0.0 --port 8000
```

The frontend is served at `http://localhost:8000/` and the API docs at `http://localhost:8000/docs`.

## Key Test Points

### Branding Verification
- Page title (`<title>` tag): should say "Temp Master Dashboard"
- Navbar brand: should say "Temp Master Dashboard"
- Footer: should say "Temp Master Dashboard v2.0 - Built with React 18 + TypeScript + Vite"
  (source of truth: `FOOTER_TEXT` in `switchbot-frontend/src/components/Footer.tsx`)
- Verify no "Snake" or "SnakeRoom" text exists anywhere: `document.body.innerHTML.includes('Snake')` should be `false`

### API Connectivity
- `GET /api/status` returns `configured: true` and `meters_count` > 0
- `GET /api/meters` returns live meter data with temperature, humidity, battery
- Connection status badge shows "Connected" (green); it is rendered with
  `data-testid="connection-status"`

### UI Functionality
- Meter grid: responsive 1/2/3-column card grid of active meters
- Stale meters (no update for 7+ days) appear in the separate "未更新のメーター" section
- Time Range selector: Last Hour / Last 24 Hours / Last 7 Days / Last 30 Days / Last Year
- Charts: inline `<svg>` Recharts area/line charts (no `<canvas>`)
- Refresh Data button triggers data reload; Download Backup hits `GET /api/backup`
- Theme selector in the navbar switches Light / Dark / Ocean; it sets `data-theme` on `<html>`,
  persists to `localStorage['temp-master:theme']`, and visibly changes background/text/chart colors

## Running Frontend Checks

```bash
cd switchbot-dashboard/switchbot-frontend
npm run lint
npm run test
npm run build
```

## Running Backend Tests

```bash
cd switchbot-dashboard/switchbot-backend
poetry run pytest -v
```

Expected: 97 tests pass.

## Architecture Notes

- Backend: FastAPI + aiosqlite (SQLite persistence at `/data/app.db` or local `app.db`)
- Frontend: React 18 + TypeScript + Vite, Tailwind CSS themes, Recharts, TanStack Query
- Deployment: Fly.io (see `fly.toml`)
- Background data collection runs with 120s interval, with rate limiting and exponential backoff

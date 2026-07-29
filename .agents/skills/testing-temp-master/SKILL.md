---
name: testing-temp-master
description: Test the Temp Master SwitchBot dashboard locally. Use when verifying UI changes, API connectivity, or branding updates.
---

# Testing Temp Master Dashboard

## Prerequisites

- Python 3.12+
- Poetry (dependency management)
- SwitchBot API credentials

## Devin Secrets Needed

- `SWITCHBOT_TOKEN` - SwitchBot API token
- `SWITCHBOT_SECRET` - SwitchBot API secret

## Architecture note (frontend is now Vite + React + TS)

The frontend is a **Vite + React 18 + TypeScript** SPA under
`switchbot-dashboard/switchbot-frontend/` (no longer a single jQuery/Bootstrap
`index.html`). For local development run the backend and the Vite dev server
separately; the dev server proxies `/api` to the backend. In production the
Docker build compiles the frontend to `dist/` and copies it into the backend's
`static/` dir, which FastAPI serves at `/`.

## Local Development Setup

### 1. Install backend dependencies

The backend requires Python 3.12. If the default `python` is older, point
poetry at 3.12 first:

```bash
cd switchbot-dashboard/switchbot-backend
poetry env use ~/.pyenv/versions/3.12.8/bin/python   # if default python < 3.12
poetry install --no-interaction
```

### 2. Create .env file

```bash
cd switchbot-dashboard/switchbot-backend
echo "SWITCHBOT_TOKEN=${SWITCHBOT_TOKEN}" > .env
echo "SWITCHBOT_SECRET=${SWITCHBOT_SECRET}" >> .env
```

### 3. Start the backend

```bash
cd switchbot-dashboard/switchbot-backend
poetry run fastapi run app/main.py --host 0.0.0.0 --port 8000
```

API docs are at `http://localhost:8000/docs`.

### 4. Start the frontend dev server

```bash
source ~/.nvm/nvm.sh
cd switchbot-dashboard/switchbot-frontend
npm install
npm run dev
```

Open `http://localhost:5173/`. The dev server proxies `/api` to
`http://localhost:8000` (see `vite.config.ts`), so keep the backend running.

To test the production-style single-origin serving instead, run
`npm run build` and copy/symlink `dist/` to `switchbot-backend/static/`
(the static dir check in `main.py` runs at import time, so restart the server
after creating it), then open `http://localhost:8000/`.

### Seeding data without SwitchBot credentials

If `SWITCHBOT_TOKEN`/`SWITCHBOT_SECRET` are unavailable, `GET /api/meters`
returns an empty list and no cards render. Seed sample data via
`POST /api/import` (see `ImportData` in `app/main.py`): send a few devices,
each with a `readings` array of recent ISO-8601 timestamps (temperature float,
humidity int) so history charts render. Include at least one device whose
`last_updated` is older than 7 days to exercise the "未更新のメーター" (stale)
section. Note: `POST /api/meters/refresh` returns 500 without credentials (the
UI handles this gracefully and stays "Connected").

## Key Test Points

### Branding Verification
- Page title (`<title>` tag): should say "Temp Master Dashboard"
- Navbar brand: should say "Temp Master Dashboard"
- Footer: should say "Temp Master Dashboard v2.0 - Built with React + Vite + TypeScript"
- Verify no "Snake" or "SnakeRoom" text exists anywhere

### API Connectivity
- `GET /api/status` returns `configured: true` and `meters_count` > 0 (with credentials)
- `GET /api/meters` returns live meter data with temperature, humidity, battery
- Connection status badge shows "Connected" (green)

### UI Functionality
- Time Range selector: Last Hour / Last 24 Hours / Last 7 Days / Last 30 Days / Last Year (charts refetch on change)
- Charts: Chart.js line charts rendered via `react-chartjs-2`
- Refresh Data button triggers a data reload
- Download Backup opens `/api/backup`
- Theme switcher (navbar): Light / Dark / Solarized / Ocean; card and chart colors update per theme and persist across reloads (localStorage)
- Stale meters (>7 days without update) appear in a separate "未更新のメーター" section

## Running Backend Tests

```bash
cd switchbot-dashboard/switchbot-backend
poetry run pytest -v
```

Expected: 97 tests pass.

## Architecture Notes

- Backend: FastAPI + aiosqlite (SQLite persistence at `/data/app.db` or local `app.db`)
- Frontend: Vite + React 18 + TypeScript SPA (`switchbot-frontend/`), TanStack Query, Chart.js 4
- Deployment: Fly.io (see `fly.toml`)
- Background data collection runs with 120s interval, with rate limiting and exponential backoff

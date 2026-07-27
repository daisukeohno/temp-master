---
name: testing-temp-master
description: Test the Temp Master SwitchBot dashboard locally. Use when verifying UI changes, API connectivity, or branding updates.
---

# Testing Temp Master Dashboard

## Prerequisites

- Python 3.12+
- Poetry (dependency management)
- Node.js 20+ / npm (frontend build)
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

### 3. Build the frontend and link it into `static/`

The frontend is a Vite + React + TypeScript app. The Dockerfile builds it and copies `switchbot-frontend/dist/` to `switchbot-backend/static/`; locally you reproduce this by building and symlinking `dist/`:

```bash
cd switchbot-dashboard/switchbot-frontend
npm ci
npm run build
cd ../..
ln -s $(pwd)/switchbot-dashboard/switchbot-frontend/dist switchbot-dashboard/switchbot-backend/static
```

**Important:** The static directory check in `main.py` happens at module import time (`STATIC_DIR = Path(__file__).resolve().parent.parent / "static"`). If you create the symlink after starting the server, you must restart the server. Re-run `npm run build` after every frontend change (the symlink points at `dist/`, so no re-linking is needed).

### 4. Start the server

```bash
cd switchbot-dashboard/switchbot-backend
poetry run fastapi run app/main.py --host 0.0.0.0 --port 8000
```

The frontend is served at `http://localhost:8000/` and the API docs at `http://localhost:8000/docs`.

### 5. (Alternative) Vite dev server with hot reload

For frontend iteration, run the backend as above and start the Vite dev server, which proxies `/api` to `http://localhost:8000`:

```bash
cd switchbot-dashboard/switchbot-frontend
npm install
npm run dev
```

The dev UI is served at `http://localhost:5173/`.

## Key Test Points

### Branding Verification
- Page title (`<title>` tag): should say "Temp Master Dashboard"
- Navbar brand: should say "Temp Master Dashboard"
- Footer: should say "Temp Master Dashboard v1.0 - Built with React + Vite"
- Verify no "Snake" or "SnakeRoom" text exists anywhere: `document.body.innerHTML.includes('Snake')` should be `false`

### API Connectivity
- `GET /api/status` returns `configured: true` and `meters_count` > 0
- `GET /api/meters` returns live meter data with temperature, humidity, battery
- Connection status badge shows "Connected" (green, class `label-success`)

### UI Functionality
- Meter grid: 3 columns on desktop, 2 on tablet, 1 on mobile
- Time Range selector: Last Hour / Last 24 Hours / Last 7 Days / Last 30 Days / Last Year
- Charts: Canvas elements rendered with Chart.js 4 line charts (`react-chartjs-2`)
- Refresh Data button triggers `POST /api/meters/refresh` and a data reload
- Download Backup button opens `/api/backup` in a new tab
- Stale meters (no update for >7 days) appear in the 未更新のメーター section

### Theme Switching
- Navbar theme selector offers Light / Dark / High Contrast
- Switching updates `document.documentElement`'s `data-theme` attribute and recolors the page and charts
- The selection persists in `localStorage` under `temp-master-theme`; without a stored value the initial theme follows `prefers-color-scheme`

## Running Backend Tests

```bash
cd switchbot-dashboard/switchbot-backend
poetry run pytest -v
```

Expected: 97 tests pass.

## Architecture Notes

- Backend: FastAPI + aiosqlite (SQLite persistence at `/data/app.db` or local `app.db`)
- Frontend: React 18 + TypeScript + Vite, TanStack Query, Chart.js 4 (`switchbot-frontend/src/`)
- Deployment: Fly.io (see `fly.toml`)
- Background data collection runs with 120s interval, with rate limiting and exponential backoff

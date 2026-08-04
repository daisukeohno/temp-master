---
name: testing-temp-master
description: Test the Temp Master SwitchBot dashboard locally. Use when verifying UI changes, API connectivity, or branding updates.
---

# Testing Temp Master Dashboard

## Prerequisites

- Python 3.12+
- Poetry (dependency management)
- Node.js 20+ (frontend is Vite + React + TypeScript)
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

The dashboard is at `http://localhost:5173/`; Vite proxies `/api` to `http://localhost:8000`.

### 5. (Optional) test the production serving path

The Dockerfile builds the frontend and copies `dist/` to `switchbot-backend/static/`. To reproduce locally:

```bash
(cd switchbot-dashboard/switchbot-frontend && npm run build)
ln -sfn ../switchbot-frontend/dist switchbot-dashboard/switchbot-backend/static
```

**Important:** the static directory check in `main.py` happens at module import time (`STATIC_DIR = Path(__file__).resolve().parent.parent / "static"`). If you create the symlink after starting the server, restart the server. The app is then served at `http://localhost:8000/`.

## Key Test Points

### Branding Verification
- Page title (`<title>` tag): should say "Temp Master Dashboard"
- Navbar brand: should say "Temp Master Dashboard"
- Footer: should say "Temp Master Dashboard v2.0 - Built with React + Vite + Recharts"
- Verify no "Snake" or "SnakeRoom" text exists anywhere: `document.body.innerHTML.includes('Snake')` should be `false`

### API Connectivity
- `GET /api/status` returns `configured: true` and `meters_count` > 0
- `GET /api/meters` returns live meter data with temperature, humidity, battery
- Connection status badge shows "Connected" (green, class `badge--success`)

### UI Functionality
- Time Range selector: Last Hour / Last 24 Hours / Last 7 Days / Last 30 Days / Last Year
- Charts: Recharts `LineChart` SVGs (not canvas)
- Refresh Data button triggers `POST /api/meters/refresh` and reloads
- Download Backup button downloads the SQLite file from `GET /api/backup`
- Theme select in the navbar: Light / Dark / Solarized / High Contrast; colors change immediately and
  the choice survives a page reload (`localStorage['temp-master-theme']`)
- Meters not updated for 7+ days appear in the "未更新のメーター" section without charts

## Running Tests

```bash
cd switchbot-dashboard/switchbot-backend
poetry run pytest -v
```

Expected: 97 tests pass.

```bash
source ~/.nvm/nvm.sh
cd switchbot-dashboard/switchbot-frontend
npm run lint
npm test
```

## Architecture Notes

- Backend: FastAPI + aiosqlite (SQLite persistence at `/data/app.db` or local `app.db`)
- Frontend: React 18 + TypeScript + Vite + Recharts (`src/`), themed with CSS variables
- Deployment: Fly.io (see `fly.toml`)
- Background data collection runs with 120s interval, with rate limiting and exponential backoff

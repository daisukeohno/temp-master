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

## Local Development Setup

### 1. Install dependencies

```bash
cd switchbot-dashboard/switchbot-backend
poetry install --no-interaction
```

The project requires Python `^3.12`. If the machine only has 3.10 (`poetry run` fails with
"Current Python version (3.10.x) is not allowed by the project"), provision 3.12 first:

```bash
uv python install 3.12
poetry env use $(uv python find 3.12)
poetry install --no-interaction
```

Start the server detached so it survives the shell call:
`setsid nohup poetry run fastapi run app/main.py --host 0.0.0.0 --port 8000 > /tmp/server.log 2>&1 &`

### 2. Create .env file (optional if you seed data instead)

```bash
cd switchbot-dashboard/switchbot-backend
echo "SWITCHBOT_TOKEN=${SWITCHBOT_TOKEN}" > .env
echo "SWITCHBOT_SECRET=${SWITCHBOT_SECRET}" >> .env
```

### 3. Build the frontend and symlink static files

The frontend is a Vite + React + TypeScript app. `vite build` emits `index.html` and `assets/`
directly into `switchbot-frontend/`:

```bash
cd switchbot-dashboard/switchbot-frontend
npm ci
npm run build
```

The Dockerfile copies that build output to `switchbot-backend/static/`, but locally this directory doesn't exist. You must create a symlink:

```bash
ln -s $(pwd)/switchbot-dashboard/switchbot-frontend switchbot-dashboard/switchbot-backend/static
```

**Important:** The static directory check in `main.py` happens at module import time (`STATIC_DIR = Path(__file__).resolve().parent.parent / "static"`). If you create the symlink after starting the server, you must restart the server.

### 4. Start the server

```bash
cd switchbot-dashboard/switchbot-backend
poetry run fastapi run app/main.py --host 0.0.0.0 --port 8000
```

The frontend is served at `http://localhost:8000/` and the API docs at `http://localhost:8000/docs`.

## Testing without SwitchBot credentials

The whole UI (meter cards, charts, stale section, themes) can be exercised without real credentials by
seeding the local SQLite DB through the unauthenticated `POST /api/import` endpoint
(`{"devices":[{device_id, device_name, device_type, current_temperature, current_humidity, battery,
last_updated, readings:[{timestamp, temperature, humidity, battery}]}]}`).

Tips:
- Use `device_name` values that exist in `src/lib/displayNames.ts` (e.g. `Bedroom Meter`, `外`, `ネズミ`)
  so the Japanese display-name mapping is exercised.
- Add one device with `last_updated` older than 7 days and one with no `last_updated` to populate the
  「未更新のメーター」 section.
- Spread readings over the last year (e.g. 5 min for the last 2h, 15 min for 48h, 3h for 30d, 12h for a
  year) so all five time scales render data.
- Devices are reloaded from `app.db` on startup, so seeded data survives a server restart.
- Without credentials `POST /api/meters/refresh` returns 500; the UI still reloads and does not crash,
  but it also shows no error (the banner is cleared by the following successful load).
- The `Refreshing...` / disabled button state is too fast to capture; temporarily adding
  `await asyncio.sleep(3)` at the top of `refresh_meters` makes it observable (revert afterwards).

## Key Test Points

### Branding Verification
- Page title (`<title>` tag): should say "Temp Master Dashboard"
- Navbar brand: should say "Temp Master Dashboard"
- Footer: should say "Temp Master Dashboard v2.0 - Built with Vite + React + TypeScript"
- Verify no "Snake" or "SnakeRoom" text exists anywhere: `document.body.innerHTML.includes('Snake')` should be `false`

### API Connectivity
- `GET /api/status` returns `configured: true` and `meters_count` > 0
- `GET /api/meters` returns live meter data with temperature, humidity, battery
- Connection status badge shows "Connected" (green, `[data-testid="connection-status"]`)

### UI Functionality
- Time Range selector: Last Hour / Last 24 Hours / Last 7 Days / Last 30 Days / Last Year
- Charts: inline SVG area charts rendered with Recharts
- Refresh Data button triggers data reload
- Theme selector in the navbar: ライト / ダーク / ハイコントラスト, persisted in `localStorage`
  under `temp-master-theme` and reapplied after reload

## Running Backend Tests

```bash
cd switchbot-dashboard/switchbot-backend
poetry run pytest -v
```

Expected: 97 tests pass.

## Architecture Notes

- Backend: FastAPI + aiosqlite (SQLite persistence at `/data/app.db` or local `app.db`)
- Frontend: Vite + React 18 + TypeScript + Tailwind CSS + Recharts (`switchbot-frontend/src/`)
- Deployment: Fly.io (see `fly.toml`)
- Background data collection runs with 120s interval, with rate limiting and exponential backoff

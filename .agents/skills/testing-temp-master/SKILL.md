---
name: testing-temp-master
description: Test the Temp Master SwitchBot dashboard locally. Use when verifying UI changes, API connectivity, theme/chart behavior, or branding updates.
---

# Testing Temp Master Dashboard

## Prerequisites

- Python 3.12+ (the project pins `^3.12`; poetry refuses to run on 3.10)
- Poetry (dependency management)
- SwitchBot API credentials

## Devin Secrets Needed

- `SWITCHBOT_TOKEN` - SwitchBot API token
- `SWITCHBOT_SECRET` - SwitchBot API secret

Without these the backend returns `configured: false` and **zero meters**, so the meter grid,
charts, Time Range selector and stale-meters section cannot be exercised at all. Request them
before planning UI tests.

## Local Development Setup

### 1. Install dependencies

```bash
cd switchbot-dashboard/switchbot-backend
poetry install --no-interaction
```

If the box only has Python 3.10, `poetry run` fails with
"Current Python version (3.10.x) is not allowed by the project (^3.12)". Workaround:

```bash
uv venv --python 3.12 /tmp/venv312
uv pip install --python /tmp/venv312/bin/python fastapi aiosqlite python-dotenv httpx uvicorn
/tmp/venv312/bin/python -m uvicorn app.main:app --port 8000   # run from switchbot-backend/
```

### 2. Create .env file

```bash
cd switchbot-dashboard/switchbot-backend
echo "SWITCHBOT_TOKEN=${SWITCHBOT_TOKEN}" > .env
echo "SWITCHBOT_SECRET=${SWITCHBOT_SECRET}" >> .env
```

`DB_PATH` env var overrides the SQLite location (defaults to `/data/app.db` if `/data` exists,
else `./app.db`) — handy for a throwaway DB during testing.

### 3. Frontend

For frontend development/testing prefer `npm run dev` in `switchbot-dashboard/switchbot-frontend`
(port 5173), which proxies `/api` to `http://localhost:8000`. No static symlink needed in this mode.

To test the production-served path instead, build and symlink:

```bash
(cd switchbot-dashboard/switchbot-frontend && npm ci && npm run build)
ln -s $(pwd)/switchbot-dashboard/switchbot-frontend/dist switchbot-dashboard/switchbot-backend/static
```

**Important:** `STATIC_DIR` is resolved at module import time, so create the symlink *before*
starting the server.

### 4. Fallback when credentials are unavailable

If SwitchBot credentials cannot be obtained, you can still exercise the real FastAPI app by
stubbing only the SwitchBot HTTP layer. Write a throwaway runner (do NOT commit it) that:

1. sets `SWITCHBOT_TOKEN` / `SWITCHBOT_SECRET` / `DB_PATH` env vars **before** importing `app.main`
   (they are read at module import time),
2. seeds devices/readings via `main.init_database()`, `main.save_device_to_db()`,
   `main.save_reading_to_db()` — include one device with `last_updated` older than 7 days to
   populate the 未更新のメーター section,
3. replaces `main.fetch_devices` / `main.fetch_device_status` with async fakes
   (`collect_data` looks them up as module globals, so this also makes the Refresh Data button work;
   return `{}` with no `temperature` for the stale device so it stays stale),
4. runs `uvicorn.run(main.app, port=8000)`.

Label such results clearly in the report as not verified against real devices.

## Key Test Points

### Branding Verification
- Page title (`<title>` tag): "Temp Master Dashboard"
- Navbar brand: "Temp Master Dashboard"
- Footer: "Temp Master Dashboard v1.0 - Built with React + Vite"
- No "Snake"/"SnakeRoom" text anywhere

### API Connectivity
- `GET /api/status` returns `configured: true` and `meters_count` > 0
- `GET /api/meters` returns live meter data with temperature, humidity, battery
- Navbar badge shows green `Connected`

### UI Functionality (React SPA)
- Theme selector (navbar, `#theme-select`): Light / Dark / Ocean, persisted in `localStorage`
  key `temp-master-theme`.
- Time Range selector (`#time-scale-select`): Last Hour / 24 Hours / 7 Days / 30 Days / Year.
  X-axis label format is the strongest signal that a re-fetch happened:
  `HH:MM` (hour/day), `Mon 10` (week), `Jul 20` (month/year) — see `src/lib/format.ts`.
- Charts: Recharts SVG line charts; stale meters render no chart, only
  「履歴データの取得対象外」.
- Refresh Data button shows `Refreshing...` and becomes `disabled` while the POST is in flight —
  add an artificial delay in the stub (~0.4 s per device) to capture that state.

### Regression to watch: chart colors lagging one theme change behind
Chart colors come from `useThemeColor` in `src/theme/ThemeProvider.tsx`, which reads CSS custom
properties from `document.documentElement`. This regresses if the `data-theme` / `.dark` write
ever moves back into a `useEffect`: React flushes child effects before parent effects, so
`MeterChart` would read the *previous* theme's palette and the line/axis/grid colors would stay
stale until a reload. `applyTheme()` must therefore be called **synchronously** (inside `setTheme`
and in the `useState` initializer), not from an effect — only `localStorage` persistence belongs
in the effect.

How to test it reliably: switch themes with the selector (no reload) and compare the chart line
color against a Tailwind-driven element with the same accent — the Refresh Data button — inside
the *same* screenshot. They must match. Expected accents: light `#d9534f` (red),
dark `#f59e0b` (orange), ocean `#0f8b8d` (teal). Reloading masks the bug, so never judge theme
colors from a freshly loaded page alone.

Note: `[vite] Could not Fast Refresh ("useTheme" export is incompatible)` is an expected dev-only
HMR debug message (the module exports both a component and hooks), not a runtime error.

## Running Tests

```bash
cd switchbot-dashboard/switchbot-backend && poetry run pytest -v   # expect 97 passing
cd switchbot-dashboard/switchbot-frontend && npm test              # vitest
```

## Architecture Notes

- Backend: FastAPI + aiosqlite (SQLite persistence at `/data/app.db` or local `app.db`)
- Frontend: React 18 + TypeScript + Vite + Tailwind + Recharts + TanStack Query
  (`switchbot-frontend/`), queries auto-refetch every 30 s
- Deployment: Fly.io (see `fly.toml`)
- Background data collection interval is 3600 s; override `main.DATA_COLLECTION_INTERVAL` in a
  test harness to avoid surprise refreshes mid-test

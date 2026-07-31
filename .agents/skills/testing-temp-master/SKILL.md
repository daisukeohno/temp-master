---
name: testing-temp-master
description: Test the Temp Master SwitchBot dashboard locally. Use when verifying UI changes, API connectivity, or branding updates.
---

# Testing Temp Master Dashboard

## Prerequisites

- Python 3.12+
- Poetry (dependency management)
- Node.js 22+ / npm (frontend)
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
cd switchbot-dashboard/switchbot-frontend
npm install
npm run dev
```

Open `http://localhost:5173` - Vite proxies `/api` to `http://localhost:8000`.

### 4b. No SwitchBot credentials? Seed the local SQLite DB instead

Credentials may not be attached to the session (`list_secrets` empty, no `.env`). The
frontend still renders fully from the DB, because `GET /api/meters` serves
`data_store.devices`, which `lifespan` loads from SQLite at startup, and
`GET /api/meters/{id}/history` reads the `readings` table directly. Only the live
collection path needs the API.

Seed `switchbot-dashboard/switchbot-backend/app.db` (DB_PATH defaults to `app.db`
relative to CWD when `/data` does not exist, so always start the backend from the
backend directory) with:

- 2-3 **active** devices whose `device_name` matches keys in
  `switchbot-frontend/src/constants.ts` `DISPLAY_NAMES` (e.g. `Bedroom Meter`,
  `Living Meter`, `外`) and `last_updated` = now, so the plant-equipment name
  mapping is actually exercised.
- 1 **stale** device with `last_updated` ~11 days ago (threshold is 7 days in
  `constants.ts`) to populate the 未更新のメーター section.
- `readings` rows at mixed granularity so every Time Range option has visibly
  different data: 5-minute steps for the last ~3h, hourly for 30 days, daily for
  1 year. With only hourly data the Last Hour chart looks nearly empty.

Restart the backend after seeding (devices are cached in memory at startup).
Note the app.db is gitignored, but delete it between runs to avoid stale devices.

### 4c. Making the Refresh Data pending state observable

Without credentials `POST /api/meters/refresh` returns HTTP 500
(`SwitchBot credentials not configured`) instantly, so the button's
`Refreshing...`/disabled state cannot be captured, and the UI shows **no** error
(only query errors are surfaced in `App.tsx`; the mutation error is unhandled).
To demo the pending + reload path, temporarily patch the endpoint behind an env
flag (e.g. `FAKE_REFRESH=1`) to `await asyncio.sleep(3)`, bump
`current_temperature`/`last_updated` on non-stale devices, and persist via
`save_device_to_db` / `save_reading_to_db`. **Revert with `git checkout` when
done** and label this clearly in the report as a stub, with the live path marked
untested.

### 5. (Optional) Test the production layout

The Dockerfile builds the frontend and copies `dist/` to `switchbot-backend/static/`. To reproduce locally:

```bash
(cd switchbot-dashboard/switchbot-frontend && npm run build)
ln -s $(pwd)/switchbot-dashboard/switchbot-frontend/dist switchbot-dashboard/switchbot-backend/static
```

**Important:** The static directory check in `main.py` happens at module import time (`STATIC_DIR = Path(__file__).resolve().parent.parent / "static"`). If you create the symlink after starting the server, you must restart the server.

## Key Test Points

### Branding Verification
- Page title (`<title>` tag): should say "Temp Master Dashboard"
- Navbar brand: should say "Temp Master Dashboard"
- Footer: should say "Temp Master Dashboard v2.0 - Built with Vite + React + TypeScript"
- Verify no "Snake" or "SnakeRoom" text exists anywhere: `document.body.innerHTML.includes('Snake')` should be `false`

### API Connectivity
- `GET /api/status` returns `configured: true` and `meters_count` > 0
- `GET /api/meters` returns live meter data with temperature, humidity, battery
- Connection status badge shows "Connected" (green, class `badge-success`)

### UI Functionality
- Time Range selector: Last Hour / Last 24 Hours / Last 7 Days / Last 30 Days / Last Year
- Charts: Recharts SVG area charts, one per active meter
- Refresh Data button triggers `POST /api/meters/refresh` and a data reload
- Download Backup button opens `/api/backup` in a new tab
- Theme selector in the navbar (Light / Dark / High Contrast); the choice persists in
  `localStorage` under `temp-master-theme` and chart colors follow the theme
- Meters with no reading in the last 7 days appear in the "未更新のメーター" section

### Time Range X-axis label formats (`src/utils/format.ts`)

Switching Time Range must change the X-axis tick format, which is the strongest
signal that history was actually re-fetched and re-rendered:

| Option | Expected tick format |
|---|---|
| Last Hour / Last 24 Hours | `HH:MM` (e.g. `07:48`) |
| Last 7 Days | weekday + hour (e.g. `Fri 08`) |
| Last 30 Days / Last Year | month + day (e.g. `Jul 31`) |

### Theme verification

Don't stop at background/text colors - verify the **chart** follows the theme,
since `useChartColors` reads CSS custom properties and must re-read them on
theme change. Expected `--chart-line` per theme (`src/styles/tokens.css`):
light `#d9534f` (red), dark `#ff7b6b` (salmon), high-contrast `#ffff00` (yellow).
High Contrast is the easiest visual proof. Then reload the page and confirm the
selection sticks (`localStorage['temp-master-theme']`).

### Native select interaction

The Time Range and Theme controls are native `<select>` elements. Click the
select, then click the option in the popup list; do not set values via the
devtools console, since the recording should show real user interaction.

## Running Backend Tests

```bash
cd switchbot-dashboard/switchbot-backend
poetry run pytest -v
```

Expected: 97 tests pass.

## Running Frontend Checks

```bash
cd switchbot-dashboard/switchbot-frontend
npm run lint
npm run build
```

## Architecture Notes

- Backend: FastAPI + aiosqlite (SQLite persistence at `/data/app.db` or local `app.db`)
- Frontend: Vite + React 18 + TypeScript, Recharts, TanStack Query, CSS custom property themes
- Deployment: Fly.io (see `fly.toml`)
- Background data collection runs with 120s interval, with rate limiting and exponential backoff

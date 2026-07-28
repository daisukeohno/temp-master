# Temp Master Dashboard

A fullstack web dashboard to monitor temperature readings from SwitchBot Meter devices.

- Backend: FastAPI + aiosqlite (`switchbot-backend/`)
- Frontend: Vite + React 18 + TypeScript SPA (`switchbot-frontend/`)

## Features

- Temperature charts for all SwitchBot Meter devices using [Recharts](https://recharts.org/)
- Time scale switching (hour / day / week / month / year)
- Auto-refresh every 30 seconds via TanStack Query, with background data collection every 2 minutes (backend)
- Stale meter detection: devices with no update for over 7 days are moved to a separate section
- Theme switching (Light / Dark / Dracula / Solarized / High Contrast) persisted in `localStorage`
- Database backup download
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

4. Start the development server (listens on http://localhost:8000):
   ```bash
   poetry run fastapi dev app/main.py
   ```

### Frontend

1. Navigate to the frontend directory:
   ```bash
   cd switchbot-frontend
   ```

2. Install dependencies (Node.js 20+):
   ```bash
   npm install
   ```

3. Optionally copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```
   `VITE_API_URL` is empty by default, meaning the app uses relative paths. The Vite dev server
   proxies `/api` and `/healthz` to `http://localhost:8000`, so no configuration is needed for
   local development.

4. Start the development server:
   ```bash
   npm run dev
   ```

5. Open http://localhost:5173 in your browser

### Production build

```bash
cd switchbot-frontend
npm run build     # type-checks and emits static assets to dist/
npm run preview   # optional: preview the production build
```

The FastAPI backend serves the SPA from `switchbot-backend/static/` (see `STATIC_DIR` in
`app/main.py`), with an SPA fallback to `index.html`. To reproduce that locally, symlink the
build output:

```bash
ln -s $(pwd)/switchbot-frontend/dist switchbot-backend/static
```

The symlink is resolved at module import time, so restart the backend after creating it.

### Docker

The `Dockerfile` is multi-stage: a Node stage builds the frontend, and the Python stage copies
`dist/` into `static/`.

```bash
cd switchbot-dashboard
docker build -t temp-master .
docker run --rm -p 8000:8000 \
  -e SWITCHBOT_TOKEN=... -e SWITCHBOT_SECRET=... \
  temp-master
```

Then open http://localhost:8000.

## Themes

Themes are implemented with Tailwind (`darkMode: 'class'`) plus CSS custom properties defined in
`src/theme/themes.ts`. `ThemeProvider` (`src/theme/ThemeProvider.tsx`) applies the variables to
`<html>`, toggles the `dark` class, and persists the choice under the `temp-master-theme`
`localStorage` key. On first load the OS `prefers-color-scheme` setting is respected.

Chart colors (line, grid, axis, tooltip) come from the active theme, so graphs follow the theme.

To add a theme, add an entry to `THEMES` in `src/theme/themes.ts` — the navbar selector is
generated from that map.

## Project structure

```
switchbot-frontend/
  src/
    api/            # typed API client and response types
    components/     # MeterCard, TemperatureChart, StatusBar, Toolbar, ThemeSelector
    constants/      # display name mapping, time scale options
    theme/          # theme definitions and ThemeProvider
    utils/          # timestamp formatting, stale meter detection
    App.tsx
```

## API Endpoints

- `GET /api/meters` - Returns list of all meter devices with current temperature (from cache)
- `GET /api/meters/{device_id}/history` - Returns temperature history with time_scale parameter
- `POST /api/meters/refresh` - Triggers immediate data collection
- `GET /api/status` - Returns backend status and configuration
- `GET /api/backup` - Downloads the SQLite database file

## Notes

- Temperature history is persisted in SQLite (`/data/app.db` in production, `app.db` locally)
- Backend data collection interval: 2 minutes minimum
- Frontend refresh interval: 30 seconds
- SwitchBot API has strict rate limits (~10000 requests/day)

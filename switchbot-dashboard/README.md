# Temp Master Dashboard

A fullstack web dashboard to monitor temperature readings from SwitchBot Meter devices.

## Features

- React 18 + TypeScript + Vite frontend with TanStack Query for data fetching
- Temperature charts for all SwitchBot Meter devices using Recharts
- Multiple themes (Light / Dark / High Contrast / Ocean) with `localStorage` persistence
- Time scale switching (hour/day/week/month/year)
- Auto-refresh every 30 seconds (frontend) with background data collection every 2 minutes (backend)
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

Stack: React 18, TypeScript, Vite, TanStack Query, Recharts. CSS-variable based theming
(`data-theme` attribute on `document.documentElement`).

1. Navigate to the frontend directory:
   ```bash
   cd switchbot-frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Copy `.env.example` to `.env` (optional):
   ```bash
   cp .env.example .env
   ```

   - `VITE_API_URL` overrides the API base URL. Leave empty to use the same origin.
   - `VITE_DEV_PROXY_TARGET` (default `http://localhost:8000`) is the backend the Vite dev
     server proxies `/api` requests to.

4. Start the development server:
   ```bash
   npm run dev
   ```

5. Open http://localhost:5173 in your browser

#### Production build

```bash
npm run build   # emits static assets into switchbot-frontend/dist/
npm run preview # serve the build locally
```

The FastAPI backend serves whatever is in `switchbot-backend/static/` and falls back to
`index.html` for unknown paths, so the Vite output can be served as-is. To serve the built
frontend from the backend locally, point the static directory at `dist`:

```bash
cd switchbot-dashboard/switchbot-frontend && npm run build
ln -s $(pwd)/dist ../switchbot-backend/static
```

The symlink must exist before the backend starts (`STATIC_DIR` is resolved at import time).

#### Themes

The navbar theme switcher offers Light, Dark, High Contrast and Ocean. The selection is
stored in `localStorage` (`temp-master-theme`); on first visit the OS `prefers-color-scheme`
setting is used. Colors — including the Recharts line/fill/grid colors — come from CSS
variables defined per theme in `src/theme/themes.css`.

## API Endpoints

- `GET /api/meters` - Returns list of all meter devices with current temperature (from cache)
- `GET /api/meters/{device_id}/history` - Returns temperature history with time_scale parameter
- `POST /api/meters/refresh` - Triggers immediate data collection
- `GET /api/status` - Returns backend status and configuration

## Notes

- Temperature history is stored in memory and resets on backend restart
- Backend data collection interval: 2 minutes minimum
- Frontend refresh interval: 30 seconds (React Query `refetchInterval`)
- SwitchBot API has strict rate limits (~10000 requests/day)

# Temp Master Dashboard

A fullstack web dashboard to monitor temperature readings from SwitchBot Meter devices.

## Features

- React 18 + TypeScript SPA (Vite, TanStack Query, Tailwind CSS, Chart.js v4)
- Temperature charts for all SwitchBot Meter devices
- Time scale switching (hour/day/week/month/year)
- Theme switcher (Light / Dark / Industrial / High Contrast), persisted in `localStorage`
- Stale meters (no update for 7+ days) shown in a separate section
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

1. Navigate to the frontend directory:
   ```bash
   cd switchbot-frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the Vite dev server (proxies `/api` to the backend on port 8000):
   ```bash
   npm run dev
   ```

4. Open http://localhost:5173 in your browser

   The proxy is configured in `vite.config.ts`, so the backend must be running on
   http://localhost:8000. Symlinking the frontend into `switchbot-backend/static`
   is no longer needed for development.

5. Production build (outputs to `switchbot-frontend/dist/`):
   ```bash
   npm run build
   ```

6. Type check:
   ```bash
   npm run lint
   ```

### Frontend structure

- `src/api/` - typed API client (`client.ts`, `types.ts`) and TanStack Query hooks (`queries.ts`)
- `src/components/` - navbar, controls, status bar, meter panels, charts
- `src/theme/` - theme provider (`data-theme` attribute + CSS variables) and chart color hook

The legacy jQuery + Bootstrap 3 single-file implementation was removed; `index.html`
is now the Vite entry HTML. See git history for the old implementation.

### Deployment

The `Dockerfile` is a multi-stage build: a Node stage runs `npm ci && npm run build`
for `switchbot-frontend/`, and the Vite `dist/` output is copied into the backend image
at `./static/`. The FastAPI catch-all route serves `static/index.html`, so SPA routing
and hashed `assets/` files work without extra configuration.

## API Endpoints

- `GET /api/meters` - Returns list of all meter devices with current temperature (from cache)
- `GET /api/meters/{device_id}/history` - Returns temperature history with time_scale parameter
- `POST /api/meters/refresh` - Triggers immediate data collection
- `GET /api/status` - Returns backend status and configuration

## Notes

- Temperature history is stored in memory and resets on backend restart
- Backend data collection interval: 2 minutes minimum
- Frontend refresh interval: 30 seconds
- SwitchBot API has strict rate limits (~10000 requests/day)

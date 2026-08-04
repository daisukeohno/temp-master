# Temp Master Dashboard

A fullstack web dashboard to monitor temperature readings from SwitchBot Meter devices.

## Features

- React 18 + TypeScript + Vite frontend
- Temperature charts for all SwitchBot Meter devices using Recharts
- Time scale switching (hour/day/week/month/year)
- Multiple themes (Light / Dark / Solarized / High Contrast) driven by CSS variables, persisted in localStorage
- Meters not updated for 7+ days are separated into a "未更新のメーター" section
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

Requires Node.js 20+ (Node 22 recommended).

1. Navigate to the frontend directory:
   ```bash
   cd switchbot-frontend
   ```

2. Install dependencies:
   ```bash
   npm ci
   ```

3. (Optional) copy `.env.example` to `.env` to override the API base URL or the dev proxy target:
   ```bash
   cp .env.example .env
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

5. Open http://localhost:5173 in your browser. `/api` requests are proxied to the backend at
   http://localhost:8000 (configurable via `VITE_DEV_BACKEND_URL`).

#### Frontend scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Vite dev server on port 5173 with `/api` proxy |
| `npm run build` | Type-check and build the production bundle into `dist/` |
| `npm run preview` | Serve the production build locally |
| `npm run lint` | `tsc -b` type-check + ESLint |
| `npm run format` / `npm run format:check` | Prettier write / check |
| `npm test` | Vitest + React Testing Library component tests |

#### Themes

Themes are defined as CSS variable sets in `src/styles/global.css` and selected through the
`ThemeProvider` / `ThemeContext` in `src/theme/`. The navbar select switches between Light, Dark,
Solarized and High Contrast. The first visit follows `prefers-color-scheme`, and later choices are
persisted in `localStorage` under `temp-master-theme`. Chart and card colors read the same variables,
so switching themes restyles the Recharts graphs too.

#### Frontend structure

```
switchbot-frontend/
  index.html          Vite entry
  src/main.tsx        React root + ThemeProvider
  src/App.tsx         Dashboard composition
  src/api/            Typed API client (client.ts, types.ts)
  src/components/     Navbar, Controls, StatusBar, MeterCard, TemperatureChart, ...
  src/hooks/          useDashboardData (30s polling), useHistories
  src/theme/          ThemeContext, ThemeProvider, theme definitions
  src/styles/         global.css with per-theme CSS variables
```

## Production build & Docker

`switchbot-dashboard/Dockerfile` is a multi-stage build: a Node stage runs `npm ci && npm run build`
and the resulting `dist/` is copied into the backend image as `static/`, which FastAPI serves as a
SPA (with `index.html` fallback) on the same origin as the API.

```bash
cd switchbot-dashboard
docker build -t temp-master .
docker run -p 8000:8000 --env-file switchbot-backend/.env temp-master
```

To serve the built frontend from a local backend without Docker, point the backend's `static/`
directory at the build output:

```bash
(cd switchbot-frontend && npm run build)
ln -sfn ../switchbot-frontend/dist switchbot-backend/static
```

## API Endpoints

- `GET /api/meters` - Returns list of all meter devices with current temperature (from cache)
- `GET /api/meters/{device_id}/history` - Returns temperature history with time_scale parameter
- `POST /api/meters/refresh` - Triggers immediate data collection
- `GET /api/status` - Returns backend status and configuration
- `GET /api/backup` - Downloads the SQLite database file

## Notes

- Temperature history is stored in memory and resets on backend restart
- Backend data collection interval: 2 minutes minimum
- Frontend refresh interval: 30 seconds
- SwitchBot API has strict rate limits (~10000 requests/day)

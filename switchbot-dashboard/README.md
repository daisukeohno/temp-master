# Temp Master Dashboard

A fullstack web dashboard to monitor temperature readings from SwitchBot Meter devices.

## Features

- Temperature charts for all SwitchBot Meter devices using Recharts
- Time scale switching (hour/day/week/month/year)
- Multiple UI themes (light / dark / high-contrast) persisted in `localStorage`
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

The frontend is a Vite + React + TypeScript SPA styled with Tailwind CSS, charting with Recharts.

1. Navigate to the frontend directory:
   ```bash
   cd switchbot-frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the Vite development server (requests to `/api` are proxied to the backend on
   http://localhost:8000):
   ```bash
   npm run dev
   ```

4. Open http://localhost:5173 in your browser

Other scripts: `npm run build` (typecheck + production build), `npm run lint`, `npm run preview`.

#### Build output and static serving

`vite build` uses `src/` as the Vite root and emits the bundle **into the `switchbot-frontend/`
directory itself** (`index.html` plus `assets/`). The backend serves that directory: the Dockerfile
copies only the build output into `switchbot-backend/static/`, and `main.py` serves it at `/` with
an SPA fallback (unknown paths return `index.html`). The generated `index.html` and `assets/` are
gitignored.

For local testing of the production build against the backend:

```bash
cd switchbot-frontend && npm run build
ln -s "$(pwd)" ../switchbot-backend/static   # only once
cd ../switchbot-backend && poetry run fastapi run app/main.py
```

#### Themes

Three themes are available (light, dark, high-contrast), switchable from the navbar. The selection
is stored in `localStorage` under `temp-master-theme`; on first visit the OS `prefers-color-scheme`
setting is used. Themes are implemented with CSS variables plus Tailwind's `darkMode: 'class'`, and
the chart colors follow the active theme.

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

# Temp Master Dashboard

A fullstack web dashboard to monitor temperature readings from SwitchBot Meter devices.

## Features

- Temperature charts for all SwitchBot Meter devices using Chart.js (via `react-chartjs-2`)
- Time scale switching (hour/day/week/month/year)
- Auto-refresh every 30 seconds (frontend, via TanStack Query polling) with background data collection on the backend
- Rate limiting protection with exponential backoff
- All API calls are cached - GET endpoints never call SwitchBot API directly
- Multiple selectable UI themes (Light / Dark / Solarized / Ocean), persisted to `localStorage`, with charts recolored to match the active theme
- Stale-meter detection: devices with no update for over 7 days are grouped into a separate "未更新のメーター" section

## Tech Stack

- **Backend:** Python 3.12, FastAPI, aiosqlite, Poetry
- **Frontend:** Vite + React 18 + TypeScript, TanStack Query, Chart.js 4 (`react-chartjs-2`). No Bootstrap/jQuery — styling is plain CSS with CSS custom properties for theming.

The backend serves the built frontend from `switchbot-backend/static/` and falls back to `index.html` for unknown paths (SPA routing).

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

The frontend is a Vite + React + TypeScript app in `switchbot-frontend/`.

1. Navigate to the frontend directory:
   ```bash
   cd switchbot-frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

   The dev server proxies `/api` requests to the backend at `http://localhost:8000`
   (configured in `vite.config.ts`), so run the backend alongside it.

4. Open http://localhost:5173 in your browser

#### Building for production

```bash
npm run build   # type-checks then emits static assets to dist/
```

The production build is a set of static files in `dist/`. In Docker this is
built in a Node stage and copied into the backend's `static/` directory (see
`Dockerfile`), so the FastAPI backend serves the compiled React app at `/`.

#### Themes

Themes are defined as CSS custom properties in `src/styles/themes.css` and
applied via the `data-theme` attribute on `<html>`. Use the theme dropdown in
the navbar to switch between Light, Dark, Solarized, and Ocean. The choice is
persisted to `localStorage`; on first visit the OS `prefers-color-scheme` is
respected. Chart colors are read from the active theme's CSS variables.

## API Endpoints

- `GET /api/meters` - Returns list of all meter devices with current temperature (from cache)
- `GET /api/meters/{device_id}/history` - Returns temperature history with time_scale parameter
- `POST /api/meters/refresh` - Triggers immediate data collection
- `GET /api/status` - Returns backend status and configuration
- `GET /api/backup` - Downloads the SQLite database file for backup

## Notes

- Temperature history is stored in memory and resets on backend restart
- Backend data collection interval: 2 minutes minimum
- Frontend refresh interval: 30 seconds
- SwitchBot API has strict rate limits (~10000 requests/day)

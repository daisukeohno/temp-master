# Temp Master Dashboard

A fullstack web dashboard to monitor temperature readings from SwitchBot Meter devices.

## Features

- Temperature charts for all SwitchBot Meter devices using Recharts
- Time scale switching (hour/day/week/month/year)
- Multiple themes (Light / Dark / Ocean / Sunset) with the selection persisted in `localStorage`
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

Stack: React 18 + TypeScript + Vite, with TanStack Query for data fetching/polling,
Recharts for the temperature charts, and Tailwind CSS driven by CSS custom properties
for theming.

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

4. Open http://localhost:5173 in your browser

The dev server proxies `/api` and `/healthz` to `http://localhost:8000`, so run the
backend alongside it.

Other scripts:

- `npm run build` - type-checks with `tsc` and produces the production bundle in `dist/`
- `npm run preview` - serves the production build locally
- `npm run lint` - type-check only (`tsc --noEmit`)

#### Themes

The navbar contains a theme switcher with four themes: **Light**, **Dark**, **Ocean**
and **Sunset**. Each theme is a set of CSS custom properties (`--color-bg`,
`--color-surface`, `--color-text`, `--color-primary`, ...) selected via the
`data-theme` attribute on `<html>`; chart colors follow the active theme as well.
The choice is stored in `localStorage` under `temp-master-theme`, and the initial
theme falls back to the OS `prefers-color-scheme` setting.

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

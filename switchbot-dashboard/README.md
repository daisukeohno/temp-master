# Temp Master Dashboard

A fullstack web dashboard to monitor temperature readings from SwitchBot Meter devices.

## Features

- React 18 + TypeScript SPA (built with Vite) with data fetching via TanStack Query
- Temperature charts for all SwitchBot Meter devices using Recharts
- Time scale switching (hour/day/week/month/year)
- Multiple color themes (Light / Dark / Solarized / High Contrast) with a navbar switcher,
  `localStorage` persistence and `prefers-color-scheme` as the initial default
- Stale meter detection: devices not updated for over 7 days are moved to a separate
  "未更新のメーター" section and excluded from charts
- Auto-refresh every 30 seconds (frontend) with background data collection (backend)
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

The frontend is a React 18 + TypeScript SPA built with Vite (`switchbot-frontend/`).

1. Navigate to the frontend directory:
   ```bash
   cd switchbot-frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. (Optional) Copy `.env.example` to `.env` to point the frontend at a backend:
   ```bash
   cp .env.example .env
   ```
   `VITE_API_URL` defaults to an empty string (same origin). Set it to a full URL
   (e.g. `https://temp-master.fly.dev`) to run the dev server against a remote backend.

4. Start the development server:
   ```bash
   npm run dev
   ```

5. Open http://localhost:5173 in your browser

#### Building for production

```bash
npm run build
```

This type-checks and outputs a static bundle to `switchbot-frontend/dist/`. In the
Docker image the build runs in a Node stage and `dist/` is copied into the backend's
`static/` directory, which FastAPI serves at `/` with SPA fallback routing.

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

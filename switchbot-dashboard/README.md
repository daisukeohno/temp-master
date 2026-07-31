# Temp Master Dashboard

A fullstack web dashboard to monitor temperature readings from SwitchBot Meter devices.

## Features

- React 18 + TypeScript SPA (Vite, Tailwind CSS, Recharts, TanStack Query)
- Temperature charts for all SwitchBot Meter devices using Recharts
- Multiple themes (Light / Dark / Solarized / High Contrast), persisted in `localStorage`
- Time scale switching (hour/day/week/month/year)
- Stale meters (no update for 7+ days) are listed in a separate section without charts
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

3. Start the development server (proxies `/api` to the backend on port 8000):
   ```bash
   npm run dev
   ```

4. Open http://localhost:5173 in your browser

5. Production build (outputs to `dist/`, copied to the backend's `static/` by the Dockerfile):
   ```bash
   npm run build
   ```

6. Lint / format:
   ```bash
   npm run lint
   npm run format
   ```

The API base URL is same-origin by default and can be overridden with the `VITE_API_URL` env var.

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

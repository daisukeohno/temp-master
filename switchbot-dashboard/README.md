# Temp Master Dashboard

A fullstack web dashboard to monitor temperature readings from SwitchBot Meter devices.

## Features

- Temperature charts for all SwitchBot Meter devices using Recharts
- Time scale switching (hour/day/month/year)
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

   Also set `API_TOKEN` (see [Authentication](#authentication)):
   ```bash
   echo "API_TOKEN=$(openssl rand -hex 32)" >> .env
   ```

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

3. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

5. Open http://localhost:5173 in your browser

## API Endpoints

- `GET /api/meters` - Returns list of all meter devices with current temperature (from cache)
- `GET /api/meters/{device_id}/history` - Returns temperature history with time_scale parameter
- `POST /api/meters/refresh` - Triggers immediate data collection
- `GET /api/status` - Returns backend status and configuration
- `POST /api/import` - Imports historical data (**requires authentication**)
- `GET /api/backup` - Downloads the SQLite database file (**requires authentication**)

## Authentication

`GET /api/backup` and `POST /api/import` expose and mutate the whole database, so they are
protected by a Bearer token read from the `API_TOKEN` environment variable.

- If `API_TOKEN` is not set, both endpoints return `503` (fail closed).
- Requests without a valid token return `401`.

```bash
curl -H "Authorization: Bearer $API_TOKEN" https://temp-master.fly.dev/api/backup -o backup.db
```

On Fly.io, set it as a secret:

```bash
flyctl secrets set API_TOKEN="$(openssl rand -hex 32)"
```

### CORS

Browser origins allowed to call the API are configured with `ALLOWED_ORIGINS`
(comma separated). Credentials are not allowed on cross-origin requests.

## Database Backup

`backup_database.sh` periodically downloads the database. It requires `API_TOKEN`:

```bash
API_TOKEN=your_api_token ./backup_database.sh --loop
```

## Notes

- Temperature history is stored in memory and resets on backend restart
- Backend data collection interval: 2 minutes minimum
- Frontend refresh interval: 30 seconds
- SwitchBot API has strict rate limits (~10000 requests/day)

# SwitchBot Backend

FastAPI service that polls SwitchBot Meter devices, persists readings to SQLite,
and exposes them through a REST API.

## Setup

```bash
poetry install
cp .env.example .env   # then fill in the values
poetry run fastapi dev app/main.py
```

## Tests

```bash
poetry run pytest
```

## Environment Variables

| Variable | Required | Default | Description |
| --- | --- | --- | --- |
| `SWITCHBOT_TOKEN` | for polling | – | SwitchBot API token |
| `SWITCHBOT_SECRET` | for polling | – | SwitchBot API secret |
| `DASHBOARD_API_KEY` | **yes (for protected endpoints)** | – | API key guarding the sensitive endpoints. Sent via `X-API-Key` or `Authorization: Bearer <key>`. |
| `ALLOWED_ORIGINS` | no | `https://temp-master.fly.dev` | Comma-separated CORS allow-list |
| `DB_PATH` | no | `/data/app.db` or `app.db` | SQLite database path |

## Authentication

The following endpoints require authentication and **fail closed**: if
`DASHBOARD_API_KEY` is not set they return HTTP 503 rather than being exposed.
With the key configured, requests without a valid key receive HTTP 401.

- `POST /api/meters/refresh`
- `POST /api/import`
- `GET /api/backup`

Read-only endpoints (`/api/meters`, `/api/meters/{id}/history`, `/api/status`,
`/api/latency-logs`, `/api/latency-stats`, `/healthz`) remain public for
backward compatibility.

Example:

```bash
curl -H "X-API-Key: $DASHBOARD_API_KEY" https://temp-master.fly.dev/api/backup -o backup.db
```

On Fly.io, configure secrets with:

```bash
flyctl secrets set DASHBOARD_API_KEY="$(openssl rand -hex 32)"
flyctl secrets set ALLOWED_ORIGINS="https://temp-master.fly.dev"
```

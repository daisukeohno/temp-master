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

認証不要（読み取り専用の参照系）:

- `GET /api/meters` - Returns list of all meter devices with current temperature (from cache)
- `GET /api/meters/{device_id}/history` - Returns temperature history with time_scale parameter
- `GET /api/status` - Returns backend status and configuration
- `GET /api/latency-logs`, `GET /api/latency-stats`, `GET /healthz`

認証必須（機密データ・状態変更系。管理者APIキーが必要）:

- `POST /api/meters/refresh` - Triggers immediate data collection
- `POST /api/import` - 履歴データの投入
- `GET /api/backup` - SQLite データベースのダウンロード

## セキュリティ設定

### 管理者APIキー（ADMIN_API_KEY）

機密データの取得やデータ改ざんにつながるエンドポイントは、管理者APIキーによる認証が必須です。

- 環境変数 `ADMIN_API_KEY` にランダムな長い文字列を設定します（例: `openssl rand -hex 32`）。
- リクエストには `X-API-Key: <token>` または `Authorization: Bearer <token>` を付与します。
- キーが一致しない/未提示の場合は `401` を返します。
- `ADMIN_API_KEY` が未設定の場合は fail-closed とし、対象エンドポイントは `503` で無効化されます（未認証で公開される状態を残しません）。

```bash
curl -H "X-API-Key: $ADMIN_API_KEY" https://<host>/api/backup -o backup.db
```

本番（Fly.io）での設定例:

```bash
fly secrets set ADMIN_API_KEY=$(openssl rand -hex 32)
fly secrets set ALLOWED_ORIGINS=https://temp-master.fly.dev
```

### CORS（ALLOWED_ORIGINS）

- 許可オリジンは環境変数 `ALLOWED_ORIGINS`（カンマ区切り）で制御します。未設定時の既定値は `http://localhost:8000,http://127.0.0.1:8000` です。
- 本アプリは Cookie 認証を使用しないため `allow_credentials=False` です。ワイルドカード `*` と credentials の同時許可は行いません。

## Notes

- Temperature history is stored in memory and resets on backend restart
- Backend data collection interval: 2 minutes minimum
- Frontend refresh interval: 30 seconds
- SwitchBot API has strict rate limits (~10000 requests/day)

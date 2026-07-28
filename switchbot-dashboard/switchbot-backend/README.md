# SwitchBot Dashboard Backend

## 環境変数

`.env.example` をコピーして `.env` を作成し、以下を設定します。

| 変数名 | 必須 | 説明 |
| --- | --- | --- |
| `SWITCHBOT_TOKEN` | はい | SwitchBot API のトークン |
| `SWITCHBOT_SECRET` | はい | SwitchBot API のシークレット |
| `API_KEY` | はい | 機微エンドポイント（`GET /api/backup`, `POST /api/import`）を保護する共有シークレット |
| `REFRESH_MIN_INTERVAL` | いいえ | `POST /api/meters/refresh` の最短呼び出し間隔（秒、既定値 60） |

## API_KEY による認証

`GET /api/backup`（DBファイル全体のダウンロード）と `POST /api/import`（DBへの書き込み）は
API キー認証が必須です。以下のいずれかのヘッダで送信してください。

```bash
curl -H "Authorization: Bearer $API_KEY" https://<host>/api/backup -o backup.db
curl -H "X-API-Key: $API_KEY" https://<host>/api/backup -o backup.db
```

- **`API_KEY` が未設定の場合、これらのエンドポイントは 503 を返します（フェイルクローズド）。**
  デプロイ時には必ず設定してください。
- 認証に失敗した場合は 401 を返します。
- `GET /api/meters`, `GET /api/meters/{id}/history`, `GET /api/status`, `GET /healthz`,
  `POST /api/meters/refresh`、および静的ファイル配信は従来どおり認証不要です。
  `POST /api/meters/refresh` は認証の代わりにサーバ側スロットリング（既定 60 秒に 1 回、
  超過時は 429）で保護しています。

キーの生成例:

```bash
openssl rand -hex 32
```

### Fly.io での設定

```bash
fly secrets set API_KEY=$(openssl rand -hex 32)
```

`fly secrets set` を実行するとアプリが再デプロイされ、環境変数として反映されます。

### バックアップスクリプト

`switchbot-dashboard/backup_database.sh` も API キーが必要です。

```bash
API_KEY=your_api_key ./backup_database.sh
```

## テスト

```bash
poetry run pytest
```

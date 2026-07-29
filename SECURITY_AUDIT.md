# セキュリティ・依存関係 監査レポート

- **対象リポジトリ**: `daisukeohno/temp-master`
- **監査日**: 2026-07-29
- **対象コミット**: `604f84e`
- **対象範囲**: `switchbot-dashboard/switchbot-backend`（Python/FastAPI）、`switchbot-dashboard/switchbot-frontend`（jQuery SPA）、コンテナ／CI／デプロイ構成（Dockerfile、GitHub Actions、Fly.io）
- **監査手法**: `pip-audit`（`poetry.lock` の全 54 パッケージ）、PyPI メタデータによるライセンス／最新版比較、CDN 依存ライブラリの CVE 調査、ソースコードレビュー、コミット履歴のシークレット走査

---

## 1. エグゼクティブサマリ

本アプリケーションは Fly.io 上でインターネットに公開されており、**認証機構が一切存在しません**。その状態で「SQLite データベース全体をダウンロードできるエンドポイント」と「データベースへ任意に書き込めるエンドポイント」が公開されている点が、本監査で最も重大な問題です。

| 重大度 | 件数 | 概要 |
|---|---|---|
| **P0（即時対応）** | 5 | 無認証のデータ持ち出し／書き込み、CORS 設定不備、jQuery の既知 XSS、CDN の完全性検証欠如 |
| **P1（早期対応）** | 6 | 依存パッケージの既知脆弱性（starlette / python-multipart / urllib3 等）、内部情報を含むエラー返却、例外の握りつぶし、CI アクションの可変参照 |
| **P2（計画的対応）** | 6 | 古い依存関係、EOL ライブラリ、Dockerfile の root 実行・イメージ未固定、未使用の LGPL 依存 |

**結論**: 現状のまま公開運用を継続することは推奨できません。P0 の 5 件については、本監査と並行して 3 つのサブセッションで修正 PR を作成済みです（第 7 章参照）。

### P0 の修正状況（全件 PR 作成済み・CI グリーン）

| PR | 内容 | 対応した P0 |
|---|---|---|
| [#22](https://github.com/daisukeohno/temp-master/pull/22) | `/api/backup`・`/api/import` の Bearer トークン認証、CORS 是正、エラー情報漏洩の抑止 | P0-1, P0-2, P0-3 |
| [#20](https://github.com/daisukeohno/temp-master/pull/20) | jQuery 3.7.1 / Bootstrap 3.4.1 への更新、全 CDN タグへの SRI 付与 | P0-4, P0-5 |
| [#21](https://github.com/daisukeohno/temp-master/pull/21) | FastAPI をキャレット指定へ変更し、脆弱性のある依存 9 パッケージを一括更新（再監査で 0 件） | P1-1 |

> **重要**: PR #22 のマージ後は、デプロイ前に `flyctl secrets set API_TOKEN=...` の設定が必須です（未設定時は認証必須エンドポイントが 503 を返す fail-closed 動作）。

---

## 2. P0 — 即時対応が必要な問題

### P0-1. `GET /api/backup` が無認証でデータベース全体を配布している

- **場所**: `switchbot-dashboard/switchbot-backend/app/main.py`（`backup_database`）
- **内容**: SQLite ファイル（`/data/app.db`）を認証なしでそのまま `FileResponse` で返却しています。公開 URL を知る第三者は、`curl https://temp-master.fly.dev/api/backup` だけで全観測履歴・全デバイス ID・レイテンシログを取得できます。
- **影響**: 機密データの完全な流出（CWE-306: 重要機能に対する認証の欠如／CWE-200: 情報漏洩）。
- **対応**: `API_TOKEN` 環境変数による Bearer トークン認証を必須化。`backup_database.sh` も同トークンを送るよう更新。

### P0-2. `POST /api/import` が無認証でデータベースへ書き込める

- **場所**: `main.py`（`import_data`）
- **内容**: 任意のデバイス・観測値を無認証で `INSERT` できます。既存デバイス ID を指定すれば `INSERT OR REPLACE` により表示名や現在値を上書き可能です。
- **影響**: データ改ざん、偽の計測値の注入、レコード大量投入によるディスク枯渇（DoS）。産業プラントの温度監視という用途を踏まえると、誤った値の注入は業務判断の誤りに直結します。
- **対応**: 同じく認証必須化。加えて 1 リクエストあたりの件数上限とレート制限の導入を推奨。

### P0-3. CORS が `allow_origins=["*"]` かつ `allow_credentials=True`

- **場所**: `main.py`（`CORSMiddleware`）
- **内容**: ワイルドカードオリジンと資格情報許可の併用は仕様上不正な組み合わせであり、ブラウザ側で拒否されるか、実装によっては任意サイトからの資格情報付きリクエストを許すことになります。全メソッド・全ヘッダも許可されています。
- **対応**: 許可オリジンを本番ドメインへ明示列挙し、Cookie 認証を使わないため `allow_credentials=False`、メソッドは `GET`/`POST` に限定。

### P0-4. jQuery 1.12.4 に複数の既知 XSS 脆弱性

- **場所**: `switchbot-dashboard/switchbot-frontend/index.html`
- **内容**: 2016 年リリースの jQuery 1.12.4 を CDN から読み込んでいます。CVE-2015-9251（クロスドメイン ajax 応答による XSS）、CVE-2019-11358（`$.extend` のプロトタイプ汚染）、CVE-2020-11022 / CVE-2020-11023（HTML 挿入 API 経由の XSS）が該当します。
- **対応**: jQuery 3.7.x への更新と、DOM 挿入箇所のエスケープ確認。

### P0-5. CDN 読み込みに SRI（Subresource Integrity）が付いていない

- **場所**: `index.html` の全 `<script>` / `<link>` タグ（cdnjs から 4 ファイル）
- **内容**: `integrity` 属性が無いため、CDN の侵害や中間者攻撃によって差し替えられたスクリプトを検証なしで実行します。
- **対応**: 全 CDN 参照に `integrity` と `crossorigin="anonymous"` を付与（またはアセットを自己ホスト化）。

---

## 3. P1 — 早期対応が必要な問題

### P1-1. 依存パッケージの既知脆弱性（`pip-audit` 検出：9 パッケージ 23 件）

| パッケージ | 現行 | 脆弱性 ID | 修正版 |
|---|---|---|---|
| starlette | 0.50.0 | PYSEC-2026-161 / -248 / -249 / -2280 / -2281 | 1.3.1 |
| python-multipart | 0.0.21 | PYSEC-2026-1852 / -3036 / -3037 / -3038 / -3039 / -3040 | 0.0.31 |
| urllib3 | 2.6.3 | PYSEC-2026-141 / -142 | 2.7.0 |
| idna | 3.11 | PYSEC-2026-215 | 3.15 |
| pydantic-settings | 2.12.0 | GHSA-4xgf-cpjx-pc3j | 2.14.2 |
| python-dotenv | 1.2.1 | PYSEC-2026-2270 | 1.2.2 |
| click | 8.3.1 | PYSEC-2026-2132 | 8.3.3 |
| pygments | 2.19.2 | PYSEC-2026-2987 | 2.20.0 |
| pytest（開発用） | 8.4.2 | PYSEC-2026-1845 | 9.0.3 |

starlette と python-multipart は FastAPI 経由でリクエスト処理の中核に位置するため、実際に到達可能なコードパスです。`fastapi` が `0.127.0` に固定されているため starlette を単独で上げられない構成になっており、FastAPI 本体の更新が前提となります。

### P1-2. 外部 API のエラー本文をそのままクライアントへ返却

`main.py` の `call_switchbot_api` で `detail=f"SwitchBot API error: {response.text}"` としており、SwitchBot API の内部エラー内容がそのまま公開レスポンスに含まれます。ログにのみ記録し、クライアントには汎用メッセージを返すべきです。

### P1-3. 例外の握りつぶし

`collect_data()` の末尾が `except Exception: pass` になっており、収集処理の恒常的な失敗を検知できません。可用性・データ欠損の観点でリスクです。ログ出力と失敗カウンタの導入を推奨。

### P1-4. GitHub Actions を可変 ref で参照

`.github/workflows/deploy.yml` の `superfly/flyctl-actions/setup-flyctl@master` は可変参照です。上流が侵害された場合、`FLY_API_TOKEN` を含むデプロイ環境で任意コードが実行されます。コミット SHA でのピン留めを推奨。

### P1-5. ワークフローに `permissions` が未設定

`ci.yml` / `deploy.yml` ともに `permissions` 指定がなく、リポジトリ既定の広い `GITHUB_TOKEN` 権限が付与されます。`permissions: contents: read` を明示すべきです。

### P1-6. レート制限・リクエストサイズ制限の欠如

`POST /api/meters/refresh` は無認証で外部 API 呼び出しを誘発でき、SwitchBot API のレート制限（429）を第三者が意図的に枯渇させられます。

---

## 4. P2 — 計画的に対応すべき問題

### P2-1. 未使用の LGPL-3.0 依存（ライセンス上の懸念）

`pyproject.toml` に `psycopg[binary]` が宣言されていますが、コードベースからの参照はゼロです（SQLite/aiosqlite のみ使用）。`psycopg` および `psycopg-binary` は **LGPL-3.0-only** であり、依存関係全体の中で唯一のコピーレフト系ライセンスです。配布形態によってはライセンス義務が発生し得るため、**未使用である以上は削除するのが最善**です。

### P2-2. ライセンス全体の内訳

`poetry.lock` の 54 パッケージの内訳は以下のとおりで、LGPL 以外は全て寛容型ライセンスであり問題ありません。

| ライセンス | 件数 |
|---|---|
| MIT | 30 |
| BSD 系（2/3-Clause 含む） | 12 |
| Apache-2.0 | 5 |
| ISC | 2 |
| MPL-2.0 | 1 |
| PSF-2.0 | 1 |
| Unlicense（`email-validator`） | 1 |
| **LGPL-3.0-only（`psycopg`, `psycopg-binary`）** | **2** |

### P2-3. 古くなっている依存関係（主要なもの）

| パッケージ | 現行 | 最新 |
|---|---|---|
| fastapi | 0.127.0（完全固定） | 0.140.x |
| starlette | 0.50.0 | 1.3.1 |
| uvicorn | 0.40.0 | 0.51.0 |
| pytest | 8.4.2 | 9.1.1 |
| pytest-asyncio | 0.24.0 | 1.4.0 |
| pytest-cov | 6.3.0 | 7.1.0 |
| python-multipart | 0.0.21 | 0.0.32 |

`fastapi` のみキャレット無しの完全固定になっており、セキュリティ更新が自動的に入らない構成です。

### P2-4. フロントエンドの EOL ライブラリ

Bootstrap 3.3.7（2016 年、サポート終了。CVE-2018-14041 等の XSS あり）、Chart.js 2.9.4（メンテナンス終了）を使用しています。段階的な移行を推奨します。

### P2-5. Dockerfile の堅牢化不足

- コンテナが `root` で実行されている（非 root ユーザーを作成すべき）
- ベースイメージ `python:3.12-slim` がダイジェスト固定されていない
- `pip install poetry` がバージョン未固定で、ビルドの再現性とサプライチェーン耐性が低い

### P2-6. 静的ファイル配信の検証

`serve_spa` は `is_relative_to` によるパストラバーサル対策が実装されていますが、シンボリックリンク経由の抜けが無いかを含め、テストによる回帰防止を追加すべきです。

---

## 5. シークレット走査の結果

- コミット履歴（全ブランチの追加ファイル）に `.env` 実体や鍵ファイル、`*.db` の混入は**ありません**。
- ハードコードされたトークン・シークレットも検出されませんでした。
- `.gitignore` は `.envrc` / `.venv/` / `*.db` を正しく除外しています。
- 資格情報は環境変数（`SWITCHBOT_TOKEN` / `SWITCHBOT_SECRET`）で管理されており、`.env.example` にはプレースホルダのみが記載されています。**この点は適切です。**

---

## 6. 各サブセッションによる詳細確認結果

### 6-1. バックエンド依存関係（PR [#21](https://github.com/daisukeohno/temp-master/pull/21)）

- 23 件の脆弱性の根本原因は `fastapi = "0.127.0"` の完全固定により `starlette < 0.51.0` に縛られていたことでした。`fastapi = "^0.139.2"` へ変更し `poetry.lock` を再生成することで、starlette 1.3.1 / python-multipart 0.0.32 / urllib3 2.7.0 などへ更新し、**再監査で脆弱性 0 件**を確認しています。
- 各脆弱性の実影響評価（該当コードパスを本アプリが使用しているか）:
  - starlette 5 件: 本アプリは `request.url` に依存した認可・フォーム受付・`HTTPEndpoint`・`StaticFiles`（Windows）を使用しておらず、**実影響は低〜なし**。
  - python-multipart 6 件: フォーム／アップロードを受け付けないため**実影響なし**。
  - urllib3 2 件: 間接依存であり、プロキシもストリーミングも未使用のため**実影響なし**。
  - idna / click / pygments / python-dotenv / pydantic-settings / pytest: いずれも該当コードパス未使用で**実影響なし**。
- ただしライブラリの版が古いこと自体が将来の実影響リスクであるため、更新は実施済みです。
- サプライチェーン安全性の方針により、公開 7 日未満のバージョン（fastapi 0.140 系ほか 3 件）は意図的に見送っています。数日後に上限を外して追随するフォローアップが必要です。

### 6-2. フロントエンド（PR [#20](https://github.com/daisukeohno/temp-master/pull/20)）

- jQuery 1.12.4 → **3.7.1**、Bootstrap 3.3.7 → **3.4.1**（CVE-2018-14040/14041/14042 を解消）、Chart.js は 2.9.4 のまま SRI のみ付与。
- 全 CDN タグに `integrity`（sha384）+ `crossorigin="anonymous"` + `referrerpolicy="no-referrer"` を付与。
- jQuery 3 系への移行対応として `.change()` / `.click()` を `.on()` へ変更（`.bind()` / `$.parseJSON` / `.size()` の使用は無し）。
- **XSS 精査の結果**: `renderDefaultView` / `createMeterPanel` が `.html()` を使用していますが、デバイス名・ID・種別・温湿度・電池・更新時刻はすべて `escapeHtml()` を経由しており、未エスケープの挿入箇所はありませんでした。エラー／ステータス表示は `.text()` を使用しています。**この点は良好です。**

### 6-3. インフラ／API セキュリティ（PR [#22](https://github.com/daisukeohno/temp-master/pull/22)）

- `API_TOKEN` 環境変数による Bearer トークン認証を `/api/backup`・`/api/import` に追加。比較は `hmac.compare_digest` でタイミング攻撃を回避し、トークン未設定時は 503 を返す fail-closed 実装。
- CORS は `ALLOWED_ORIGINS` による明示指定 + `allow_credentials=False` へ是正。
- SwitchBot API のエラー本文・例外文字列をクライアントへ返さないよう変更し、`collect_data()` の例外握りつぶしをログ出力へ変更。
- `backup_database.sh`、フロントエンドのバックアップダウンロードボタン、README、`.env.example` を新認証に追随。テストは 97 → **106 件**に増加し全通過。
- Dockerfile と GitHub Actions の指摘（root 実行、イメージ未固定、可変 ref 参照、`permissions` 未設定）は監査のみで**未修正**です（第 4 章の残タスク）。

> **注意**: PR #20 と PR #22 はいずれも `switchbot-frontend/index.html` を変更しています。マージ時にコンフリクトが発生する可能性があるため、片方をマージ後にもう片方をリベースしてください。

---

## 7. 推奨対応順序

1. **即時**: PR #22 → #20 → #21 の順にレビュー・マージ（#20 と #22 は index.html でコンフリクトし得るため順にリベース）
2. **即時**: `flyctl secrets set API_TOKEN=...` を本番環境へ設定（未設定のままマージ・デプロイすると `/api/backup` が 503 になります）
3. **今週中**: 未使用の `psycopg`（LGPL-3.0-only）を依存から削除（P2-1）
4. **今週中**: CI の `permissions: contents: read` 明示、`superfly/flyctl-actions` の SHA ピン留め（P1-4、P1-5）
5. **今週中**: `/api/meters/refresh` のレート制限、`/api/latency-logs` の `limit` 上限クランプ（P1-6、P2）
6. **計画的**: Dockerfile の非 root 化・イメージダイジェスト固定・Poetry バージョン固定、Bootstrap／Chart.js の移行、公開 7 日未満だった依存への追随、Dependabot 等による継続的な依存監視の導入

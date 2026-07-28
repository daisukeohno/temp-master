# ---- build stage: 依存関係のみを仮想環境に構築する ----
FROM python:3.12-slim AS builder

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PIP_NO_CACHE_DIR=1 \
    PIP_DISABLE_PIP_VERSION_CHECK=1 \
    POETRY_VERSION=1.8.3 \
    POETRY_NO_INTERACTION=1

WORKDIR /app

RUN pip install "poetry==${POETRY_VERSION}"

COPY switchbot-backend/pyproject.toml switchbot-backend/poetry.lock ./
RUN poetry config virtualenvs.create true && \
    poetry config virtualenvs.in-project true && \
    poetry install --only main --no-root --no-interaction --no-ansi

# ---- runtime stage: poetry などのビルド用ツールを含めない ----
FROM python:3.12-slim AS runtime

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PIP_NO_CACHE_DIR=1 \
    PATH="/app/.venv/bin:$PATH"

WORKDIR /app

RUN groupadd --gid 10001 app && \
    useradd --uid 10001 --gid 10001 --no-create-home --shell /usr/sbin/nologin app && \
    mkdir -p /data && chown app:app /data

COPY --from=builder --chown=app:app /app/.venv ./.venv

COPY --chown=app:app switchbot-backend/app/ ./app/

# フロントエンドはルート ( / ) で配信される静的ファイル
COPY --chown=app:app switchbot-frontend/ ./static/

# 永続ボリューム /data は root 所有でマウントされることがあるため、
# entrypoint で所有者を調整してから非root ユーザーへ権限をドロップする
RUN printf '%s\n' \
    '#!/bin/sh' \
    'set -eu' \
    'if [ "$(id -u)" = "0" ]; then' \
    '    [ -d /data ] && chown app:app /data || true' \
    '    exec setpriv --reuid=10001 --regid=10001 --clear-groups "$@"' \
    'fi' \
    'exec "$@"' \
    > /usr/local/bin/docker-entrypoint.sh && \
    chmod 0755 /usr/local/bin/docker-entrypoint.sh

EXPOSE 8000

HEALTHCHECK --interval=30s --timeout=5s --start-period=20s --retries=3 \
    CMD ["python", "-c", "import urllib.request,sys; sys.exit(0 if urllib.request.urlopen('http://127.0.0.1:8000/healthz', timeout=3).status == 200 else 1)"]

ENTRYPOINT ["/usr/local/bin/docker-entrypoint.sh"]
CMD ["fastapi", "run", "app/main.py", "--host", "0.0.0.0", "--port", "8000"]

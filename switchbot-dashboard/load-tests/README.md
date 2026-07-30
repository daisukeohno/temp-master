# Load tests (k6)

Performance / non-functional test suite for the Temp Master backend. SLOs and
traffic assumptions live in [`docs/nfr.md`](../../docs/nfr.md); the thresholds
in these scripts encode that document, so a threshold breach fails the run.

## Install

```bash
sudo gpg -k
curl -sS https://dl.k6.io/key.gpg | sudo gpg --dearmor -o /usr/share/keyrings/k6-archive-keyring.gpg
echo "deb [signed-by=/usr/share/keyrings/k6-archive-keyring.gpg] https://dl.k6.io/deb stable main" | sudo tee /etc/apt/sources.list.d/k6.list
sudo apt-get update && sudo apt-get install k6
```

## Run

```bash
# 1. start the backend
cd ../switchbot-backend && DB_PATH=/tmp/loadtest.db poetry run fastapi run app/main.py --port 8000 &

# 2. seed synthetic data
k6 run -e BASE_URL=http://localhost:8000 -e DEVICES=10 -e READINGS=500 seed.js

# 3. smoke, then load
k6 run -e BASE_URL=http://localhost:8000 smoke.js
k6 run -e BASE_URL=http://localhost:8000 -e RPS=50 -e DURATION=1m \
       --summary-export=summary.json load.js
```

| Script | Purpose |
|---|---|
| `seed.js` | Populate synthetic devices/readings via `POST /api/import` |
| `smoke.js` | 1 VU / 30 s sanity check of endpoints and thresholds |
| `load.js` | Steady arrival rate at the documented SLOs (CI gate) |
| `spike.js` | Sudden burst to observe degradation and recovery |
| `soak.js` | Long steady run to surface leaks and DB growth |

## Options

| Env var | Default | Applies to |
|---|---|---|
| `BASE_URL` | `http://localhost:8000` | all |
| `RPS` | `50` (`20` for soak) | `load.js`, `soak.js` |
| `DURATION` | `1m` (`30m` for soak) | `load.js`, `soak.js` |
| `DEVICES` / `READINGS` | `10` / `500` | `seed.js` |

## Reading the output

Per-endpoint latency is reported as custom trends (`lat_meters`,
`lat_history`, `lat_status`, `lat_latency_stats`) so a slow endpoint is not
masked by fast ones in the aggregate `http_req_duration`.

## CI

`.github/workflows/load-test.yml` runs `smoke.js` + `load.js` on demand
(`workflow_dispatch`) and weekly, and uploads `summary.json` as an artifact.
It is not part of the per-PR gate — load numbers on shared runners are noisy.

# Load test results — baseline

Reference run establishing the baseline for the SLOs in [`nfr.md`](./nfr.md).
Re-run with `.github/workflows/load-test.yml` and compare against this page.

## Environment

| | |
|---|---|
| Backend | `fastapi run app/main.py` (single uvicorn worker), SQLite at `/tmp/loadtest.db` |
| Host | 1 VM, load generator and backend on the same machine (loopback) |
| Data | 10 devices × 500 readings, seeded via `seed.js` |
| k6 | v2.0.0 |

Because generator and target share a host, absolute numbers are optimistic at
high RPS; use them for regression comparison, not capacity planning.

## Smoke (1 VU, 30 s) — PASS

All checks 200, `http_req_failed` 0 %.

## Load (50 req/s, 1 min) — PASS

9 304 requests, 0 failures. Every threshold met:

| Metric | p95 | p99 | SLO (p95) |
|---|---|---|---|
| `lat_status` | 1.06 ms | — | 100 ms |
| `lat_meters` | 1.63 ms | 2.5 ms | 200 ms |
| `lat_history` | 14.62 ms | — | 300 ms |
| `lat_latency_stats` | 5.41 ms | — | 500 ms |

Headroom at the documented steady-state load is large (~100×).

## Spike (10 → 400 req/s burst, 1 min hold)

Finds the saturation point. The service stays correct but not fast:

| Metric | Value |
|---|---|
| Error rate | 0.33 % (54 / 16 179) — client-side timeouts, no 5xx |
| `http_req_duration` p95 | 15.72 s |
| `lat_history` p95 | 16.32 s |
| Dropped iterations | 23 589 (arrival rate could not be sustained) |
| Achieved throughput | ~95 req/s |

**Interpretation:** the ceiling is ~95–150 req/s on a single uvicorn worker.
Beyond that, requests queue rather than fail. `history` dominates the cost
(row fan-out from SQLite), `status`/`meters` stay sub-second because they read
the in-memory store.

**Follow-ups if the peak requirement grows:** run multiple uvicorn workers,
downsample history server-side for the week/month/year scales (the
`(device_id, timestamp)` index already exists — the cost is row fan-out and
JSON serialisation, not the lookup), and cache `/api/latency-stats`.

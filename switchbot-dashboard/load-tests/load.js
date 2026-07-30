// Load test against the documented SLOs in docs/nfr.md.
//
//   k6 run -e BASE_URL=http://localhost:8000 --summary-export=summary.json load.js
//
// Override the shape with env vars, e.g. -e RPS=100 -e DURATION=5m
import { sleep } from 'k6';
import { browseDashboard, latencyDashboard } from './lib/scenarios.js';

const RPS = parseInt(__ENV.RPS || '50', 10);
const DURATION = __ENV.DURATION || '1m';

export const options = {
  scenarios: {
    // Open model: hold a target arrival rate regardless of response time, so a
    // slowdown shows up as queueing rather than as reduced throughput.
    dashboard: {
      executor: 'constant-arrival-rate',
      rate: RPS,
      timeUnit: '1s',
      duration: DURATION,
      preAllocatedVUs: Math.max(20, RPS),
      maxVUs: Math.max(100, RPS * 4),
      exec: 'dashboard',
    },
    latency_page: {
      executor: 'constant-arrival-rate',
      rate: Math.max(1, Math.round(RPS / 10)),
      timeUnit: '1s',
      duration: DURATION,
      preAllocatedVUs: 10,
      maxVUs: 50,
      exec: 'latencyPage',
    },
  },
  thresholds: {
    // SLOs — see docs/nfr.md. A breach fails the k6 run (non-zero exit).
    http_req_failed: ['rate<0.001'],
    lat_meters: ['p(95)<200', 'p(99)<500'],
    lat_history: ['p(95)<300', 'p(99)<800'],
    lat_status: ['p(95)<100'],
    lat_latency_stats: ['p(95)<500'],
  },
};

export function dashboard() {
  browseDashboard();
}

export function latencyPage() {
  latencyDashboard();
  sleep(1);
}

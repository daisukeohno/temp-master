// Smoke test: 1 VU, short run. Verifies the endpoints work and the SLO
// thresholds are wired up correctly before spending time on a full load run.
//
//   k6 run -e BASE_URL=http://localhost:8000 smoke.js
import { sleep } from 'k6';
import { browseDashboard, latencyDashboard } from './lib/scenarios.js';

export const options = {
  vus: 1,
  duration: '30s',
  thresholds: {
    http_req_failed: ['rate<0.01'],
    http_req_duration: ['p(95)<500'],
  },
};

export default function () {
  browseDashboard();
  latencyDashboard();
  sleep(1);
}

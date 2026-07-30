// Spike test: sudden burst to find the breaking point / recovery behaviour.
// Thresholds are deliberately looser than load.js — the goal is to observe
// degradation and recovery, not to certify the SLO.
//
//   k6 run -e BASE_URL=http://localhost:8000 spike.js
import { browseDashboard } from './lib/scenarios.js';

export const options = {
  scenarios: {
    spike: {
      executor: 'ramping-arrival-rate',
      startRate: 10,
      timeUnit: '1s',
      preAllocatedVUs: 50,
      maxVUs: 800,
      stages: [
        { target: 10, duration: '30s' },   // baseline
        { target: 400, duration: '10s' },  // spike
        { target: 400, duration: '1m' },   // hold
        { target: 10, duration: '10s' },   // drop
        { target: 10, duration: '1m' },    // recovery window
      ],
    },
  },
  thresholds: {
    http_req_failed: ['rate<0.05'],
  },
};

export default function () {
  browseDashboard();
}

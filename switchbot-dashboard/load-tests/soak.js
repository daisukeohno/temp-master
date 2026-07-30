// Soak test: modest, steady load held for a long time to surface memory leaks,
// connection-pool exhaustion and unbounded SQLite growth.
//
//   k6 run -e BASE_URL=http://localhost:8000 -e DURATION=2h soak.js
//
// Watch backend RSS and DB size alongside this run, e.g.:
//   while sleep 60; do ps -o rss= -p <pid>; du -h app.db; done
import { sleep } from 'k6';
import { browseDashboard } from './lib/scenarios.js';

export const options = {
  scenarios: {
    soak: {
      executor: 'constant-arrival-rate',
      rate: parseInt(__ENV.RPS || '20', 10),
      timeUnit: '1s',
      duration: __ENV.DURATION || '30m',
      preAllocatedVUs: 30,
      maxVUs: 200,
    },
  },
  thresholds: {
    http_req_failed: ['rate<0.001'],
    // Latency must not drift upward over the run.
    http_req_duration: ['p(95)<400'],
  },
};

export default function () {
  browseDashboard();
  sleep(1);
}

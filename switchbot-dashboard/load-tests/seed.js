// Seeds the backend with synthetic meters + readings via POST /api/import.
// Run once before the load scenarios so history endpoints have realistic data.
//
//   k6 run -e BASE_URL=http://localhost:8000 -e DEVICES=10 -e READINGS=500 seed.js
import http from 'k6/http';
import { check } from 'k6';

const BASE_URL = __ENV.BASE_URL || 'http://localhost:8000';
const DEVICES = parseInt(__ENV.DEVICES || '10', 10);
const READINGS = parseInt(__ENV.READINGS || '500', 10);

export const options = { vus: 1, iterations: 1 };

function buildDevice(index, now) {
  const readings = [];
  for (let i = 0; i < READINGS; i++) {
    const ts = new Date(now - i * 60 * 1000).toISOString();
    readings.push({
      timestamp: ts,
      temperature: Math.round((20 + Math.sin(i / 20) * 5) * 10) / 10,
      humidity: 40 + (i % 20),
      battery: 100 - (i % 40),
    });
  }
  return {
    device_id: `LOADTEST${String(index).padStart(4, '0')}`,
    device_name: `Load Test Meter ${index}`,
    device_type: 'MeterPlus',
    current_temperature: 22.5,
    current_humidity: 48,
    battery: 91,
    last_updated: new Date(now).toISOString(),
    readings,
  };
}

export default function () {
  const now = Date.now();
  for (let d = 0; d < DEVICES; d++) {
    const res = http.post(
      `${BASE_URL}/api/import`,
      JSON.stringify({ devices: [buildDevice(d, now)] }),
      { headers: { 'Content-Type': 'application/json' }, timeout: '300s' }
    );
    check(res, { 'seed accepted': (r) => r.status === 200 });
    if (res.status !== 200) {
      throw new Error(`seed failed for device ${d}: ${res.status} ${res.body}`);
    }
  }
  console.log(`seeded ${DEVICES} devices x ${READINGS} readings`);
}

import http from 'k6/http';
import { check } from 'k6';
import { Trend } from 'k6/metrics';

export const BASE_URL = __ENV.BASE_URL || 'http://localhost:8000';

// Per-endpoint latency so a slow endpoint is not hidden by fast ones.
export const metersTrend = new Trend('lat_meters', true);
export const historyTrend = new Trend('lat_history', true);
export const statusTrend = new Trend('lat_status', true);
export const latencyStatsTrend = new Trend('lat_latency_stats', true);

const TIME_SCALES = ['hour', 'day', 'week', 'month'];

function record(res, trend, name) {
  trend.add(res.timings.duration);
  check(res, { [`${name} 200`]: (r) => r.status === 200 });
  return res;
}

// Representative user journey: open dashboard -> poll status -> drill into a
// meter's history at a few time scales. Weights roughly mirror the frontend.
export function browseDashboard() {
  const metersRes = record(
    http.get(`${BASE_URL}/api/meters`, { tags: { endpoint: 'meters' } }),
    metersTrend,
    'meters'
  );
  record(
    http.get(`${BASE_URL}/api/status`, { tags: { endpoint: 'status' } }),
    statusTrend,
    'status'
  );

  let deviceIds = [];
  try {
    deviceIds = (metersRes.json('meters') || []).map((m) => m.device_id);
  } catch (e) {
    deviceIds = [];
  }
  if (deviceIds.length === 0) return;

  const deviceId = deviceIds[Math.floor(Math.random() * deviceIds.length)];
  const scale = TIME_SCALES[Math.floor(Math.random() * TIME_SCALES.length)];
  record(
    http.get(`${BASE_URL}/api/meters/${deviceId}/history?time_scale=${scale}`, {
      tags: { endpoint: 'history', time_scale: scale },
    }),
    historyTrend,
    'history'
  );
}

export function latencyDashboard() {
  record(
    http.get(`${BASE_URL}/api/latency-stats`, { tags: { endpoint: 'latency-stats' } }),
    latencyStatsTrend,
    'latency-stats'
  );
}

export type TimeScale = 'hour' | 'day' | 'week' | 'month' | 'year';

export interface Meter {
  device_id: string;
  device_name: string;
  device_type: string;
  current_temperature: number | null;
  current_humidity: number | null;
  battery: number | null;
  last_updated: string | null;
}

export interface MetersResponse {
  meters: Meter[];
  last_updated: string | null;
}

export interface StatusResponse {
  configured: boolean;
  meters_count: number;
  is_rate_limited: boolean;
  backoff_remaining: number;
  last_api_call: string | null;
  collection_interval: number;
}

export interface HistoryPoint {
  timestamp: string;
  temperature: number | null;
  humidity: number | null;
}

export interface HistoryResponse {
  device_id: string;
  time_scale: TimeScale;
  history: HistoryPoint[];
  device: Meter;
}

// When served from the FastAPI backend (same origin) API_URL stays empty.
// When opened directly as a file:// URL, fall back to the production backend.
// VITE_API_URL overrides both.
export const API_URL =
  import.meta.env.VITE_API_URL ??
  (window.location.protocol === 'file:' ? 'https://temp-master.fly.dev' : '');

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_URL}${path}`, init);
  if (!response.ok) {
    throw new Error(`${response.status} ${response.statusText}`);
  }
  return (await response.json()) as T;
}

export function fetchMeters(): Promise<MetersResponse> {
  return request<MetersResponse>('/api/meters');
}

export function fetchStatus(): Promise<StatusResponse> {
  return request<StatusResponse>('/api/status');
}

export function fetchHistory(deviceId: string, timeScale: TimeScale): Promise<HistoryResponse> {
  return request<HistoryResponse>(
    `/api/meters/${encodeURIComponent(deviceId)}/history?time_scale=${timeScale}`
  );
}

export function triggerRefresh(): Promise<unknown> {
  return request<unknown>('/api/meters/refresh', { method: 'POST' });
}

export function backupUrl(): string {
  return `${API_URL}/api/backup`;
}

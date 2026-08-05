import type {
  HistoryResponse,
  MetersResponse,
  RefreshResponse,
  Status,
  TimeScale,
} from './types';

// When served from the FastAPI backend (same origin), API_URL stays empty.
// When opened directly as a file:// URL, fall back to the production backend.
export const API_URL =
  window.location.protocol === 'file:' ? 'https://temp-master.fly.dev' : '';

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

export function fetchStatus(): Promise<Status> {
  return request<Status>('/api/status');
}

export function fetchHistory(
  deviceId: string,
  timeScale: TimeScale,
): Promise<HistoryResponse> {
  return request<HistoryResponse>(
    `/api/meters/${encodeURIComponent(deviceId)}/history?time_scale=${timeScale}`,
  );
}

export function triggerRefresh(): Promise<RefreshResponse> {
  return request<RefreshResponse>('/api/meters/refresh', { method: 'POST' });
}

export function openBackup(): void {
  window.open(`${API_URL}/api/backup`, '_blank');
}

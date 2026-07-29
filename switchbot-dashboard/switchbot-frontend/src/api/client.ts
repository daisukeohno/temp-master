import type {
  HistoryResponse,
  MetersResponse,
  RefreshResponse,
  StatusResponse,
  TimeScale,
} from '../types';

/**
 * When served from the FastAPI backend (same origin) the base URL is empty.
 * When opened directly as a file:// URL, fall back to the production backend.
 */
export function getApiUrl(): string {
  if (typeof window !== 'undefined' && window.location.protocol === 'file:') {
    return 'https://temp-master.fly.dev';
  }
  return import.meta.env.VITE_API_URL ?? '';
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${getApiUrl()}${path}`, init);
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
    `/api/meters/${encodeURIComponent(deviceId)}/history?time_scale=${timeScale}`,
  );
}

export function triggerRefresh(): Promise<RefreshResponse> {
  return request<RefreshResponse>('/api/meters/refresh', { method: 'POST' });
}

export function openBackup(): void {
  window.open(`${getApiUrl()}/api/backup`, '_blank');
}

import type {
  HistoryResponse,
  MetersResponse,
  RefreshResponse,
  StatusResponse,
  TimeScale,
} from './types';

/**
 * Base URL for API calls.
 *
 * - Dev server: empty string, `/api` is proxied to the backend by Vite.
 * - Production: empty string, the SPA is served from the backend's static/ dir.
 * - `file://`: falls back to the deployed backend so the built page still works.
 */
export function resolveApiBaseUrl(): string {
  const configured = import.meta.env.VITE_API_BASE_URL;
  if (configured) {
    return configured.replace(/\/$/, '');
  }
  if (typeof window !== 'undefined' && window.location.protocol === 'file:') {
    return (import.meta.env.VITE_FILE_FALLBACK_API_URL ?? 'https://temp-master.fly.dev').replace(
      /\/$/,
      '',
    );
  }
  return '';
}

export const API_BASE_URL = resolveApiBaseUrl();

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: { Accept: 'application/json' },
    ...init,
  });
  if (!response.ok) {
    throw new Error(`${init?.method ?? 'GET'} ${path} failed: ${response.status}`);
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
  const query = new URLSearchParams({ time_scale: timeScale });
  return request<HistoryResponse>(
    `/api/meters/${encodeURIComponent(deviceId)}/history?${query.toString()}`,
  );
}

export function triggerRefresh(): Promise<RefreshResponse> {
  return request<RefreshResponse>('/api/meters/refresh', { method: 'POST' });
}

export function backupUrl(): string {
  return `${API_BASE_URL}/api/backup`;
}

export async function downloadBackup(): Promise<void> {
  const response = await fetch(backupUrl());
  if (!response.ok) {
    throw new Error(`GET /api/backup failed: ${response.status}`);
  }
  const blob = await response.blob();
  const objectUrl = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = objectUrl;
  link.download = filenameFromDisposition(response.headers.get('content-disposition'));
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(objectUrl);
}

function filenameFromDisposition(disposition: string | null): string {
  const match = disposition?.match(/filename="?([^";]+)"?/);
  return match ? match[1] : 'switchbot_backup.db';
}

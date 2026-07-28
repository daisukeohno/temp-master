import { apiFetch, apiUrl } from './client';
import type {
  MeterHistoryResponse,
  MetersResponse,
  RefreshResponse,
  StatusResponse,
  TimeScale,
} from './types';

export function getMeters(): Promise<MetersResponse> {
  return apiFetch<MetersResponse>('/api/meters');
}

export function getStatus(): Promise<StatusResponse> {
  return apiFetch<StatusResponse>('/api/status');
}

export function getMeterHistory(
  deviceId: string,
  timeScale: TimeScale,
): Promise<MeterHistoryResponse> {
  const query = new URLSearchParams({ time_scale: timeScale });
  return apiFetch<MeterHistoryResponse>(
    `/api/meters/${encodeURIComponent(deviceId)}/history?${query.toString()}`,
  );
}

export function refreshMeters(): Promise<RefreshResponse> {
  return apiFetch<RefreshResponse>('/api/meters/refresh', { method: 'POST' });
}

export function backupUrl(): string {
  return apiUrl('/api/backup');
}

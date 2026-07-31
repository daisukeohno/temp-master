import type {
  HistoryResponse,
  MetersResponse,
  StatusResponse,
  TimeScale,
} from './types'

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(path, init)
  if (!response.ok) {
    throw new Error(`${response.status} ${response.statusText}`)
  }
  return (await response.json()) as T
}

export function fetchMeters(): Promise<MetersResponse> {
  return request<MetersResponse>('/api/meters')
}

export function fetchStatus(): Promise<StatusResponse> {
  return request<StatusResponse>('/api/status')
}

export function fetchHistory(
  deviceId: string,
  timeScale: TimeScale,
): Promise<HistoryResponse> {
  const path = `/api/meters/${encodeURIComponent(deviceId)}/history?time_scale=${timeScale}`
  return request<HistoryResponse>(path)
}

export function triggerRefresh(): Promise<{ status: string }> {
  return request<{ status: string }>('/api/meters/refresh', { method: 'POST' })
}

export const BACKUP_URL = '/api/backup'

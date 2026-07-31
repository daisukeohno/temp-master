import type {
  HistoryResponse,
  MetersResponse,
  StatusResponse,
  TimeScale,
} from '../types'

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(path, init)
  if (!response.ok) {
    throw new Error(`${init?.method ?? 'GET'} ${path} failed: ${response.status}`)
  }
  return (await response.json()) as T
}

export function getMeters(): Promise<MetersResponse> {
  return request<MetersResponse>('/api/meters')
}

export function getStatus(): Promise<StatusResponse> {
  return request<StatusResponse>('/api/status')
}

export function getHistory(
  deviceId: string,
  timeScale: TimeScale,
): Promise<HistoryResponse> {
  const query = new URLSearchParams({ time_scale: timeScale })
  return request<HistoryResponse>(
    `/api/meters/${encodeURIComponent(deviceId)}/history?${query.toString()}`,
  )
}

export function refreshMeters(): Promise<{
  status: string
  message: string
  meters_count: number
}> {
  return request('/api/meters/refresh', { method: 'POST' })
}

export function openBackup(): void {
  window.open('/api/backup', '_blank', 'noopener')
}

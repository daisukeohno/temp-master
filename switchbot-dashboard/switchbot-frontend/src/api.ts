import type {
  HistoryResponse,
  MetersResponse,
  StatusResponse,
  TimeScale,
} from './types'

// When served from the FastAPI backend (same origin), API_URL stays empty.
// When opened directly as a file:// URL, fall back to the production backend.
export const API_URL =
  window.location.protocol === 'file:' ? 'https://temp-master.fly.dev' : ''

async function getJson<T>(path: string): Promise<T> {
  const response = await fetch(API_URL + path)
  if (!response.ok) {
    throw new Error(`${response.status} ${response.statusText}`)
  }
  return (await response.json()) as T
}

export function fetchMeters(): Promise<MetersResponse> {
  return getJson<MetersResponse>('/api/meters')
}

export function fetchStatus(): Promise<StatusResponse> {
  return getJson<StatusResponse>('/api/status')
}

export function fetchHistory(
  deviceId: string,
  timeScale: TimeScale,
): Promise<HistoryResponse> {
  return getJson<HistoryResponse>(
    `/api/meters/${encodeURIComponent(deviceId)}/history?time_scale=${timeScale}`,
  )
}

export async function triggerRefresh(): Promise<void> {
  const response = await fetch(API_URL + '/api/meters/refresh', {
    method: 'POST',
  })
  if (!response.ok) {
    throw new Error(`${response.status} ${response.statusText}`)
  }
}

export function openBackup(): void {
  window.open(API_URL + '/api/backup', '_blank')
}

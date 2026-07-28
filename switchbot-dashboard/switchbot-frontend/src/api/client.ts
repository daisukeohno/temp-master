import type {
  MeterHistoryResponse,
  MetersResponse,
  RefreshResponse,
  StatusResponse,
  TimeScale,
} from './types'

/**
 * When served from the FastAPI backend (same origin), the base URL stays empty.
 * When opened directly as a file:// URL, fall back to the production backend.
 * `VITE_API_URL` overrides both.
 */
function resolveApiUrl(): string {
  const configured = import.meta.env.VITE_API_URL
  if (configured) {
    return configured.replace(/\/$/, '')
  }
  if (window.location.protocol === 'file:') {
    return 'https://temp-master.fly.dev'
  }
  return ''
}

export const API_URL = resolveApiUrl()

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_URL}${path}`, init)
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

export function fetchMeterHistory(
  deviceId: string,
  timeScale: TimeScale,
): Promise<MeterHistoryResponse> {
  const path = `/api/meters/${encodeURIComponent(deviceId)}/history?time_scale=${timeScale}`
  return request<MeterHistoryResponse>(path)
}

export function triggerRefresh(): Promise<RefreshResponse> {
  return request<RefreshResponse>('/api/meters/refresh', { method: 'POST' })
}

export function backupUrl(): string {
  return `${API_URL}/api/backup`
}

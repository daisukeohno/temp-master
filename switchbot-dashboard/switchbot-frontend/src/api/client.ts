import type {
  HistoryResponse,
  MetersResponse,
  RefreshResponse,
  StatusResponse,
  TimeScale,
} from "./types";

// Base URL for the backend API. Defaults to the same origin (empty string),
// which is the case when the SPA is served by the FastAPI backend. Override
// with VITE_API_URL when developing against a remote backend.
export const API_URL = import.meta.env.VITE_API_URL ?? "";

async function getJson<T>(path: string): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    headers: { Accept: "application/json" },
  });
  if (!res.ok) {
    throw new Error(`Request failed (${res.status}): ${path}`);
  }
  return (await res.json()) as T;
}

export function fetchMeters(): Promise<MetersResponse> {
  return getJson<MetersResponse>("/api/meters");
}

export function fetchStatus(): Promise<StatusResponse> {
  return getJson<StatusResponse>("/api/status");
}

export function fetchHistory(
  deviceId: string,
  timeScale: TimeScale,
): Promise<HistoryResponse> {
  const params = new URLSearchParams({ time_scale: timeScale });
  return getJson<HistoryResponse>(
    `/api/meters/${encodeURIComponent(deviceId)}/history?${params.toString()}`,
  );
}

export async function triggerRefresh(): Promise<RefreshResponse> {
  const res = await fetch(`${API_URL}/api/meters/refresh`, { method: "POST" });
  if (!res.ok) {
    throw new Error(`Refresh failed (${res.status})`);
  }
  return (await res.json()) as RefreshResponse;
}

export function backupUrl(): string {
  return `${API_URL}/api/backup`;
}

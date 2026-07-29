import type {
  MeterHistory,
  MetersResponse,
  RefreshResponse,
  Status,
  TimeScale,
} from "./types";

// When served from the FastAPI backend (same origin) or via the Vite dev
// proxy, API_URL stays empty. When opened directly as a file:// URL, fall back
// to the production backend.
export const API_URL =
  window.location.protocol === "file:" ? "https://temp-master.fly.dev" : "";

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(API_URL + path, {
    headers: { Accept: "application/json" },
    ...init,
  });
  if (!response.ok) {
    throw new Error(`Request failed: ${response.status} ${response.statusText}`);
  }
  return (await response.json()) as T;
}

export function getMeters(): Promise<MetersResponse> {
  return request<MetersResponse>("/api/meters");
}

export function getMeterHistory(
  deviceId: string,
  timeScale: TimeScale,
): Promise<MeterHistory> {
  const params = new URLSearchParams({ time_scale: timeScale });
  return request<MeterHistory>(
    `/api/meters/${encodeURIComponent(deviceId)}/history?${params.toString()}`,
  );
}

export function refreshMeters(): Promise<RefreshResponse> {
  return request<RefreshResponse>("/api/meters/refresh", { method: "POST" });
}

export function getStatus(): Promise<Status> {
  return request<Status>("/api/status");
}

export function backupUrl(): string {
  return API_URL + "/api/backup";
}

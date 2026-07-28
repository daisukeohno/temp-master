/**
 * Base URL for the backend. Empty by default because the SPA is served by the
 * FastAPI backend (same origin) and proxied through Vite during development.
 */
export const API_URL: string = import.meta.env.VITE_API_URL ?? '';

export function apiUrl(path: string): string {
  return `${API_URL}${path}`;
}

export async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(apiUrl(path), init);
  if (!response.ok) {
    throw new Error(`${init?.method ?? 'GET'} ${path} failed: ${response.status}`);
  }
  return (await response.json()) as T;
}

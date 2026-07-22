export type ThemeId = "light" | "dark" | "solarized" | "high-contrast";

export interface ThemeMeta {
  id: ThemeId;
  label: string;
}

export const THEMES: ThemeMeta[] = [
  { id: "light", label: "Light" },
  { id: "dark", label: "Dark" },
  { id: "solarized", label: "Solarized" },
  { id: "high-contrast", label: "High Contrast" },
];

export const DEFAULT_THEME: ThemeId = "light";
export const STORAGE_KEY = "temp-master-theme";

export function isThemeId(value: string | null): value is ThemeId {
  return THEMES.some((t) => t.id === value);
}

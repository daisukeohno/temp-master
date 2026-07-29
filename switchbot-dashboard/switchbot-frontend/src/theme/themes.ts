export const THEMES = ["light", "dark", "solarized", "ocean"] as const;

export type ThemeName = (typeof THEMES)[number];

export const THEME_LABELS: Record<ThemeName, string> = {
  light: "Light",
  dark: "Dark",
  solarized: "Solarized",
  ocean: "Ocean",
};

const STORAGE_KEY = "temp-master-theme";

function isThemeName(value: string | null): value is ThemeName {
  return value !== null && (THEMES as readonly string[]).includes(value);
}

export function getInitialTheme(): ThemeName {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (isThemeName(stored)) {
    return stored;
  }
  if (
    window.matchMedia &&
    window.matchMedia("(prefers-color-scheme: dark)").matches
  ) {
    return "dark";
  }
  return "light";
}

export function persistTheme(theme: ThemeName): void {
  localStorage.setItem(STORAGE_KEY, theme);
}

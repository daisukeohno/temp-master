export const THEMES = ['light', 'dark', 'ocean'] as const;

export type ThemeName = (typeof THEMES)[number];

export const THEME_LABELS: Record<ThemeName, string> = {
  light: 'Light',
  dark: 'Dark',
  ocean: 'Ocean',
};

export const STORAGE_KEY = 'temp-master-theme';

export function isThemeName(value: unknown): value is ThemeName {
  return typeof value === 'string' && (THEMES as readonly string[]).includes(value);
}

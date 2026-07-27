export const THEMES = ['light', 'dark', 'high-contrast'] as const;

export type Theme = (typeof THEMES)[number];

export const THEME_LABELS: Record<Theme, string> = {
  light: 'ライト',
  dark: 'ダーク',
  'high-contrast': 'ハイコントラスト',
};

export const THEME_STORAGE_KEY = 'temp-master-theme';

export function isTheme(value: unknown): value is Theme {
  return typeof value === 'string' && (THEMES as readonly string[]).includes(value);
}

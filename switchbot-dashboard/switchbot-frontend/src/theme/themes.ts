export const THEMES = ['light', 'dark', 'high-contrast'] as const

export type ThemeName = (typeof THEMES)[number]

export const THEME_LABELS: Record<ThemeName, string> = {
  light: 'Light',
  dark: 'Dark',
  'high-contrast': 'High Contrast',
}

export const THEME_STORAGE_KEY = 'temp-master-theme'

export function isThemeName(value: unknown): value is ThemeName {
  return typeof value === 'string' && (THEMES as readonly string[]).includes(value)
}

export function applyTheme(theme: ThemeName): void {
  document.documentElement.setAttribute('data-theme', theme)
}

export function getInitialTheme(): ThemeName {
  const stored = localStorage.getItem(THEME_STORAGE_KEY)
  if (isThemeName(stored)) {
    return stored
  }
  return window.matchMedia?.('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

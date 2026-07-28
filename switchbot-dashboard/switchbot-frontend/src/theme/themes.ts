export const THEMES = ['light', 'dark', 'contrast', 'ocean'] as const

export type ThemeName = (typeof THEMES)[number]

export const THEME_LABELS: Record<ThemeName, string> = {
  light: 'Light',
  dark: 'Dark',
  contrast: 'High Contrast',
  ocean: 'Ocean',
}

export const THEME_STORAGE_KEY = 'temp-master-theme'

export function isThemeName(value: string | null): value is ThemeName {
  return value !== null && (THEMES as readonly string[]).includes(value)
}

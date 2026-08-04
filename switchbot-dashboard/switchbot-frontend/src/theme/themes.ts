export type ThemeName = 'light' | 'dark' | 'solarized' | 'high-contrast';

export interface ThemeDefinition {
  name: ThemeName;
  label: string;
  /** `true` when the palette is dark, used for `color-scheme` and chart defaults. */
  dark: boolean;
}

export const THEMES: ThemeDefinition[] = [
  { name: 'light', label: 'Light', dark: false },
  { name: 'dark', label: 'Dark', dark: true },
  { name: 'solarized', label: 'Solarized', dark: false },
  { name: 'high-contrast', label: 'High Contrast', dark: true },
];

export const DEFAULT_THEME: ThemeName = 'light';

export function isThemeName(value: unknown): value is ThemeName {
  return THEMES.some((theme) => theme.name === value);
}

export function getTheme(name: ThemeName): ThemeDefinition {
  return THEMES.find((theme) => theme.name === name) ?? THEMES[0];
}

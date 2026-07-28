export type ThemeName = 'light' | 'dark' | 'dracula' | 'solarized' | 'contrast'

export interface ThemeChartColors {
  line: string
  fill: string
  grid: string
  axis: string
  tooltipBg: string
  tooltipText: string
}

export interface ThemeDefinition {
  name: ThemeName
  label: string
  isDark: boolean
  /** CSS custom properties, as "R G B" triplets consumed by Tailwind. */
  vars: Record<string, string>
  chart: ThemeChartColors
}

export const THEMES: Record<ThemeName, ThemeDefinition> = {
  light: {
    name: 'light',
    label: 'Light',
    isDark: false,
    vars: {
      '--color-bg': '245 245 245',
      '--color-surface': '255 255 255',
      '--color-surface-alt': '248 248 248',
      '--color-border': '221 221 221',
      '--color-text': '34 34 34',
      '--color-muted': '119 119 119',
      '--color-accent': '51 122 183',
      '--color-accent-contrast': '255 255 255',
      '--color-temp': '217 83 79',
      '--color-humidity': '91 192 222',
      '--color-battery': '92 184 92',
      '--color-warn': '240 173 78',
      '--color-danger': '217 83 79',
    },
    chart: {
      line: '#d9534f',
      fill: 'rgba(217, 83, 79, 0.15)',
      grid: 'rgba(0, 0, 0, 0.08)',
      axis: '#777777',
      tooltipBg: '#ffffff',
      tooltipText: '#222222',
    },
  },
  dark: {
    name: 'dark',
    label: 'Dark',
    isDark: true,
    vars: {
      '--color-bg': '17 24 39',
      '--color-surface': '31 41 55',
      '--color-surface-alt': '38 50 66',
      '--color-border': '55 65 81',
      '--color-text': '229 231 235',
      '--color-muted': '156 163 175',
      '--color-accent': '96 165 250',
      '--color-accent-contrast': '17 24 39',
      '--color-temp': '248 113 113',
      '--color-humidity': '56 189 248',
      '--color-battery': '74 222 128',
      '--color-warn': '251 191 36',
      '--color-danger': '248 113 113',
    },
    chart: {
      line: '#f87171',
      fill: 'rgba(248, 113, 113, 0.18)',
      grid: 'rgba(255, 255, 255, 0.08)',
      axis: '#9ca3af',
      tooltipBg: '#1f2937',
      tooltipText: '#e5e7eb',
    },
  },
  dracula: {
    name: 'dracula',
    label: 'Dracula',
    isDark: true,
    vars: {
      '--color-bg': '40 42 54',
      '--color-surface': '52 55 70',
      '--color-surface-alt': '68 71 90',
      '--color-border': '98 114 164',
      '--color-text': '248 248 242',
      '--color-muted': '189 147 249',
      '--color-accent': '255 121 198',
      '--color-accent-contrast': '40 42 54',
      '--color-temp': '255 85 85',
      '--color-humidity': '139 233 253',
      '--color-battery': '80 250 123',
      '--color-warn': '241 250 140',
      '--color-danger': '255 85 85',
    },
    chart: {
      line: '#ff79c6',
      fill: 'rgba(255, 121, 198, 0.2)',
      grid: 'rgba(248, 248, 242, 0.1)',
      axis: '#bd93f9',
      tooltipBg: '#282a36',
      tooltipText: '#f8f8f2',
    },
  },
  solarized: {
    name: 'solarized',
    label: 'Solarized',
    isDark: false,
    vars: {
      '--color-bg': '253 246 227',
      '--color-surface': '238 232 213',
      '--color-surface-alt': '245 240 222',
      '--color-border': '211 203 178',
      '--color-text': '88 110 117',
      '--color-muted': '147 161 161',
      '--color-accent': '38 139 210',
      '--color-accent-contrast': '253 246 227',
      '--color-temp': '203 75 22',
      '--color-humidity': '42 161 152',
      '--color-battery': '133 153 0',
      '--color-warn': '181 137 0',
      '--color-danger': '220 50 47',
    },
    chart: {
      line: '#cb4b16',
      fill: 'rgba(203, 75, 22, 0.15)',
      grid: 'rgba(88, 110, 117, 0.15)',
      axis: '#93a1a1',
      tooltipBg: '#fdf6e3',
      tooltipText: '#586e75',
    },
  },
  contrast: {
    name: 'contrast',
    label: 'High Contrast',
    isDark: true,
    vars: {
      '--color-bg': '0 0 0',
      '--color-surface': '0 0 0',
      '--color-surface-alt': '20 20 20',
      '--color-border': '255 255 255',
      '--color-text': '255 255 255',
      '--color-muted': '224 224 224',
      '--color-accent': '255 255 0',
      '--color-accent-contrast': '0 0 0',
      '--color-temp': '255 0 0',
      '--color-humidity': '0 255 255',
      '--color-battery': '0 255 0',
      '--color-warn': '255 255 0',
      '--color-danger': '255 0 0',
    },
    chart: {
      line: '#ffff00',
      fill: 'rgba(255, 255, 0, 0.2)',
      grid: 'rgba(255, 255, 255, 0.35)',
      axis: '#ffffff',
      tooltipBg: '#000000',
      tooltipText: '#ffffff',
    },
  },
}

export const THEME_LIST = Object.values(THEMES)

export const DEFAULT_THEME: ThemeName = 'light'

export function isThemeName(value: string | null): value is ThemeName {
  return value !== null && value in THEMES
}

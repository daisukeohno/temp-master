export const THEMES = ['light', 'dark', 'ocean', 'sunset'] as const

export type ThemeName = (typeof THEMES)[number]

export const THEME_LABELS: Record<ThemeName, string> = {
  light: 'Light',
  dark: 'Dark',
  ocean: 'Ocean',
  sunset: 'Sunset',
}

export interface ThemeColors {
  bg: string
  surface: string
  text: string
  muted: string
  primary: string
  danger: string
  accent: string
  border: string
  warning: string
  success: string
  chartLine: string
  chartFill: string
  chartGrid: string
}

export const THEME_COLORS: Record<ThemeName, ThemeColors> = {
  light: {
    bg: '#f5f5f5',
    surface: '#ffffff',
    text: '#212529',
    muted: '#777777',
    primary: '#337ab7',
    danger: '#d9534f',
    accent: '#5bc0de',
    border: '#dddddd',
    warning: '#f0ad4e',
    success: '#5cb85c',
    chartLine: '#d9534f',
    chartFill: 'rgba(217, 83, 79, 0.15)',
    chartGrid: 'rgba(0, 0, 0, 0.08)',
  },
  dark: {
    bg: '#12141a',
    surface: '#1c1f27',
    text: '#e6e8ee',
    muted: '#9aa0ad',
    primary: '#5b8def',
    danger: '#ef5f5b',
    accent: '#4ecdc4',
    border: '#2c313c',
    warning: '#e0a33e',
    success: '#4caf7d',
    chartLine: '#ef5f5b',
    chartFill: 'rgba(239, 95, 91, 0.18)',
    chartGrid: 'rgba(255, 255, 255, 0.10)',
  },
  ocean: {
    bg: '#0b2a3d',
    surface: '#0f3d57',
    text: '#e3f4ff',
    muted: '#8fb9cf',
    primary: '#26c6da',
    danger: '#ff8a65',
    accent: '#7bdff2',
    border: '#17546f',
    warning: '#ffd166',
    success: '#48c9a9',
    chartLine: '#26c6da',
    chartFill: 'rgba(38, 198, 218, 0.20)',
    chartGrid: 'rgba(255, 255, 255, 0.10)',
  },
  sunset: {
    bg: '#2b1533',
    surface: '#3d1f42',
    text: '#ffeede',
    muted: '#d3a5b8',
    primary: '#ff8f5e',
    danger: '#ff5d73',
    accent: '#ffc857',
    border: '#5a2f5d',
    warning: '#ffb703',
    success: '#8bd17c',
    chartLine: '#ffc857',
    chartFill: 'rgba(255, 200, 87, 0.20)',
    chartGrid: 'rgba(255, 255, 255, 0.12)',
  },
}

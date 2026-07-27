import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react'

export const THEMES = ['light', 'dark', 'contrast'] as const
export type Theme = (typeof THEMES)[number]

export const THEME_LABELS: Record<Theme, string> = {
  light: 'Light',
  dark: 'Dark',
  contrast: 'High Contrast',
}

const STORAGE_KEY = 'temp-master-theme'

function isTheme(value: string | null): value is Theme {
  return value !== null && (THEMES as readonly string[]).includes(value)
}

function initialTheme(): Theme {
  const stored = localStorage.getItem(STORAGE_KEY)
  if (isTheme(stored)) {
    return stored
  }
  return window.matchMedia('(prefers-color-scheme: dark)').matches
    ? 'dark'
    : 'light'
}

interface ThemeContextValue {
  theme: Theme
  setTheme: (theme: Theme) => void
}

const ThemeContext = createContext<ThemeContextValue | null>(null)

function applyTheme(theme: Theme): Theme {
  document.documentElement.setAttribute('data-theme', theme)
  return theme
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>(() => applyTheme(initialTheme()))

  const setTheme = useCallback((next: Theme) => {
    localStorage.setItem(STORAGE_KEY, next)
    setThemeState(applyTheme(next))
  }, [])

  const value = useMemo(() => ({ theme, setTheme }), [theme, setTheme])

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

export function useTheme(): ThemeContextValue {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}

export interface ChartPalette {
  line: string
  fill: string
  point: string
  pointHover: string
  grid: string
  tick: string
  tooltipBackground: string
  tooltipText: string
}

function cssVar(name: string, fallback: string): string {
  const value = getComputedStyle(document.documentElement)
    .getPropertyValue(name)
    .trim()
  return value || fallback
}

/** Reads chart design tokens from CSS variables for the active theme. */
export function useChartPalette(): ChartPalette {
  const { theme } = useTheme()
  return useMemo<ChartPalette>(
    () => ({
      line: cssVar('--chart-line', '#d9534f'),
      fill: cssVar('--chart-fill', 'rgba(217, 83, 79, 0.15)'),
      point: cssVar('--chart-point', '#d9534f'),
      pointHover: cssVar('--chart-point-hover', '#5bc0de'),
      grid: cssVar('--chart-grid', 'rgba(0, 0, 0, 0.05)'),
      tick: cssVar('--chart-tick', '#777777'),
      tooltipBackground: cssVar('--chart-tooltip-bg', 'rgba(0, 0, 0, 0.8)'),
      tooltipText: cssVar('--chart-tooltip-text', '#ffffff'),
    }),
    // Re-read the tokens whenever the theme attribute changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [theme],
  )
}

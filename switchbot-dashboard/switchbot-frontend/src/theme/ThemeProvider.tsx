import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { THEMES, THEME_COLORS, type ThemeColors, type ThemeName } from './themes'

const STORAGE_KEY = 'temp-master-theme'

interface ThemeContextValue {
  theme: ThemeName
  colors: ThemeColors
  setTheme: (theme: ThemeName) => void
}

const ThemeContext = createContext<ThemeContextValue | null>(null)

function isThemeName(value: string | null): value is ThemeName {
  return value !== null && (THEMES as readonly string[]).includes(value)
}

function getInitialTheme(): ThemeName {
  const stored = localStorage.getItem(STORAGE_KEY)
  if (isThemeName(stored)) {
    return stored
  }
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<ThemeName>(getInitialTheme)

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
  }, [theme])

  const setTheme = useCallback((next: ThemeName) => {
    localStorage.setItem(STORAGE_KEY, next)
    setThemeState(next)
  }, [])

  const value = useMemo(
    () => ({ theme, colors: THEME_COLORS[theme], setTheme }),
    [theme, setTheme],
  )

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

export function useTheme(): ThemeContextValue {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}

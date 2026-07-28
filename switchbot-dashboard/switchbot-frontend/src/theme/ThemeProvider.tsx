import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import {
  DEFAULT_THEME,
  THEMES,
  isThemeName,
  type ThemeDefinition,
  type ThemeName,
} from './themes'

const STORAGE_KEY = 'temp-master-theme'

interface ThemeContextValue {
  theme: ThemeDefinition
  themeName: ThemeName
  setTheme: (name: ThemeName) => void
}

const ThemeContext = createContext<ThemeContextValue | null>(null)

function readInitialTheme(): ThemeName {
  const stored = window.localStorage.getItem(STORAGE_KEY)
  if (isThemeName(stored)) {
    return stored
  }
  const prefersDark = window.matchMedia?.('(prefers-color-scheme: dark)').matches
  return prefersDark ? 'dark' : DEFAULT_THEME
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [themeName, setThemeName] = useState<ThemeName>(readInitialTheme)

  useEffect(() => {
    const theme = THEMES[themeName]
    const root = document.documentElement
    for (const [key, value] of Object.entries(theme.vars)) {
      root.style.setProperty(key, value)
    }
    root.classList.toggle('dark', theme.isDark)
    root.dataset.theme = theme.name
    window.localStorage.setItem(STORAGE_KEY, theme.name)
  }, [themeName])

  const setTheme = useCallback((name: ThemeName) => setThemeName(name), [])

  const value = useMemo<ThemeContextValue>(
    () => ({ theme: THEMES[themeName], themeName, setTheme }),
    [themeName, setTheme],
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

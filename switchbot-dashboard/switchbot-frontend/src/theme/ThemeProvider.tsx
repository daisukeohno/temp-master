import { useCallback, useMemo, useState, type ReactNode } from 'react'
import { ThemeContext } from './ThemeContext'
import { applyTheme, getInitialTheme, THEME_STORAGE_KEY, type ThemeName } from './themes'

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<ThemeName>(getInitialTheme)

  const setTheme = useCallback((next: ThemeName) => {
    localStorage.setItem(THEME_STORAGE_KEY, next)
    applyTheme(next)
    setThemeState(next)
  }, [])

  const value = useMemo(() => ({ theme, setTheme }), [theme, setTheme])

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

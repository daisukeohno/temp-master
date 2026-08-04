import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react';
import { ThemeContext } from './ThemeContext';
import { DEFAULT_THEME, getTheme, isThemeName, type ThemeName } from './themes';

const STORAGE_KEY = 'temp-master-theme';

function readInitialTheme(): ThemeName {
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (isThemeName(stored)) {
      return stored;
    }
  } catch {
    // localStorage unavailable (private mode / SSR); fall through to media query.
  }
  if (window.matchMedia?.('(prefers-color-scheme: dark)').matches) {
    return 'dark';
  }
  return DEFAULT_THEME;
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<ThemeName>(readInitialTheme);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    document.documentElement.style.colorScheme = getTheme(theme).dark ? 'dark' : 'light';
  }, [theme]);

  const setTheme = useCallback((next: ThemeName) => {
    setThemeState(next);
    try {
      window.localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // Persistence is best-effort.
    }
  }, []);

  const value = useMemo(
    () => ({ theme, setTheme, isDark: getTheme(theme).dark }),
    [theme, setTheme],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

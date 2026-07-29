import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import { isThemeName, STORAGE_KEY, type ThemeName } from './themes';

interface ThemeContextValue {
  theme: ThemeName;
  setTheme: (theme: ThemeName) => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

function getInitialTheme(): ThemeName {
  const stored = window.localStorage.getItem(STORAGE_KEY);
  if (isThemeName(stored)) {
    return stored;
  }
  return window.matchMedia?.('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

/**
 * Applied synchronously (not in an effect) so that components reading the
 * resulting CSS variables see the new palette on the same render.
 */
function applyTheme(theme: ThemeName): void {
  const root = document.documentElement;
  root.setAttribute('data-theme', theme);
  root.classList.toggle('dark', theme === 'dark');
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<ThemeName>(() => {
    const initial = getInitialTheme();
    applyTheme(initial);
    return initial;
  });

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, theme);
  }, [theme]);

  const setTheme = useCallback((next: ThemeName) => {
    applyTheme(next);
    setThemeState(next);
  }, []);
  const value = useMemo(() => ({ theme, setTheme }), [theme, setTheme]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme(): ThemeContextValue {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}

/** Reads a CSS custom property from the document root (used for chart colors). */
export function useThemeColor(variable: string): string {
  const { theme } = useTheme();
  const [color, setColor] = useState('');

  useEffect(() => {
    setColor(getComputedStyle(document.documentElement).getPropertyValue(variable).trim());
  }, [variable, theme]);

  return color;
}

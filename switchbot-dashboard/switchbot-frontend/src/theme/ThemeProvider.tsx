import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';

export const THEMES = [
  { value: 'light', label: 'Light' },
  { value: 'dark', label: 'Dark' },
  { value: 'industrial', label: 'Industrial' },
  { value: 'high-contrast', label: 'High Contrast' },
] as const;

export type ThemeName = (typeof THEMES)[number]['value'];

const STORAGE_KEY = 'temp-master-theme';
const DEFAULT_THEME: ThemeName = 'light';

function isThemeName(value: string | null): value is ThemeName {
  return THEMES.some((theme) => theme.value === value);
}

function readStoredTheme(): ThemeName {
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    return isThemeName(stored) ? stored : DEFAULT_THEME;
  } catch {
    return DEFAULT_THEME;
  }
}

interface ThemeContextValue {
  theme: ThemeName;
  setTheme: (theme: ThemeName) => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<ThemeName>(readStoredTheme);

  // Layout effect so the attribute is set before child effects read CSS variables.
  useLayoutEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, theme);
    } catch {
      // ignore storage failures (private mode)
    }
  }, [theme]);

  const setTheme = useCallback((next: ThemeName) => setThemeState(next), []);
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

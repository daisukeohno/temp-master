import { useCallback, useMemo, useState, type ReactNode } from 'react';
import { ThemeContext } from './ThemeContext';
import { applyTheme, readStoredTheme, storeTheme, type ThemeName } from './themes';

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<ThemeName>(() => {
    const initial = readStoredTheme();
    applyTheme(initial);
    return initial;
  });

  // data-theme is applied before the state update so that consumers reading
  // CSS variables (chart colors) observe the new theme on their first render.
  const setTheme = useCallback((next: ThemeName) => {
    applyTheme(next);
    storeTheme(next);
    setThemeState(next);
  }, []);

  const value = useMemo(() => ({ theme, setTheme }), [theme, setTheme]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

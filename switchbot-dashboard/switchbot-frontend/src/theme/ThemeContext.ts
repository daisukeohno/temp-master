import { createContext, useContext } from 'react';
import { DEFAULT_THEME, type ThemeName } from './themes';

export interface ThemeContextValue {
  theme: ThemeName;
  setTheme: (theme: ThemeName) => void;
  isDark: boolean;
}

export const ThemeContext = createContext<ThemeContextValue>({
  theme: DEFAULT_THEME,
  setTheme: () => {},
  isDark: false,
});

export function useTheme(): ThemeContextValue {
  return useContext(ThemeContext);
}

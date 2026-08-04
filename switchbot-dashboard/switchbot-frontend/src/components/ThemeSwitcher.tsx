import { useTheme } from '../theme/ThemeContext';
import { THEMES, isThemeName } from '../theme/themes';

export function ThemeSwitcher() {
  const { theme, setTheme } = useTheme();

  return (
    <label className="theme-switcher">
      <span className="sr-only-label">Theme:</span>
      <select
        aria-label="Theme"
        value={theme}
        onChange={(event) => {
          const next = event.target.value;
          if (isThemeName(next)) {
            setTheme(next);
          }
        }}
      >
        {THEMES.map((option) => (
          <option key={option.name} value={option.name}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}

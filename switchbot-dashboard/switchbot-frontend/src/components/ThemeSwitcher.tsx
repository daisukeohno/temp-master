import { THEMES, THEME_LABELS, isThemeName } from '../theme/themes';
import { useTheme } from '../theme/useTheme';

export function ThemeSwitcher() {
  const { theme, setTheme } = useTheme();

  return (
    <label className="flex items-center gap-2 text-xs text-text-muted">
      <span className="hidden sm:inline">Theme</span>
      <select
        aria-label="Theme"
        className="field py-1.5"
        value={theme}
        onChange={(event) => {
          if (isThemeName(event.target.value)) {
            setTheme(event.target.value);
          }
        }}
      >
        {THEMES.map((name) => (
          <option key={name} value={name}>
            {THEME_LABELS[name]}
          </option>
        ))}
      </select>
    </label>
  );
}

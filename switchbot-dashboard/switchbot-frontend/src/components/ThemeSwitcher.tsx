import { useTheme } from "../theme/ThemeContext";
import { THEME_LABELS, THEMES, type ThemeName } from "../theme/themes";

export function ThemeSwitcher() {
  const { theme, setTheme } = useTheme();

  return (
    <label className="theme-switcher">
      <span className="theme-switcher-label">Theme</span>
      <select
        value={theme}
        onChange={(e) => setTheme(e.target.value as ThemeName)}
        aria-label="Select theme"
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

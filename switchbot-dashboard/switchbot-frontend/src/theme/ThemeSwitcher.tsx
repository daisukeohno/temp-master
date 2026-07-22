import { useTheme } from "./ThemeProvider";
import { THEMES, type ThemeId } from "./themes";

export function ThemeSwitcher() {
  const { theme, setTheme } = useTheme();

  return (
    <label className="theme-switcher">
      <span className="theme-switcher__label">Theme</span>
      <select
        className="theme-switcher__select"
        value={theme}
        onChange={(e) => setTheme(e.target.value as ThemeId)}
        aria-label="Select color theme"
      >
        {THEMES.map((t) => (
          <option key={t.id} value={t.id}>
            {t.label}
          </option>
        ))}
      </select>
    </label>
  );
}

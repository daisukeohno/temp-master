import { THEMES, useTheme, type ThemeName } from './ThemeProvider';

export function ThemeSelect() {
  const { theme, setTheme } = useTheme();

  return (
    <label className="flex items-center gap-2 text-sm">
      <span className="hidden sm:inline">Theme:</span>
      <select
        aria-label="Theme"
        className="rounded border border-border bg-surface px-2 py-1 text-sm text-text"
        value={theme}
        onChange={(event) => setTheme(event.target.value as ThemeName)}
      >
        {THEMES.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}

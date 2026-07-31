import { useTheme } from '../theme/useTheme';
import { THEMES, THEME_LABELS, type Theme } from '../theme/themes';

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <label className="flex items-center gap-2 text-sm">
      <span className="text-muted">Theme</span>
      <select
        aria-label="Theme"
        className="rounded border border-border bg-panel px-2 py-1 text-fg"
        value={theme}
        onChange={(event) => setTheme(event.target.value as Theme)}
      >
        {THEMES.map((value) => (
          <option key={value} value={value}>
            {THEME_LABELS[value]}
          </option>
        ))}
      </select>
    </label>
  );
}

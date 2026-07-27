import { useTheme } from '../theme/useTheme';
import { isTheme, THEMES, THEME_LABELS } from '../theme/themes';

export function ThemeSwitcher() {
  const { theme, setTheme } = useTheme();

  return (
    <label className="flex items-center gap-2 text-sm">
      <span className="hidden sm:inline text-muted">テーマ</span>
      <select
        aria-label="テーマ"
        className="form-control py-1"
        value={theme}
        onChange={(event) => {
          if (isTheme(event.target.value)) {
            setTheme(event.target.value);
          }
        }}
      >
        {THEMES.map((option) => (
          <option key={option} value={option}>
            {THEME_LABELS[option]}
          </option>
        ))}
      </select>
    </label>
  );
}

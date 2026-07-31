import { useTheme } from '../theme/ThemeProvider'
import { THEMES, THEME_LABELS, type ThemeName } from '../theme/themes'

export default function ThemeSwitcher() {
  const { theme, setTheme } = useTheme()

  return (
    <label className="flex items-center gap-2 text-sm">
      <span className="text-muted">Theme</span>
      <select
        aria-label="Theme"
        className="rounded border border-border bg-surface px-2 py-1 text-text"
        value={theme}
        onChange={(event) => setTheme(event.target.value as ThemeName)}
      >
        {THEMES.map((name) => (
          <option key={name} value={name}>
            {THEME_LABELS[name]}
          </option>
        ))}
      </select>
    </label>
  )
}

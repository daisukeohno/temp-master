import { THEMES, THEME_LABELS, isThemeName } from '../theme/themes'
import { useTheme } from '../theme/useTheme'

export function ThemeSwitcher() {
  const { theme, setTheme } = useTheme()

  return (
    <label className="theme-switcher">
      <span className="field-label" style={{ marginRight: 8 }}>
        Theme:
      </span>
      <select
        className="select"
        aria-label="Theme"
        value={theme}
        onChange={(event) => {
          if (isThemeName(event.target.value)) {
            setTheme(event.target.value)
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
  )
}

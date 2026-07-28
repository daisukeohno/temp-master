import { useTheme } from '../theme/useTheme'
import { isThemeName, THEME_LABELS, THEMES } from '../theme/themes'

export function ThemeSwitcher() {
  const { theme, setTheme } = useTheme()

  return (
    <div className="theme-switcher">
      <label htmlFor="theme-select">Theme</label>
      <select
        id="theme-select"
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
    </div>
  )
}

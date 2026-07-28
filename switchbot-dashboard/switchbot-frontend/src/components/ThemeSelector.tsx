import { useTheme } from '../theme/ThemeProvider'
import { THEME_LIST, type ThemeName } from '../theme/themes'

export default function ThemeSelector() {
  const { themeName, setTheme } = useTheme()

  return (
    <label className="flex items-center gap-2 text-sm">
      <span className="hidden sm:inline text-muted">Theme</span>
      <select
        aria-label="Theme"
        className="field"
        value={themeName}
        onChange={(event) => setTheme(event.target.value as ThemeName)}
      >
        {THEME_LIST.map((theme) => (
          <option key={theme.name} value={theme.name}>
            {theme.label}
          </option>
        ))}
      </select>
    </label>
  )
}

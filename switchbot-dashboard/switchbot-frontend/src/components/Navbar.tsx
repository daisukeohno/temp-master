import { THEMES, THEME_LABELS, useTheme, type Theme } from '../theme'

interface NavbarProps {
  connected: boolean
}

export function Navbar({ connected }: NavbarProps) {
  const { theme, setTheme } = useTheme()

  return (
    <nav className="navbar">
      <a className="navbar-brand" href="/">
        Temp Master Dashboard
      </a>
      <div className="navbar-right">
        <label className="theme-switcher" htmlFor="theme-select">
          Theme:
          <select
            id="theme-select"
            value={theme}
            onChange={(event) => setTheme(event.target.value as Theme)}
          >
            {THEMES.map((name) => (
              <option key={name} value={name}>
                {THEME_LABELS[name]}
              </option>
            ))}
          </select>
        </label>
        <span
          id="connection-status"
          className={connected ? 'label label-success' : 'label label-danger'}
        >
          {connected ? 'Connected' : 'Disconnected'}
        </span>
      </div>
    </nav>
  )
}

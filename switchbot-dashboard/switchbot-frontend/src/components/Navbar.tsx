import { useTheme } from '../theme/ThemeProvider';
import { THEMES, THEME_LABELS, isThemeName } from '../theme/themes';

interface NavbarProps {
  connected: boolean;
}

export default function Navbar({ connected }: NavbarProps) {
  const { theme, setTheme } = useTheme();

  return (
    <nav className="fixed inset-x-0 top-0 z-10 border-b border-border bg-panel-header">
      <div className="mx-auto flex max-w-screen-2xl items-center gap-4 px-4 py-3">
        <span className="text-lg font-semibold text-text">Temp Master Dashboard</span>
        <div className="ml-auto flex items-center gap-3">
          <label className="text-sm text-muted" htmlFor="theme-select">
            Theme
          </label>
          <select
            id="theme-select"
            aria-label="Theme"
            className="rounded border border-border bg-panel px-2 py-1 text-sm text-text"
            value={theme}
            onChange={(event) => {
              if (isThemeName(event.target.value)) {
                setTheme(event.target.value);
              }
            }}
          >
            {THEMES.map((name) => (
              <option key={name} value={name}>
                {THEME_LABELS[name]}
              </option>
            ))}
          </select>
          <span
            className={`rounded px-2 py-1 text-xs font-semibold text-white ${
              connected ? 'bg-green-600' : 'bg-red-600'
            }`}
          >
            {connected ? 'Connected' : 'Disconnected'}
          </span>
        </div>
      </div>
    </nav>
  );
}

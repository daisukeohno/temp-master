import { ThemeSwitcher } from './ThemeSwitcher'

export function Navbar({ connected }: { connected: boolean }) {
  return (
    <nav className="navbar">
      <span className="navbar-brand">Temp Master Dashboard</span>
      <span className="navbar-spacer" />
      <div className="navbar-controls">
        <ThemeSwitcher />
        <span className={connected ? 'badge badge-success' : 'badge badge-danger'}>
          {connected ? 'Connected' : 'Disconnected'}
        </span>
      </div>
    </nav>
  )
}

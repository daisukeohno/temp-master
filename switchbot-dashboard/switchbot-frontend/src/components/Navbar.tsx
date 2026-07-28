import { ThemeSwitcher } from './ThemeSwitcher'

export function Navbar({ connected }: { connected: boolean }) {
  return (
    <nav className="navbar">
      <span className="navbar-brand">Temp Master Dashboard</span>
      <div className="navbar-spacer" />
      <ThemeSwitcher />
      <span className={connected ? 'badge badge-success' : 'badge badge-danger'}>
        {connected ? 'Connected' : 'Disconnected'}
      </span>
    </nav>
  )
}

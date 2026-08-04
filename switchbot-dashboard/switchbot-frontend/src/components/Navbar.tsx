import { ThemeSwitcher } from './ThemeSwitcher';

export interface NavbarProps {
  connected: boolean;
}

export function Navbar({ connected }: NavbarProps) {
  return (
    <nav className="navbar">
      <span className="navbar__brand">Temp Master Dashboard</span>
      <div className="navbar__right">
        <ThemeSwitcher />
        <span className={`badge ${connected ? 'badge--success' : 'badge--danger'}`}>
          {connected ? 'Connected' : 'Disconnected'}
        </span>
      </div>
    </nav>
  );
}

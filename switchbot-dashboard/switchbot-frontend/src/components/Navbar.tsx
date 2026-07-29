import { ThemeSwitcher } from "./ThemeSwitcher";

interface NavbarProps {
  connected: boolean;
}

export function Navbar({ connected }: NavbarProps) {
  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <span className="navbar-brand">Temp Master Dashboard</span>
        <div className="navbar-right">
          <ThemeSwitcher />
          <span
            className={`status-badge ${
              connected ? "status-badge-ok" : "status-badge-error"
            }`}
          >
            {connected ? "Connected" : "Disconnected"}
          </span>
        </div>
      </div>
    </nav>
  );
}

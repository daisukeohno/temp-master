import { ThemeToggle } from './ThemeToggle';

export function Navbar({ connected }: { connected: boolean }) {
  return (
    <nav className="sticky top-0 z-10 border-b border-border bg-panel-header">
      <div className="mx-auto flex flex-wrap items-center gap-4 px-4 py-3">
        <span className="text-lg font-semibold">Temp Master Dashboard</span>
        <a className="text-sm text-accent hover:underline" href="/">
          Dashboard
        </a>
        <div className="ml-auto flex items-center gap-4">
          <ThemeToggle />
          <span
            className={`rounded px-2 py-1 text-xs font-semibold text-white ${
              connected ? 'bg-success' : 'bg-danger'
            }`}
          >
            {connected ? 'Connected' : 'Disconnected'}
          </span>
        </div>
      </div>
    </nav>
  );
}

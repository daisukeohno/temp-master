import { ThemeSwitcher } from './ThemeSwitcher';

export function Navbar({ connected }: { connected: boolean }) {
  return (
    <header className="sticky top-0 z-10 border-b border-border bg-surface/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-3 px-4 py-3">
        <h1 className="text-lg font-semibold tracking-tight">Temp Master Dashboard</h1>
        <span className="ml-auto flex items-center gap-3">
          <span
            data-testid="connection-status"
            className="badge"
            style={{
              backgroundColor: connected ? 'var(--color-success)' : 'var(--color-danger)',
              color: 'var(--color-surface)',
            }}
          >
            {connected ? 'Connected' : 'Disconnected'}
          </span>
          <ThemeSwitcher />
        </span>
      </div>
    </header>
  );
}

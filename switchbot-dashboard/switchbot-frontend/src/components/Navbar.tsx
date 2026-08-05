import { ThemeSelect } from '../theme/ThemeSelect';

export function Navbar({ connected }: { connected: boolean }) {
  return (
    <nav className="fixed inset-x-0 top-0 z-10 border-b border-border bg-surface">
      <div className="flex flex-wrap items-center gap-3 px-4 py-3">
        <span className="text-lg font-semibold text-text">Temp Master Dashboard</span>
        <div className="ml-auto flex items-center gap-3">
          <ThemeSelect />
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

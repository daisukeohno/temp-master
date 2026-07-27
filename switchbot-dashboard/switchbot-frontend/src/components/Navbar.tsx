import { ThemeSwitcher } from './ThemeSwitcher';

export function Navbar({ connected }: { connected: boolean }) {
  return (
    <nav className="fixed inset-x-0 top-0 z-10 border-b border-border bg-surface">
      <div className="mx-auto flex h-14 max-w-[1600px] items-center gap-4 px-4">
        <span className="text-lg font-semibold">Temp Master Dashboard</span>
        <a className="hidden text-sm text-accent hover:underline sm:inline" href="/">
          Dashboard
        </a>
        <div className="ml-auto flex items-center gap-3">
          <ThemeSwitcher />
          <span
            className={`badge ${connected ? 'bg-battery text-black' : 'bg-danger text-white'}`}
            data-testid="connection-status"
          >
            {connected ? 'Connected' : 'Disconnected'}
          </span>
        </div>
      </div>
    </nav>
  );
}

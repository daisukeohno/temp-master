import ThemeSwitcher from './ThemeSwitcher'

interface NavbarProps {
  connected: boolean
}

export default function Navbar({ connected }: NavbarProps) {
  return (
    <nav className="sticky top-0 z-10 border-b border-border bg-surface">
      <div className="mx-auto flex max-w-[1600px] flex-wrap items-center gap-4 px-4 py-3">
        <span className="text-lg font-semibold">Temp Master Dashboard</span>
        <div className="ml-auto flex items-center gap-4">
          <span
            className="rounded px-2 py-1 text-xs font-semibold text-white"
            style={{
              backgroundColor: connected ? 'var(--color-success)' : 'var(--color-danger)',
            }}
          >
            {connected ? 'Connected' : 'Disconnected'}
          </span>
          <ThemeSwitcher />
        </div>
      </div>
    </nav>
  )
}

interface StatusBarProps {
  metersCount: number;
  lastRefresh: string | null;
}

export function StatusBar({ metersCount, lastRefresh }: StatusBarProps) {
  const noun = metersCount === 1 ? 'meter' : 'meters';

  return (
    <div className="card flex flex-wrap items-center justify-between gap-2 px-4 py-3 text-sm">
      <span>
        Monitoring {metersCount} {noun}
      </span>
      {lastRefresh && <span className="text-text-muted">Last refresh: {lastRefresh}</span>}
    </div>
  );
}

export function RateLimitWarning({ backoffRemaining }: { backoffRemaining: number }) {
  return (
    <div
      className="card px-4 py-3 text-sm"
      style={{ borderColor: 'var(--color-warning)', color: 'var(--color-warning)' }}
    >
      <strong>Rate Limited.</strong> SwitchBot API rate limit reached. Retry in {backoffRemaining}{' '}
      seconds.
    </div>
  );
}

export function ErrorBanner({ message }: { message: string }) {
  return (
    <div
      className="card px-4 py-3 text-sm"
      style={{ borderColor: 'var(--color-danger)', color: 'var(--color-danger)' }}
    >
      <strong>Error.</strong> {message}
    </div>
  );
}

import { formatClockTime } from '../lib/format';
import type { StatusResponse } from '../types';

interface StatusBarProps {
  status: StatusResponse;
  lastRefresh: Date | null;
}

export function StatusBar({ status, lastRefresh }: StatusBarProps) {
  const count = status.meters_count || 0;
  const noun = count === 1 ? 'meter' : 'meters';

  return (
    <div className="panel mb-4 flex flex-wrap items-center justify-between gap-2 border-info/60 bg-info/10 p-3 text-sm">
      <span>{`Monitoring ${count} ${noun}`}</span>
      {lastRefresh && <span className="text-muted">Last refresh: {formatClockTime(lastRefresh)}</span>}
    </div>
  );
}

export function RateLimitWarning({ backoffRemaining }: { backoffRemaining: number }) {
  return (
    <div className="panel mb-4 border-warning/70 bg-warning/15 p-3 text-sm">
      <strong>Rate Limited.</strong>{' '}
      <span>{`SwitchBot API rate limit reached. Retry in ${backoffRemaining} seconds.`}</span>
    </div>
  );
}

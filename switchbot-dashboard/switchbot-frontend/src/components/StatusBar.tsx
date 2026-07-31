import { formatClockTime } from '../lib/format';

interface StatusBarProps {
  metersCount: number;
  lastRefresh: Date | null;
}

export function StatusBar({ metersCount, lastRefresh }: StatusBarProps) {
  const noun = metersCount === 1 ? 'meter' : 'meters';

  return (
    <div className="mb-4 flex flex-wrap items-center justify-between gap-2 rounded-lg border border-border bg-panel px-4 py-2 text-sm">
      <span>{`Monitoring ${metersCount} ${noun}`}</span>
      {lastRefresh && <span className="text-muted">{`Last refresh: ${formatClockTime(lastRefresh)}`}</span>}
    </div>
  );
}

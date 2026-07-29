import { formatClockTime } from '../lib/format';
import type { StatusResponse } from '../types';

interface StatusBarProps {
  status: StatusResponse;
  lastRefresh: Date;
}

export default function StatusBar({ status, lastRefresh }: StatusBarProps) {
  const count = status.meters_count ?? 0;

  return (
    <>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2 rounded border border-border bg-panel-header px-4 py-2 text-sm text-text">
        <span>{`Monitoring ${count} ${count === 1 ? 'meter' : 'meters'}`}</span>
        <span className="text-muted">{`Last refresh: ${formatClockTime(lastRefresh)}`}</span>
      </div>
      {status.is_rate_limited && (
        <div className="mb-4 rounded border border-warning bg-warning-bg px-4 py-2 text-sm text-warning">
          <strong>Rate Limited.</strong>{' '}
          {`SwitchBot API rate limit reached. Retry in ${status.backoff_remaining ?? 0} seconds.`}
        </div>
      )}
    </>
  );
}

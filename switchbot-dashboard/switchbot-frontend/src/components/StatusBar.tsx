import type { StatusResponse } from "../api/types";
import { formatClock } from "../utils/format";

interface StatusBarProps {
  status: StatusResponse | undefined;
  lastRefresh: Date | null;
}

export function StatusBar({ status, lastRefresh }: StatusBarProps) {
  if (!status) {
    return null;
  }

  const count = status.meters_count ?? 0;
  const noun = count === 1 ? "meter" : "meters";

  return (
    <div className="alert alert--info">
      <span>
        Monitoring {count} {noun}
      </span>
      {lastRefresh && <span>Last refresh: {formatClock(lastRefresh)}</span>}
    </div>
  );
}

export function RateLimitWarning({ status }: { status: StatusResponse | undefined }) {
  if (!status?.is_rate_limited) {
    return null;
  }
  const remaining = status.backoff_remaining ?? 0;
  return (
    <div className="alert alert--warning">
      <span>
        <strong>Rate Limited.</strong> SwitchBot API rate limit reached. Retry in{" "}
        {remaining} seconds.
      </span>
    </div>
  );
}

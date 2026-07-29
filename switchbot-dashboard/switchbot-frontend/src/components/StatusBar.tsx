import type { Status } from "../api/types";

interface StatusBarProps {
  status: Status | undefined;
  lastRefresh: Date | null;
}

function pad2(n: number): string {
  return n < 10 ? "0" + n : String(n);
}

export function StatusBar({ status, lastRefresh }: StatusBarProps) {
  if (!status) return null;

  const count = status.meters_count || 0;
  const noun = count === 1 ? "meter" : "meters";
  const refreshText = lastRefresh
    ? `Last refresh: ${pad2(lastRefresh.getHours())}:${pad2(
        lastRefresh.getMinutes(),
      )}:${pad2(lastRefresh.getSeconds())}`
    : "";

  return (
    <>
      <div className="alert alert-info status-bar">
        <span>
          Monitoring {count} {noun}
        </span>
        <span className="status-last-refresh">{refreshText}</span>
      </div>
      {status.is_rate_limited && (
        <div className="alert alert-warning">
          <strong>Rate Limited.</strong>{" "}
          SwitchBot API rate limit reached. Retry in{" "}
          {status.backoff_remaining} seconds.
        </div>
      )}
    </>
  );
}

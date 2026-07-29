import type { TimeScale } from "../api/types";
import { backupUrl } from "../api/client";

const TIME_SCALE_OPTIONS: { value: TimeScale; label: string }[] = [
  { value: "hour", label: "Last Hour" },
  { value: "day", label: "Last 24 Hours" },
  { value: "week", label: "Last 7 Days" },
  { value: "month", label: "Last 30 Days" },
  { value: "year", label: "Last Year" },
];

interface ControlsProps {
  timeScale: TimeScale;
  onTimeScaleChange: (value: TimeScale) => void;
  onRefresh: () => void;
  refreshing: boolean;
}

export function Controls({
  timeScale,
  onTimeScaleChange,
  onRefresh,
  refreshing,
}: ControlsProps) {
  return (
    <div className="card controls">
      <div className="control-group">
        <label htmlFor="time-scale-select">Time Range:</label>
        <select
          id="time-scale-select"
          value={timeScale}
          onChange={(e) => onTimeScaleChange(e.target.value as TimeScale)}
        >
          {TIME_SCALE_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>
      <button
        type="button"
        className="btn btn-primary"
        onClick={onRefresh}
        disabled={refreshing}
      >
        {refreshing ? "Refreshing..." : "Refresh Data"}
      </button>
      <a
        className="btn btn-default"
        href={backupUrl()}
        target="_blank"
        rel="noreferrer"
      >
        Download Backup
      </a>
    </div>
  );
}

import type { TimeScale } from "../api/types";

const TIME_SCALES: { value: TimeScale; label: string }[] = [
  { value: "hour", label: "Last Hour" },
  { value: "day", label: "Last 24 Hours" },
  { value: "week", label: "Last 7 Days" },
  { value: "month", label: "Last 30 Days" },
  { value: "year", label: "Last Year" },
];

interface ControlsProps {
  timeScale: TimeScale;
  onTimeScaleChange: (scale: TimeScale) => void;
  onRefresh: () => void;
  onBackup: () => void;
  refreshing: boolean;
}

export function Controls({
  timeScale,
  onTimeScaleChange,
  onRefresh,
  onBackup,
  refreshing,
}: ControlsProps) {
  return (
    <div className="panel">
      <div className="panel__body">
        <div className="controls">
          <div className="control-group">
            <label htmlFor="time-scale-select">Time Range:</label>
            <select
              id="time-scale-select"
              className="control-select"
              value={timeScale}
              onChange={(e) => onTimeScaleChange(e.target.value as TimeScale)}
            >
              {TIME_SCALES.map((ts) => (
                <option key={ts.value} value={ts.value}>
                  {ts.label}
                </option>
              ))}
            </select>
          </div>
          <button
            type="button"
            className="btn btn--primary"
            onClick={onRefresh}
            disabled={refreshing}
          >
            {refreshing ? "Refreshing..." : "Refresh Data"}
          </button>
          <button type="button" className="btn" onClick={onBackup}>
            Download Backup
          </button>
        </div>
      </div>
    </div>
  );
}

import type { TimeScale } from '../types';

const TIME_SCALE_OPTIONS: { value: TimeScale; label: string }[] = [
  { value: 'hour', label: 'Last Hour' },
  { value: 'day', label: 'Last 24 Hours' },
  { value: 'week', label: 'Last 7 Days' },
  { value: 'month', label: 'Last 30 Days' },
  { value: 'year', label: 'Last Year' },
];

interface ControlsProps {
  timeScale: TimeScale;
  onTimeScaleChange: (timeScale: TimeScale) => void;
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
    <div className="panel mb-4 p-4">
      <div className="flex flex-wrap items-center gap-3">
        <label className="flex items-center gap-2 text-sm" htmlFor="time-scale-select">
          Time Range:
          <select
            id="time-scale-select"
            className="form-control"
            value={timeScale}
            onChange={(event) => onTimeScaleChange(event.target.value as TimeScale)}
          >
            {TIME_SCALE_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>
        <button type="button" className="btn btn-primary" onClick={onRefresh} disabled={refreshing}>
          {refreshing ? 'Refreshing...' : 'Refresh Data'}
        </button>
        <button type="button" className="btn btn-secondary" onClick={onBackup}>
          Download Backup
        </button>
      </div>
    </div>
  );
}

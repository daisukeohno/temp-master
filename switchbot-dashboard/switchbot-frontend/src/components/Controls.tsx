import { TIME_SCALES, type TimeScale } from '../api/types';

interface ControlsProps {
  timeScale: TimeScale;
  onTimeScaleChange: (timeScale: TimeScale) => void;
  onRefresh: () => void;
  onBackup: () => void;
  isRefreshing: boolean;
}

export function Controls({
  timeScale,
  onTimeScaleChange,
  onRefresh,
  onBackup,
  isRefreshing,
}: ControlsProps) {
  return (
    <div className="card flex flex-wrap items-center gap-3 p-4">
      <label className="flex items-center gap-2 text-sm" htmlFor="time-scale-select">
        Time Range:
        <select
          id="time-scale-select"
          className="field"
          value={timeScale}
          onChange={(event) => onTimeScaleChange(event.target.value as TimeScale)}
        >
          {TIME_SCALES.map((scale) => (
            <option key={scale.value} value={scale.value}>
              {scale.label}
            </option>
          ))}
        </select>
      </label>
      <button type="button" className="btn btn-primary" onClick={onRefresh} disabled={isRefreshing}>
        {isRefreshing ? 'Refreshing...' : 'Refresh Data'}
      </button>
      <button type="button" className="btn btn-secondary" onClick={onBackup}>
        Download Backup
      </button>
    </div>
  );
}

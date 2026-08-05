import { TIME_SCALE_OPTIONS } from '../constants';
import type { TimeScale } from '../api/types';

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
    <div className="mb-4 rounded border border-border bg-surface p-4">
      <div className="flex flex-wrap items-center gap-3">
        <label className="flex items-center gap-2 text-sm" htmlFor="time-scale-select">
          Time Range:
          <select
            id="time-scale-select"
            className="rounded border border-border bg-surface px-2 py-1 text-text"
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
        <button
          type="button"
          className="rounded bg-accent px-3 py-1.5 text-sm font-medium text-white disabled:opacity-60"
          onClick={onRefresh}
          disabled={refreshing}
        >
          {refreshing ? 'Refreshing...' : 'Refresh Data'}
        </button>
        <button
          type="button"
          className="rounded border border-border bg-surface-alt px-3 py-1.5 text-sm font-medium text-text"
          onClick={onBackup}
        >
          Download Backup
        </button>
      </div>
    </div>
  );
}

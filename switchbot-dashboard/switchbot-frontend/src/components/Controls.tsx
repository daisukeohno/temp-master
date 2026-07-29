import type { TimeScale } from '../types';

const TIME_SCALES: { value: TimeScale; label: string }[] = [
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

export default function Controls({
  timeScale,
  onTimeScaleChange,
  onRefresh,
  onBackup,
  refreshing,
}: ControlsProps) {
  return (
    <div className="mb-4 flex flex-wrap items-center gap-3 rounded border border-border bg-panel p-4">
      <label className="text-sm text-text" htmlFor="time-scale-select">
        Time Range:
      </label>
      <select
        id="time-scale-select"
        className="rounded border border-border bg-panel px-2 py-1 text-sm text-text"
        value={timeScale}
        onChange={(event) => onTimeScaleChange(event.target.value as TimeScale)}
      >
        {TIME_SCALES.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <button
        type="button"
        className="rounded bg-accent px-3 py-1.5 text-sm font-medium text-accent-contrast disabled:opacity-60"
        onClick={onRefresh}
        disabled={refreshing}
      >
        {refreshing ? 'Refreshing...' : 'Refresh Data'}
      </button>
      <button
        type="button"
        className="rounded border border-border bg-panel-header px-3 py-1.5 text-sm text-text"
        onClick={onBackup}
      >
        Download Backup
      </button>
    </div>
  );
}

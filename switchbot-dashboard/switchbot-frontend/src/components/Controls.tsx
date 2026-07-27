import type { TimeScale } from '../types'

const TIME_SCALE_OPTIONS: { value: TimeScale; label: string }[] = [
  { value: 'hour', label: 'Last Hour' },
  { value: 'day', label: 'Last 24 Hours' },
  { value: 'week', label: 'Last 7 Days' },
  { value: 'month', label: 'Last 30 Days' },
  { value: 'year', label: 'Last Year' },
]

interface ControlsProps {
  timeScale: TimeScale
  onTimeScaleChange: (timeScale: TimeScale) => void
  onRefresh: () => void
  onBackup: () => void
  isRefreshing: boolean
}

export function Controls({
  timeScale,
  onTimeScaleChange,
  onRefresh,
  onBackup,
  isRefreshing,
}: ControlsProps) {
  return (
    <div className="panel">
      <div className="panel-body controls">
        <label className="control-label" htmlFor="time-scale-select">
          Time Range:
        </label>
        <select
          id="time-scale-select"
          value={timeScale}
          onChange={(event) => onTimeScaleChange(event.target.value as TimeScale)}
        >
          {TIME_SCALE_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <button
          type="button"
          id="btn-refresh"
          className="btn-primary"
          onClick={onRefresh}
          disabled={isRefreshing}
        >
          {isRefreshing ? 'Refreshing...' : 'Refresh Data'}
        </button>
        <button type="button" id="btn-backup" onClick={onBackup}>
          Download Backup
        </button>
      </div>
    </div>
  )
}

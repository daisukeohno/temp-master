import { BACKUP_URL } from '../api'
import { TIME_SCALE_OPTIONS } from '../constants'
import type { TimeScale } from '../types'

interface ControlsProps {
  timeScale: TimeScale
  onTimeScaleChange: (timeScale: TimeScale) => void
  onRefresh: () => void
  isRefreshing: boolean
}

export function Controls({
  timeScale,
  onTimeScaleChange,
  onRefresh,
  isRefreshing,
}: ControlsProps) {
  return (
    <div className="panel">
      <div className="panel-body controls">
        <label htmlFor="time-scale-select" className="field-label">
          Time Range:
        </label>
        <select
          id="time-scale-select"
          className="select"
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
          className="button button-primary"
          onClick={onRefresh}
          disabled={isRefreshing}
        >
          {isRefreshing ? 'Refreshing...' : 'Refresh Data'}
        </button>
        <button
          type="button"
          className="button"
          onClick={() => window.open(BACKUP_URL, '_blank')}
        >
          Download Backup
        </button>
      </div>
    </div>
  )
}

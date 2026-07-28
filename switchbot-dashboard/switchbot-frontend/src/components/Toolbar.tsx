import type { TimeScale } from '../api/types'
import { TIME_SCALE_OPTIONS } from '../constants/timeScales'

interface ToolbarProps {
  timeScale: TimeScale
  onTimeScaleChange: (timeScale: TimeScale) => void
  onRefresh: () => void
  onDownloadBackup: () => void
  isRefreshing: boolean
}

export default function Toolbar({
  timeScale,
  onTimeScaleChange,
  onRefresh,
  onDownloadBackup,
  isRefreshing,
}: ToolbarProps) {
  return (
    <div className="card mb-4 flex flex-wrap items-center gap-3 p-4">
      <label className="flex items-center gap-2 text-sm" htmlFor="time-scale-select">
        <span>Time Range:</span>
        <select
          id="time-scale-select"
          className="field"
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

      <button type="button" className="btn btn-primary" onClick={onRefresh} disabled={isRefreshing}>
        {isRefreshing ? 'Refreshing...' : 'Refresh Data'}
      </button>
      <button type="button" className="btn btn-secondary" onClick={onDownloadBackup}>
        Download Backup
      </button>
    </div>
  )
}

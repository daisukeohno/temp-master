import type { TimeScale } from '../api/types'
import { TIME_SCALE_OPTIONS } from '../constants/config'

interface Props {
  value: TimeScale
  onChange: (value: TimeScale) => void
}

export function TimeScaleSelect({ value, onChange }: Props) {
  return (
    <div className="theme-switcher">
      <label htmlFor="time-scale-select">Time Range:</label>
      <select
        id="time-scale-select"
        value={value}
        onChange={(event) => onChange(event.target.value as TimeScale)}
      >
        {TIME_SCALE_OPTIONS.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  )
}

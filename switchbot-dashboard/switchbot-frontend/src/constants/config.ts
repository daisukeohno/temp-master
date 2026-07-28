import type { TimeScale } from '../api/types'

export const REFRESH_INTERVAL = 30000
export const STALE_METER_THRESHOLD_MS = 7 * 24 * 60 * 60 * 1000

export const TIME_SCALE_OPTIONS: { value: TimeScale; label: string }[] = [
  { value: 'hour', label: 'Last Hour' },
  { value: 'day', label: 'Last 24 Hours' },
  { value: 'week', label: 'Last 7 Days' },
  { value: 'month', label: 'Last 30 Days' },
  { value: 'year', label: 'Last Year' },
]

export const DEFAULT_TIME_SCALE: TimeScale = 'day'

import type { StatusResponse } from '../api/types'
import { formatClockTime } from '../utils/format'

interface StatusBarProps {
  status: StatusResponse
  lastRefresh: Date | null
}

export default function StatusBar({ status, lastRefresh }: StatusBarProps) {
  const noun = status.meters_count === 1 ? 'meter' : 'meters'

  return (
    <div className="card mb-4 flex flex-wrap items-center justify-between gap-2 border-l-4 border-l-accent p-3 text-sm">
      <span>
        Monitoring {status.meters_count} {noun}
      </span>
      {lastRefresh && (
        <span className="text-muted">Last refresh: {formatClockTime(lastRefresh)}</span>
      )}
    </div>
  )
}

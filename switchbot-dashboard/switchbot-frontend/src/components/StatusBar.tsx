import type { StatusResponse } from '../api/types'
import { formatClockTime } from '../utils/format'

interface Props {
  status: StatusResponse
  lastRefresh: Date | null
}

export function StatusBar({ status, lastRefresh }: Props) {
  const count = status.meters_count || 0
  const noun = count === 1 ? 'meter' : 'meters'

  return (
    <div className="alert alert-info">
      <span>{`Monitoring ${count} ${noun}`}</span>
      {lastRefresh && <span>{`Last refresh: ${formatClockTime(lastRefresh)}`}</span>}
    </div>
  )
}

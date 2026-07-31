import { formatClockTime } from '../utils/format'
import type { StatusResponse } from '../types'

interface StatusBarProps {
  status: StatusResponse
  lastRefreshedAt: number
}

export function StatusBar({ status, lastRefreshedAt }: StatusBarProps) {
  const count = status.meters_count ?? 0
  const noun = count === 1 ? 'meter' : 'meters'

  return (
    <>
      <div className="alert alert-info status-bar">
        <span>{`Monitoring ${count} ${noun}`}</span>
        {lastRefreshedAt > 0 && (
          <span>{`Last refresh: ${formatClockTime(new Date(lastRefreshedAt))}`}</span>
        )}
      </div>
      {status.is_rate_limited && (
        <div className="alert alert-warning">
          <strong>Rate Limited.</strong>{' '}
          {`SwitchBot API rate limit reached. Retry in ${status.backoff_remaining ?? 0} seconds.`}
        </div>
      )}
    </>
  )
}

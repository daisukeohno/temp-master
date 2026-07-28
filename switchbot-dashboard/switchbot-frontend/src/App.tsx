import { useMemo, useState } from 'react'
import { backupUrl } from './api/client'
import type { TimeScale } from './api/types'
import { MeterGrid } from './components/MeterGrid'
import { Navbar } from './components/Navbar'
import { RateLimitWarning } from './components/RateLimitWarning'
import { StaleMetersSection } from './components/StaleMetersSection'
import { StatusBar } from './components/StatusBar'
import { TimeScaleSelect } from './components/TimeScaleSelect'
import { DEFAULT_TIME_SCALE } from './constants/config'
import { useMeters } from './hooks/useMeters'
import { useRefresh } from './hooks/useRefresh'
import { useStatus } from './hooks/useStatus'
import { isStaleMeter } from './utils/format'

export function App() {
  const [timeScale, setTimeScale] = useState<TimeScale>(DEFAULT_TIME_SCALE)
  const metersQuery = useMeters()
  const statusQuery = useStatus()
  const refresh = useRefresh()

  const meters = useMemo(() => metersQuery.data?.meters ?? [], [metersQuery.data])
  const { activeMeters, staleMeters } = useMemo(() => {
    const active = meters.filter((meter) => !isStaleMeter(meter))
    const stale = meters.filter((meter) => isStaleMeter(meter))
    return { activeMeters: active, staleMeters: stale }
  }, [meters])

  const error = metersQuery.error ?? statusQuery.error
  const connected = !error
  const status = statusQuery.data
  const lastRefresh = statusQuery.dataUpdatedAt ? new Date(statusQuery.dataUpdatedAt) : null

  return (
    <>
      <Navbar connected={connected} />
      <div className="container">
        <div className="panel">
          <div className="panel-body controls">
            <TimeScaleSelect value={timeScale} onChange={setTimeScale} />
            <button
              type="button"
              className="primary"
              disabled={refresh.isPending}
              onClick={() => refresh.mutate()}
            >
              {refresh.isPending ? 'Refreshing...' : 'Refresh Data'}
            </button>
            <button type="button" onClick={() => window.open(backupUrl(), '_blank')}>
              Download Backup
            </button>
          </div>
        </div>

        {status && <StatusBar status={status} lastRefresh={lastRefresh} />}

        {status?.is_rate_limited && (
          <RateLimitWarning backoffRemaining={status.backoff_remaining} />
        )}

        {error && (
          <div className="alert alert-danger">
            <strong>Error.</strong> {`Failed to fetch data: ${error.message}`}
          </div>
        )}

        {refresh.isError && (
          <div className="alert alert-danger">
            <strong>Error.</strong> {`Failed to refresh: ${refresh.error.message}`}
          </div>
        )}

        {metersQuery.isPending ? (
          <div className="loading">Loading temperature data...</div>
        ) : (
          <>
            <MeterGrid meters={activeMeters} timeScale={timeScale} />
            <StaleMetersSection meters={staleMeters} timeScale={timeScale} />
          </>
        )}

        <footer>Temp Master Dashboard v1.0 - Built with React + Vite + TypeScript</footer>
      </div>
    </>
  )
}

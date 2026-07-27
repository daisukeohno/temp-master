import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useMemo, useState } from 'react'
import { fetchMeters, fetchStatus, openBackup, triggerRefresh } from './api'
import { Controls } from './components/Controls'
import { MeterGrid } from './components/MeterGrid'
import { Navbar } from './components/Navbar'
import { RateLimitWarning } from './components/RateLimitWarning'
import { StaleMetersSection } from './components/StaleMetersSection'
import { StatusBar } from './components/StatusBar'
import type { TimeScale } from './types'
import { isStaleMeter } from './utils'

const REFRESH_INTERVAL = 30000

export function App() {
  const [timeScale, setTimeScale] = useState<TimeScale>('day')
  const queryClient = useQueryClient()

  const metersQuery = useQuery({
    queryKey: ['meters'],
    queryFn: fetchMeters,
    refetchInterval: REFRESH_INTERVAL,
  })
  const statusQuery = useQuery({
    queryKey: ['status'],
    queryFn: fetchStatus,
    refetchInterval: REFRESH_INTERVAL,
  })

  const refreshMutation = useMutation({
    mutationFn: triggerRefresh,
    onSettled: () => {
      void queryClient.invalidateQueries()
    },
  })

  const meters = useMemo(() => metersQuery.data?.meters ?? [], [metersQuery.data])
  const { activeMeters, staleMeters } = useMemo(() => {
    const active = []
    const stale = []
    for (const meter of meters) {
      if (isStaleMeter(meter)) {
        stale.push(meter)
      } else {
        active.push(meter)
      }
    }
    return { activeMeters: active, staleMeters: stale }
  }, [meters])

  const status = statusQuery.data
  const isLoading = metersQuery.isPending || statusQuery.isPending
  const error = metersQuery.error
    ? `Failed to fetch meters: ${metersQuery.error.message}`
    : statusQuery.error
      ? `Failed to fetch status: ${statusQuery.error.message}`
      : refreshMutation.error
        ? `Failed to refresh: ${refreshMutation.error.message}`
        : null
  const connected = !metersQuery.isError && !statusQuery.isError

  const lastRefresh = useMemo(
    () => new Date(statusQuery.dataUpdatedAt || Date.now()),
    [statusQuery.dataUpdatedAt],
  )

  return (
    <>
      <Navbar connected={connected} />
      <div className="container">
        <Controls
          timeScale={timeScale}
          onTimeScaleChange={setTimeScale}
          onRefresh={() => refreshMutation.mutate()}
          onBackup={openBackup}
          isRefreshing={refreshMutation.isPending}
        />

        {status && (
          <StatusBar
            metersCount={status.meters_count ?? 0}
            lastRefresh={lastRefresh}
          />
        )}

        {status?.is_rate_limited && (
          <RateLimitWarning backoffRemaining={status.backoff_remaining ?? 0} />
        )}

        {isLoading && <div className="loading">Loading temperature data...</div>}

        {error && (
          <div id="error" className="alert alert-danger">
            <span>
              <strong>Error.</strong> <span id="error-text">{error}</span>
            </span>
          </div>
        )}

        <MeterGrid meters={activeMeters} timeScale={timeScale} />
        <StaleMetersSection meters={staleMeters} timeScale={timeScale} />

        <footer>Temp Master Dashboard v1.0 - Built with React + Vite</footer>
      </div>
    </>
  )
}

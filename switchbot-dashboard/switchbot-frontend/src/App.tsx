import { useMemo, useState } from 'react'
import { Controls } from './components/Controls'
import { MeterCard } from './components/MeterCard'
import { Navbar } from './components/Navbar'
import { StaleMetersSection } from './components/StaleMetersSection'
import { StatusBar } from './components/StatusBar'
import { DEFAULT_TIME_SCALE } from './constants'
import {
  useMetersQuery,
  useRefreshMutation,
  useStatusQuery,
} from './hooks/useDashboardData'
import { isStaleMeter } from './utils/format'
import type { TimeScale } from './types'

export function App() {
  const [timeScale, setTimeScale] = useState<TimeScale>(DEFAULT_TIME_SCALE)

  const metersQuery = useMetersQuery()
  const statusQuery = useStatusQuery()
  const refreshMutation = useRefreshMutation()

  const { activeMeters, staleMeters } = useMemo(() => {
    const meters = metersQuery.data?.meters ?? []
    return {
      activeMeters: meters.filter((meter) => !isStaleMeter(meter)),
      staleMeters: meters.filter(isStaleMeter),
    }
  }, [metersQuery.data])

  const connected = !metersQuery.isError && !statusQuery.isError
  const errorMessage = metersQuery.isError
    ? `Failed to fetch meters: ${metersQuery.error.message}`
    : statusQuery.isError
      ? `Failed to fetch status: ${statusQuery.error.message}`
      : refreshMutation.isError
        ? `Failed to refresh: ${refreshMutation.error.message}`
        : null

  return (
    <div className="app">
      <Navbar connected={connected} />

      <main className="container">
        <Controls
          timeScale={timeScale}
          onTimeScaleChange={setTimeScale}
          onRefresh={() => refreshMutation.mutate()}
          isRefreshing={refreshMutation.isPending}
        />

        {statusQuery.data && (
          <StatusBar
            status={statusQuery.data}
            lastRefreshedAt={metersQuery.dataUpdatedAt}
          />
        )}

        {errorMessage && (
          <div className="alert alert-danger">
            <strong>Error.</strong> {errorMessage}
          </div>
        )}

        {metersQuery.isPending && (
          <p className="loading">Loading temperature data...</p>
        )}

        {activeMeters.length > 0 && (
          <div className="meter-grid">
            {activeMeters.map((meter) => (
              <MeterCard
                key={meter.device_id}
                meter={meter}
                timeScale={timeScale}
                isStale={false}
              />
            ))}
          </div>
        )}

        <StaleMetersSection meters={staleMeters} timeScale={timeScale} />

        <footer>Temp Master Dashboard v2.0 - Built with Vite + React + TypeScript</footer>
      </main>
    </div>
  )
}

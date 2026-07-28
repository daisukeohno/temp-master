import { useMemo, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { downloadBackup, fetchMeters, fetchStatus, triggerRefresh } from './api/client'
import type { Meter, TimeScale } from './api/types'
import MeterCard from './components/MeterCard'
import StatusBar from './components/StatusBar'
import ThemeSelector from './components/ThemeSelector'
import Toolbar from './components/Toolbar'
import { DEFAULT_TIME_SCALE, REFRESH_INTERVAL_MS } from './constants/timeScales'
import { isStaleMeter } from './utils/format'

export default function App() {
  const [timeScale, setTimeScale] = useState<TimeScale>(DEFAULT_TIME_SCALE)
  const queryClient = useQueryClient()

  const metersQuery = useQuery({
    queryKey: ['meters'],
    queryFn: fetchMeters,
    refetchInterval: REFRESH_INTERVAL_MS,
  })

  const statusQuery = useQuery({
    queryKey: ['status'],
    queryFn: fetchStatus,
    refetchInterval: REFRESH_INTERVAL_MS,
  })

  const refreshMutation = useMutation({
    mutationFn: triggerRefresh,
    onSettled: () => {
      void queryClient.invalidateQueries()
    },
  })

  const meters = metersQuery.data?.meters ?? []
  const { activeMeters, staleMeters } = useMemo(() => {
    const active: Meter[] = []
    const stale: Meter[] = []
    for (const meter of meters) {
      if (isStaleMeter(meter)) {
        stale.push(meter)
      } else {
        active.push(meter)
      }
    }
    return { activeMeters: active, staleMeters: stale }
  }, [meters])

  const isConnected = !metersQuery.isError && !statusQuery.isError
  const errorMessage = metersQuery.error?.message ?? statusQuery.error?.message ?? null
  const lastRefresh = metersQuery.dataUpdatedAt ? new Date(metersQuery.dataUpdatedAt) : null
  const status = statusQuery.data

  return (
    <div className="min-h-screen bg-app text-content">
      <nav className="sticky top-0 z-10 border-b border-border bg-surface">
        <div className="mx-auto flex max-w-[1600px] flex-wrap items-center justify-between gap-3 px-4 py-3">
          <span className="text-lg font-semibold">Temp Master Dashboard</span>
          <div className="flex items-center gap-3">
            <ThemeSelector />
            <span
              className={`badge ${
                isConnected ? 'bg-battery text-white' : 'bg-danger text-white'
              }`}
            >
              {isConnected ? 'Connected' : 'Disconnected'}
            </span>
          </div>
        </div>
      </nav>

      <main className="mx-auto max-w-[1600px] px-4 py-4">
        <Toolbar
          timeScale={timeScale}
          onTimeScaleChange={setTimeScale}
          onRefresh={() => refreshMutation.mutate()}
          onDownloadBackup={downloadBackup}
          isRefreshing={refreshMutation.isPending}
        />

        {status && <StatusBar status={status} lastRefresh={lastRefresh} />}

        {status?.is_rate_limited && (
          <div className="card mb-4 border-l-4 border-l-warn p-3 text-sm">
            <strong>Rate Limited.</strong> SwitchBot API rate limit reached. Retry in{' '}
            {status.backoff_remaining} seconds.
          </div>
        )}

        {errorMessage && (
          <div className="card mb-4 border-l-4 border-l-danger p-3 text-sm">
            <strong>Error.</strong> {errorMessage}
          </div>
        )}

        {metersQuery.isPending ? (
          <p className="py-10 text-center text-muted">Loading temperature data...</p>
        ) : (
          <>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {activeMeters.map((meter) => (
                <MeterCard
                  key={meter.device_id}
                  meter={meter}
                  timeScale={timeScale}
                  isStale={false}
                />
              ))}
            </div>

            {staleMeters.length > 0 && (
              <section className="mt-6">
                <h2 className="text-lg font-semibold text-warn">未更新のメーター</h2>
                <p className="mb-3 text-xs text-warn">1週間以上更新されていないデバイス</p>
                <div className="card border-warn p-4">
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
                    {staleMeters.map((meter) => (
                      <MeterCard
                        key={meter.device_id}
                        meter={meter}
                        timeScale={timeScale}
                        isStale
                      />
                    ))}
                  </div>
                </div>
              </section>
            )}
          </>
        )}

        <footer className="my-8 text-center text-xs text-muted">
          Temp Master Dashboard v1.0 - Built with React + Vite
        </footer>
      </main>
    </div>
  )
}

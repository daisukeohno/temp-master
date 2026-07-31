import { useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { getMeters, getStatus, openBackup, refreshMeters } from './api/client'
import { REFRESH_INTERVAL } from './api/queryClient'
import Controls from './components/Controls'
import MeterGrid from './components/MeterGrid'
import Navbar from './components/Navbar'
import RateLimitWarning from './components/RateLimitWarning'
import StatusBar from './components/StatusBar'
import type { TimeScale } from './types'

export default function App() {
  const [timeScale, setTimeScale] = useState<TimeScale>('day')
  const queryClient = useQueryClient()

  const metersQuery = useQuery({
    queryKey: ['meters'],
    queryFn: getMeters,
    refetchInterval: REFRESH_INTERVAL,
  })

  const statusQuery = useQuery({
    queryKey: ['status'],
    queryFn: getStatus,
    refetchInterval: REFRESH_INTERVAL,
  })

  const refreshMutation = useMutation({
    mutationFn: refreshMeters,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['meters'] })
      queryClient.invalidateQueries({ queryKey: ['status'] })
      queryClient.invalidateQueries({ queryKey: ['history'] })
    },
  })

  const isLoading = metersQuery.isLoading || statusQuery.isLoading
  const error = metersQuery.error ?? statusQuery.error ?? refreshMutation.error
  const connected = !metersQuery.isError && !statusQuery.isError
  const status = statusQuery.data
  const meters = metersQuery.data?.meters ?? []
  const lastRefresh = new Date(
    Math.max(metersQuery.dataUpdatedAt, statusQuery.dataUpdatedAt) || Date.now(),
  )

  return (
    <div className="min-h-screen">
      <Navbar connected={connected} />

      <main className="mx-auto max-w-[1600px] px-4 py-5">
        <Controls
          timeScale={timeScale}
          onTimeScaleChange={setTimeScale}
          onRefresh={() => refreshMutation.mutate()}
          onBackup={openBackup}
          refreshing={refreshMutation.isPending}
        />

        {status && (
          <StatusBar metersCount={status.meters_count} lastRefresh={lastRefresh} />
        )}

        {status?.is_rate_limited && (
          <RateLimitWarning backoffRemaining={status.backoff_remaining} />
        )}

        {isLoading && (
          <p className="py-10 text-center text-muted">Loading temperature data...</p>
        )}

        {error && (
          <div
            className="mb-4 rounded border border-border bg-surface px-4 py-3 text-sm"
            style={{ borderLeft: '4px solid var(--color-danger)' }}
          >
            <strong>Error.</strong> {error.message}
          </div>
        )}

        {!isLoading && <MeterGrid meters={meters} timeScale={timeScale} />}

        <footer className="my-8 text-center text-xs text-muted">
          Temp Master Dashboard v2.0 - Built with React + TypeScript + Vite
        </footer>
      </main>
    </div>
  )
}

import { useMemo, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { openBackup, triggerRefresh } from './api/client';
import { useHistories, useMeters, useStatus } from './api/queries';
import type { TimeScale } from './api/types';
import { Controls } from './components/Controls';
import { MeterGrid } from './components/MeterGrid';
import { MeterPanel } from './components/MeterPanel';
import { Navbar } from './components/Navbar';
import { RateLimitWarning } from './components/RateLimitWarning';
import { StaleMetersSection } from './components/StaleMetersSection';
import { StatusBar } from './components/StatusBar';
import { formatClock, isStaleMeter } from './utils';

export default function App() {
  const [timeScale, setTimeScale] = useState<TimeScale>('day');
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const queryClient = useQueryClient();

  const metersQuery = useMeters();
  const statusQuery = useStatus();

  const meters = metersQuery.data?.meters ?? [];
  const { activeMeters, staleMeters } = useMemo(() => {
    return {
      activeMeters: meters.filter((meter) => !isStaleMeter(meter)),
      staleMeters: meters.filter((meter) => isStaleMeter(meter)),
    };
  }, [meters]);

  const historyQueries = useHistories(activeMeters, timeScale);

  const connected = !metersQuery.isError && !statusQuery.isError;
  const status = statusQuery.data;
  const isLoading = metersQuery.isPending || statusQuery.isPending;

  const lastRefresh = formatClock(
    new Date(Math.max(metersQuery.dataUpdatedAt, statusQuery.dataUpdatedAt) || Date.now()),
  );

  async function handleRefresh() {
    setRefreshing(true);
    setError(null);
    try {
      await triggerRefresh();
    } catch (err) {
      setError(`Failed to refresh: ${(err as Error).message}`);
    } finally {
      await queryClient.invalidateQueries();
      setRefreshing(false);
    }
  }

  return (
    <>
      <Navbar connected={connected} />
      <div className="px-4 pb-8 pt-[72px]">
        <Controls
          timeScale={timeScale}
          onTimeScaleChange={setTimeScale}
          onRefresh={handleRefresh}
          onBackup={openBackup}
          refreshing={refreshing}
        />

        {status && (
          <StatusBar metersCount={status.meters_count} lastRefresh={lastRefresh} />
        )}

        {status?.is_rate_limited && (
          <RateLimitWarning backoffRemaining={status.backoff_remaining} />
        )}

        {(error || metersQuery.isError || statusQuery.isError) && (
          <div className="mb-4 rounded border border-danger bg-surface-alt px-4 py-2 text-sm text-danger">
            <strong>Error.</strong>{' '}
            {error ??
              `Failed to fetch data: ${
                (metersQuery.error as Error | null)?.message ??
                (statusQuery.error as Error | null)?.message ??
                'unknown error'
              }`}
          </div>
        )}

        {isLoading ? (
          <p className="py-10 text-center text-muted">Loading temperature data...</p>
        ) : (
          <MeterGrid>
            {activeMeters.map((meter, index) => (
              <MeterPanel
                key={meter.device_id}
                meter={meter}
                history={historyQueries[index]?.data?.history ?? []}
                timeScale={timeScale}
              />
            ))}
          </MeterGrid>
        )}

        {staleMeters.length > 0 && (
          <StaleMetersSection meters={staleMeters} timeScale={timeScale} />
        )}

        <footer className="mt-8 text-center text-xs text-muted">
          Temp Master Dashboard v2.0 - Built with React + Vite + Tailwind CSS
        </footer>
      </div>
    </>
  );
}

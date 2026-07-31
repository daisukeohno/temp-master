import { useMemo, useState } from 'react';
import type { Meter, TimeScale } from './api/client';
import { useMeters, useRefresh, useStatus } from './api/hooks';
import { Controls } from './components/Controls';
import { MeterGrid } from './components/MeterGrid';
import { Navbar } from './components/Navbar';
import { RateLimitWarning } from './components/RateLimitWarning';
import { StaleMetersSection } from './components/StaleMetersSection';
import { StatusBar } from './components/StatusBar';
import { STALE_METER_THRESHOLD_MS } from './constants';

function isStaleMeter(meter: Meter): boolean {
  if (!meter.last_updated) {
    return true;
  }
  const lastUpdated = new Date(meter.last_updated);
  if (Number.isNaN(lastUpdated.getTime())) {
    return true;
  }
  return Date.now() - lastUpdated.getTime() >= STALE_METER_THRESHOLD_MS;
}

export default function App() {
  const [timeScale, setTimeScale] = useState<TimeScale>('day');

  const metersQuery = useMeters();
  const statusQuery = useStatus();
  const refresh = useRefresh();

  const meters = useMemo(() => metersQuery.data?.meters ?? [], [metersQuery.data]);
  const { activeMeters, staleMeters } = useMemo(() => {
    const active: Meter[] = [];
    const stale: Meter[] = [];
    for (const meter of meters) {
      (isStaleMeter(meter) ? stale : active).push(meter);
    }
    return { activeMeters: active, staleMeters: stale };
  }, [meters]);

  const isError = metersQuery.isError || statusQuery.isError;
  const isLoading = metersQuery.isLoading || statusQuery.isLoading;
  const status = statusQuery.data;
  const lastRefresh = statusQuery.dataUpdatedAt ? new Date(statusQuery.dataUpdatedAt) : null;

  return (
    <div className="min-h-screen bg-bg text-fg">
      <Navbar connected={!isError} />

      <main className="px-4 py-4">
        <Controls
          timeScale={timeScale}
          onTimeScaleChange={setTimeScale}
          onRefresh={() => refresh.mutate()}
          isRefreshing={refresh.isPending}
        />

        {status && <StatusBar metersCount={status.meters_count} lastRefresh={lastRefresh} />}

        {status?.is_rate_limited && (
          <RateLimitWarning backoffRemaining={status.backoff_remaining ?? 0} />
        )}

        {isLoading && <p className="py-10 text-center text-muted">Loading temperature data...</p>}

        {isError && (
          <div className="mb-4 rounded-lg border border-danger bg-panel px-4 py-2 text-sm text-danger">
            <strong>Error.</strong> Failed to fetch data.
          </div>
        )}

        <MeterGrid meters={activeMeters} timeScale={timeScale} />
        <StaleMetersSection meters={staleMeters} timeScale={timeScale} />

        <footer className="my-8 text-center text-xs text-muted">
          Temp Master Dashboard v2.0 - Built with React + Vite + Tailwind CSS
        </footer>
      </main>
    </div>
  );
}

import { useEffect, useMemo, useState } from 'react';
import { backupUrl } from './api/meters';
import type { TimeScale } from './api/types';
import { Controls } from './components/Controls';
import { Footer } from './components/Footer';
import { MeterGrid, StaleMeterSection } from './components/MeterGrid';
import { Navbar } from './components/Navbar';
import { ErrorBanner, RateLimitWarning, StatusBar } from './components/StatusBar';
import {
  useMeterHistories,
  useMeters,
  useRefreshMeters,
  useStatus,
} from './hooks/useDashboardData';
import { formatClockTime } from './lib/format';
import { partitionMeters } from './lib/stale';

export function Dashboard() {
  const [timeScale, setTimeScale] = useState<TimeScale>('day');
  const [lastRefresh, setLastRefresh] = useState<string | null>(null);

  const metersQuery = useMeters();
  const statusQuery = useStatus();
  const refreshMutation = useRefreshMeters();

  const meters = metersQuery.data?.meters;
  const { active, stale } = useMemo(() => partitionMeters(meters ?? []), [meters]);
  const activeIds = useMemo(() => active.map((meter) => meter.device_id), [active]);
  const histories = useMeterHistories(activeIds, timeScale);

  useEffect(() => {
    if (metersQuery.dataUpdatedAt) {
      setLastRefresh(formatClockTime(new Date(metersQuery.dataUpdatedAt)));
    }
  }, [metersQuery.dataUpdatedAt]);

  const error = metersQuery.error ?? statusQuery.error;
  const connected = !error && (metersQuery.isSuccess || statusQuery.isSuccess);
  const status = statusQuery.data;

  return (
    <div className="min-h-screen">
      <Navbar connected={connected} />
      <main className="mx-auto max-w-7xl space-y-4 px-4 py-6">
        <Controls
          timeScale={timeScale}
          onTimeScaleChange={setTimeScale}
          onRefresh={() => refreshMutation.mutate()}
          onBackup={() => window.open(backupUrl(), '_blank')}
          isRefreshing={refreshMutation.isPending}
        />

        {status && <StatusBar metersCount={status.meters_count} lastRefresh={lastRefresh} />}

        {status?.is_rate_limited && (
          <RateLimitWarning backoffRemaining={status.backoff_remaining} />
        )}

        {error && <ErrorBanner message={error.message} />}

        {metersQuery.isLoading ? (
          <p className="py-10 text-center text-sm text-text-muted">Loading temperature data...</p>
        ) : (
          <>
            <MeterGrid meters={active} historyByDevice={histories.byDevice} timeScale={timeScale} />
            <StaleMeterSection meters={stale} timeScale={timeScale} />
          </>
        )}

        <Footer />
      </main>
    </div>
  );
}

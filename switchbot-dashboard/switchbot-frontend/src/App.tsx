import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { backupUrl, fetchHistory, fetchMeters, fetchStatus, triggerRefresh } from './api/client';
import { Controls } from './components/Controls';
import { MeterCard } from './components/MeterCard';
import { Navbar } from './components/Navbar';
import { RateLimitWarning, StatusBar } from './components/StatusBar';
import { StaleMetersSection } from './components/StaleMetersSection';
import { isStaleMeter } from './lib/format';
import type { HistoryPoint, MeterDevice, StatusResponse, TimeScale } from './types';

const REFRESH_INTERVAL_MS = 30000;

export default function App() {
  const [meters, setMeters] = useState<MeterDevice[]>([]);
  const [status, setStatus] = useState<StatusResponse | null>(null);
  const [histories, setHistories] = useState<Record<string, HistoryPoint[]>>({});
  const [timeScale, setTimeScale] = useState<TimeScale>('day');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [connected, setConnected] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [lastRefresh, setLastRefresh] = useState<Date | null>(null);
  const timeScaleRef = useRef(timeScale);
  timeScaleRef.current = timeScale;

  const loadHistories = useCallback(async (activeMeters: MeterDevice[], scale: TimeScale) => {
    const results = await Promise.all(
      activeMeters.map(async (meter) => {
        try {
          const response = await fetchHistory(meter.device_id, scale);
          return [meter.device_id, response.history ?? []] as const;
        } catch {
          return [meter.device_id, []] as const;
        }
      }),
    );
    if (scale !== timeScaleRef.current) {
      return;
    }
    setHistories(Object.fromEntries(results));
  }, []);

  const loadData = useCallback(async () => {
    try {
      const [metersResponse, statusResponse] = await Promise.all([fetchMeters(), fetchStatus()]);
      const nextMeters = metersResponse.meters ?? [];
      setMeters(nextMeters);
      setStatus(statusResponse);
      setError(null);
      setConnected(true);
      setLoading(false);
      setLastRefresh(new Date());
      await loadHistories(
        nextMeters.filter((meter) => !isStaleMeter(meter)),
        timeScaleRef.current,
      );
    } catch (err) {
      setLoading(false);
      setConnected(false);
      setError(`Failed to fetch data: ${err instanceof Error ? err.message : String(err)}`);
    }
  }, [loadHistories]);

  useEffect(() => {
    void loadData();
    const interval = window.setInterval(() => void loadData(), REFRESH_INTERVAL_MS);
    return () => window.clearInterval(interval);
  }, [loadData]);

  useEffect(() => {
    setHistories({});
    void loadHistories(
      meters.filter((meter) => !isStaleMeter(meter)),
      timeScale,
    );
    // Histories are refetched whenever the selected time scale changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeScale]);

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await triggerRefresh();
    } catch (err) {
      setError(`Failed to refresh: ${err instanceof Error ? err.message : String(err)}`);
    }
    await loadData();
    setRefreshing(false);
  }, [loadData]);

  const handleBackup = useCallback(() => {
    window.open(backupUrl(), '_blank');
  }, []);

  const { activeMeters, staleMeters } = useMemo(() => {
    const active: MeterDevice[] = [];
    const stale: MeterDevice[] = [];
    for (const meter of meters) {
      (isStaleMeter(meter) ? stale : active).push(meter);
    }
    return { activeMeters: active, staleMeters: stale };
  }, [meters]);

  return (
    <div className="min-h-screen bg-background pt-14 text-foreground">
      <Navbar connected={connected} />

      <main className="mx-auto max-w-[1600px] px-4 py-4">
        <Controls
          timeScale={timeScale}
          onTimeScaleChange={setTimeScale}
          onRefresh={() => void handleRefresh()}
          onBackup={handleBackup}
          refreshing={refreshing}
        />

        {status && <StatusBar status={status} lastRefresh={lastRefresh} />}
        {status?.is_rate_limited && (
          <RateLimitWarning backoffRemaining={status.backoff_remaining ?? 0} />
        )}

        {loading && (
          <div className="py-10 text-center text-muted">Loading temperature data...</div>
        )}

        {error && (
          <div className="panel mb-4 border-danger/70 bg-danger/15 p-3 text-sm">
            <strong>Error.</strong> {error}
          </div>
        )}

        {activeMeters.length > 0 && (
          <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {activeMeters.map((meter) => (
              <MeterCard
                key={meter.device_id}
                meter={meter}
                history={histories[meter.device_id] ?? []}
                timeScale={timeScale}
                isStale={false}
              />
            ))}
          </div>
        )}

        <StaleMetersSection meters={staleMeters} timeScale={timeScale} />

        <footer className="py-6 text-center text-xs text-muted">
          Temp Master Dashboard v2.0 - Built with Vite + React + TypeScript
        </footer>
      </main>
    </div>
  );
}

import { useCallback, useMemo, useState } from 'react';
import { downloadBackup, triggerRefresh, type TimeScale } from './api';
import { Controls } from './components/Controls';
import { MeterGrid } from './components/MeterGrid';
import { Navbar } from './components/Navbar';
import { StaleMetersSection } from './components/StaleMetersSection';
import { StatusBar } from './components/StatusBar';
import { useDashboardData } from './hooks/useDashboardData';
import { useHistories } from './hooks/useHistories';
import { partitionMeters } from './utils/meters';

export default function App() {
  const [timeScale, setTimeScale] = useState<TimeScale>('day');
  const [refreshing, setRefreshing] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);
  const { meters, status, lastRefresh, loading, error, reload } = useDashboardData();

  const { active, stale } = useMemo(() => partitionMeters(meters), [meters]);
  const activeIds = useMemo(() => active.map((meter) => meter.device_id), [active]);
  const historyRevision = lastRefresh ? lastRefresh.getTime() : 0;
  const histories = useHistories(activeIds, timeScale, historyRevision);

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    setActionError(null);
    try {
      await triggerRefresh();
    } catch (err) {
      setActionError(`Failed to refresh: ${err instanceof Error ? err.message : String(err)}`);
    } finally {
      await reload();
      setRefreshing(false);
    }
  }, [reload]);

  const handleBackup = useCallback(async () => {
    setActionError(null);
    try {
      await downloadBackup();
    } catch (err) {
      setActionError(
        `Failed to download backup: ${err instanceof Error ? err.message : String(err)}`,
      );
    }
  }, []);

  const displayedError = error ?? actionError;

  return (
    <>
      <Navbar connected={!error} />
      <div className="container">
        <Controls
          timeScale={timeScale}
          onTimeScaleChange={setTimeScale}
          onRefresh={() => void handleRefresh()}
          onBackup={() => void handleBackup()}
          refreshing={refreshing}
        />

        <StatusBar status={status} lastRefresh={lastRefresh} />

        {displayedError && (
          <div className="alert alert--danger" role="alert">
            <span>
              <strong>Error.</strong> {displayedError}
            </span>
          </div>
        )}

        {loading ? (
          <p className="loading">Loading temperature data...</p>
        ) : (
          <>
            <MeterGrid meters={active} histories={histories} timeScale={timeScale} />
            <StaleMetersSection meters={stale} timeScale={timeScale} />
          </>
        )}

        <footer>Temp Master Dashboard v2.0 - Built with React + Vite + Recharts</footer>
      </div>
    </>
  );
}

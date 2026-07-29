import { useState } from 'react';
import Controls from './components/Controls';
import MeterGrid from './components/MeterGrid';
import Navbar from './components/Navbar';
import StaleMetersSection from './components/StaleMetersSection';
import StatusBar from './components/StatusBar';
import { openBackup } from './api/client';
import { useMeters, useRefreshMeters, useStatus } from './hooks/useApi';
import { partitionMeters } from './lib/meters';
import type { TimeScale } from './types';

export default function App() {
  const [timeScale, setTimeScale] = useState<TimeScale>('day');
  const meters = useMeters();
  const status = useStatus();
  const refresh = useRefreshMeters();

  const failed = meters.isError || status.isError;
  const { active, stale } = partitionMeters(meters.data?.meters ?? []);
  const lastRefresh = new Date(meters.dataUpdatedAt || Date.now());

  return (
    <div className="min-h-screen bg-bg pt-16 text-text">
      <Navbar connected={!failed} />
      <div className="mx-auto max-w-screen-2xl px-4 py-4">
        <Controls
          timeScale={timeScale}
          onTimeScaleChange={setTimeScale}
          onRefresh={() => refresh.mutate()}
          onBackup={openBackup}
          refreshing={refresh.isPending}
        />

        {status.data && <StatusBar status={status.data} lastRefresh={lastRefresh} />}

        {failed && (
          <div className="mb-4 rounded border border-red-500 bg-red-100 px-4 py-2 text-sm text-red-800">
            <strong>Error.</strong>{' '}
            {(meters.error ?? status.error)?.message ?? 'Failed to fetch data.'}
          </div>
        )}

        {meters.isPending ? (
          <p className="py-10 text-center text-muted">Loading temperature data...</p>
        ) : (
          <>
            <MeterGrid meters={active} timeScale={timeScale} />
            <StaleMetersSection meters={stale} timeScale={timeScale} />
          </>
        )}

        <footer className="my-8 text-center text-xs text-muted">
          Temp Master Dashboard v1.0 - Built with React + Vite
        </footer>
      </div>
    </div>
  );
}

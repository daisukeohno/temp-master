import { useMemo, useState } from "react";
import { backupUrl } from "./api/client";
import { useMeters, useRefreshMeters, useStatus } from "./api/hooks";
import type { TimeScale } from "./api/types";
import { Controls } from "./components/Controls";
import { MeterGrid } from "./components/MeterGrid";
import { Navbar } from "./components/Navbar";
import { RateLimitWarning, StatusBar } from "./components/StatusBar";
import { StaleMetersSection } from "./components/StaleMetersSection";
import { isStaleMeter } from "./utils/format";

export function App() {
  const [timeScale, setTimeScale] = useState<TimeScale>("day");

  const metersQuery = useMeters();
  const statusQuery = useStatus();
  const refreshMutation = useRefreshMeters();

  const meters = metersQuery.data?.meters ?? [];
  const connected = !metersQuery.isError && !statusQuery.isError;

  const { activeMeters, staleMeters } = useMemo(() => {
    const active = [];
    const stale = [];
    for (const meter of meters) {
      if (isStaleMeter(meter)) {
        stale.push(meter);
      } else {
        active.push(meter);
      }
    }
    return { activeMeters: active, staleMeters: stale };
  }, [meters]);

  const lastRefresh = metersQuery.dataUpdatedAt
    ? new Date(metersQuery.dataUpdatedAt)
    : null;

  const handleBackup = () => {
    window.open(backupUrl(), "_blank");
  };

  const isLoading = metersQuery.isLoading || statusQuery.isLoading;

  return (
    <div className="app">
      <Navbar connected={connected} />
      <div className="container">
        <Controls
          timeScale={timeScale}
          onTimeScaleChange={setTimeScale}
          onRefresh={() => refreshMutation.mutate()}
          onBackup={handleBackup}
          refreshing={refreshMutation.isPending}
        />

        <StatusBar status={statusQuery.data} lastRefresh={lastRefresh} />
        <RateLimitWarning status={statusQuery.data} />

        {metersQuery.isError && (
          <div className="alert alert--danger">
            <span>
              <strong>Error.</strong> Failed to fetch meters.
            </span>
          </div>
        )}

        {isLoading ? (
          <div className="loading">
            <p>Loading temperature data...</p>
          </div>
        ) : meters.length === 0 ? (
          <div className="empty">
            <p>No meters available.</p>
          </div>
        ) : (
          <>
            <MeterGrid meters={activeMeters} timeScale={timeScale} />
            <StaleMetersSection meters={staleMeters} timeScale={timeScale} />
          </>
        )}

        <footer>
          Temp Master Dashboard v1.0 - Built with React + Vite + TypeScript
        </footer>
      </div>
    </div>
  );
}

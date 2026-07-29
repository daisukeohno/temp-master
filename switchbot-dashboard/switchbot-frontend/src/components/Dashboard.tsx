import { useMemo, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import type { TimeScale } from "../api/types";
import { refreshMeters } from "../api/client";
import { useMeters, useStatus } from "../api/queries";
import { isStaleMeter } from "../utils/meter";
import { Navbar } from "./Navbar";
import { Controls } from "./Controls";
import { StatusBar } from "./StatusBar";
import { MeterCard } from "./MeterCard";
import { StaleMetersSection } from "./StaleMetersSection";

export function Dashboard() {
  const queryClient = useQueryClient();
  const [timeScale, setTimeScale] = useState<TimeScale>("day");
  const [refreshing, setRefreshing] = useState(false);

  const metersQuery = useMeters();
  const statusQuery = useStatus();

  const meters = metersQuery.data?.meters ?? [];
  const connected = !metersQuery.isError && !statusQuery.isError;

  const { activeMeters, staleMeters } = useMemo(() => {
    const active = meters.filter((m) => !isStaleMeter(m));
    const stale = meters.filter((m) => isStaleMeter(m));
    return { activeMeters: active, staleMeters: stale };
  }, [meters]);

  const lastRefresh = metersQuery.dataUpdatedAt
    ? new Date(metersQuery.dataUpdatedAt)
    : null;

  async function handleRefresh() {
    setRefreshing(true);
    try {
      await refreshMeters();
    } catch {
      // Surfaced via connection status on the next poll.
    } finally {
      await queryClient.invalidateQueries();
      setRefreshing(false);
    }
  }

  return (
    <>
      <Navbar connected={connected} />
      <main className="container">
        <Controls
          timeScale={timeScale}
          onTimeScaleChange={setTimeScale}
          onRefresh={handleRefresh}
          refreshing={refreshing}
        />

        <StatusBar status={statusQuery.data} lastRefresh={lastRefresh} />

        {metersQuery.isError && (
          <div className="alert alert-danger">
            <strong>Error.</strong> Failed to fetch meters.
          </div>
        )}

        {metersQuery.isLoading ? (
          <div className="loading">
            <p>Loading temperature data...</p>
          </div>
        ) : (
          <>
            {activeMeters.length > 0 && (
              <div className="meter-grid">
                {activeMeters.map((meter) => (
                  <MeterCard
                    key={meter.device_id}
                    meter={meter}
                    timeScale={timeScale}
                  />
                ))}
              </div>
            )}
            <StaleMetersSection meters={staleMeters} timeScale={timeScale} />
          </>
        )}

        <footer className="footer">
          Temp Master Dashboard v2.0 - Built with React + Vite + TypeScript
        </footer>
      </main>
    </>
  );
}

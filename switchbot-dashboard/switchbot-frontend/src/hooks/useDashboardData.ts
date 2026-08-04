import { useCallback, useEffect, useRef, useState } from 'react';
import { fetchMeters, fetchStatus, type MeterDevice, type StatusResponse } from '../api';
import { REFRESH_INTERVAL_MS } from '../constants';

export interface DashboardData {
  meters: MeterDevice[];
  status: StatusResponse | null;
  lastRefresh: Date | null;
  loading: boolean;
  error: string | null;
  reload: () => Promise<void>;
}

export function useDashboardData(intervalMs: number = REFRESH_INTERVAL_MS): DashboardData {
  const [meters, setMeters] = useState<MeterDevice[]>([]);
  const [status, setStatus] = useState<StatusResponse | null>(null);
  const [lastRefresh, setLastRefresh] = useState<Date | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const mounted = useRef(true);

  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);

  const reload = useCallback(async () => {
    try {
      const [metersResponse, statusResponse] = await Promise.all([fetchMeters(), fetchStatus()]);
      if (!mounted.current) return;
      setMeters(metersResponse.meters ?? []);
      setStatus(statusResponse);
      setLastRefresh(new Date());
      setError(null);
    } catch (err) {
      if (!mounted.current) return;
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      if (mounted.current) {
        setLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    void reload();
    const timer = window.setInterval(() => {
      void reload();
    }, intervalMs);
    return () => window.clearInterval(timer);
  }, [reload, intervalMs]);

  return { meters, status, lastRefresh, loading, error, reload };
}

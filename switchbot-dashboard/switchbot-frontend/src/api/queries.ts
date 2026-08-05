import { useQueries, useQuery } from '@tanstack/react-query';
import { fetchHistory, fetchMeters, fetchStatus } from './client';
import type { Meter, TimeScale } from './types';

export const REFRESH_INTERVAL = 30000;

export function useMeters() {
  return useQuery({
    queryKey: ['meters'],
    queryFn: fetchMeters,
    refetchInterval: REFRESH_INTERVAL,
  });
}

export function useStatus() {
  return useQuery({
    queryKey: ['status'],
    queryFn: fetchStatus,
    refetchInterval: REFRESH_INTERVAL,
  });
}

export function useHistories(meters: Meter[], timeScale: TimeScale) {
  return useQueries({
    queries: meters.map((meter) => ({
      queryKey: ['history', meter.device_id, timeScale],
      queryFn: () => fetchHistory(meter.device_id, timeScale),
      refetchInterval: REFRESH_INTERVAL,
    })),
  });
}

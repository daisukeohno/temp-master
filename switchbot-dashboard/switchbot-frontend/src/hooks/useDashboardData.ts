import { useMutation, useQueries, useQuery, useQueryClient } from '@tanstack/react-query';
import { getMeterHistory, getMeters, getStatus, refreshMeters } from '../api/meters';
import type { MeterReading, TimeScale } from '../api/types';

export const REFETCH_INTERVAL_MS = 30_000;

export function useMeters() {
  return useQuery({
    queryKey: ['meters'],
    queryFn: getMeters,
    refetchInterval: REFETCH_INTERVAL_MS,
  });
}

export function useStatus() {
  return useQuery({
    queryKey: ['status'],
    queryFn: getStatus,
    refetchInterval: REFETCH_INTERVAL_MS,
  });
}

/** Fetches history for every active meter in parallel. */
export function useMeterHistories(deviceIds: string[], timeScale: TimeScale) {
  return useQueries({
    queries: deviceIds.map((deviceId) => ({
      queryKey: ['history', deviceId, timeScale],
      queryFn: () => getMeterHistory(deviceId, timeScale),
      refetchInterval: REFETCH_INTERVAL_MS,
    })),
    combine: (results) => {
      const byDevice: Record<string, MeterReading[]> = {};
      results.forEach((result, index) => {
        byDevice[deviceIds[index]] = result.data?.history ?? [];
      });
      return {
        byDevice,
        isLoading: results.some((result) => result.isLoading),
      };
    },
  });
}

export function useRefreshMeters() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: refreshMeters,
    onSettled: () => {
      void queryClient.invalidateQueries({ queryKey: ['meters'] });
      void queryClient.invalidateQueries({ queryKey: ['status'] });
      void queryClient.invalidateQueries({ queryKey: ['history'] });
    },
  });
}

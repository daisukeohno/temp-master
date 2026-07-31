import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  fetchHistory,
  fetchMeters,
  fetchStatus,
  triggerRefresh,
  type TimeScale,
} from './client';
import { REFRESH_INTERVAL } from '../constants';

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

export function useHistory(deviceId: string, timeScale: TimeScale, enabled: boolean) {
  return useQuery({
    queryKey: ['history', deviceId, timeScale],
    queryFn: () => fetchHistory(deviceId, timeScale),
    refetchInterval: REFRESH_INTERVAL,
    enabled,
  });
}

export function useRefresh() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: triggerRefresh,
    onSettled: () => {
      void queryClient.invalidateQueries();
    },
  });
}

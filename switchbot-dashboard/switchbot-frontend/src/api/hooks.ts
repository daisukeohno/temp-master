import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import {
  fetchHistory,
  fetchMeters,
  fetchStatus,
  triggerRefresh,
} from "./client";
import type { TimeScale } from "./types";

export const REFRESH_INTERVAL_MS = 30000;

export function useMeters() {
  return useQuery({
    queryKey: ["meters"],
    queryFn: fetchMeters,
    refetchInterval: REFRESH_INTERVAL_MS,
  });
}

export function useStatus() {
  return useQuery({
    queryKey: ["status"],
    queryFn: fetchStatus,
    refetchInterval: REFRESH_INTERVAL_MS,
  });
}

export function useHistory(
  deviceId: string,
  timeScale: TimeScale,
  enabled: boolean,
) {
  return useQuery({
    queryKey: ["history", deviceId, timeScale],
    queryFn: () => fetchHistory(deviceId, timeScale),
    enabled,
    refetchInterval: REFRESH_INTERVAL_MS,
  });
}

export function useRefreshMeters() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: triggerRefresh,
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["meters"] });
      queryClient.invalidateQueries({ queryKey: ["status"] });
      queryClient.invalidateQueries({ queryKey: ["history"] });
    },
  });
}

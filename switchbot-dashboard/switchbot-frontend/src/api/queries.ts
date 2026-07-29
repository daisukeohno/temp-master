import { useQuery } from "@tanstack/react-query";
import { getMeterHistory, getMeters, getStatus } from "./client";
import type { TimeScale } from "./types";

const POLL_INTERVAL = 30000;

export function useMeters() {
  return useQuery({
    queryKey: ["meters"],
    queryFn: getMeters,
    refetchInterval: POLL_INTERVAL,
  });
}

export function useStatus() {
  return useQuery({
    queryKey: ["status"],
    queryFn: getStatus,
    refetchInterval: POLL_INTERVAL,
  });
}

export function useMeterHistory(
  deviceId: string,
  timeScale: TimeScale,
  enabled: boolean,
) {
  return useQuery({
    queryKey: ["history", deviceId, timeScale],
    queryFn: () => getMeterHistory(deviceId, timeScale),
    enabled,
    refetchInterval: POLL_INTERVAL,
  });
}

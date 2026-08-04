import { useEffect, useState } from 'react';
import { fetchHistory, type MeterReading, type TimeScale } from '../api';

export type HistoryMap = Record<string, MeterReading[]>;

/** Fetches temperature history for every given device whenever the time scale changes. */
export function useHistories(deviceIds: string[], timeScale: TimeScale, revision: number) {
  const [histories, setHistories] = useState<HistoryMap>({});
  const key = deviceIds.join(',');

  useEffect(() => {
    let cancelled = false;
    const ids = key ? key.split(',') : [];

    async function load() {
      const entries = await Promise.all(
        ids.map(async (deviceId): Promise<[string, MeterReading[]]> => {
          try {
            const response = await fetchHistory(deviceId, timeScale);
            return [deviceId, response.history ?? []];
          } catch {
            return [deviceId, []];
          }
        }),
      );
      if (!cancelled) {
        setHistories(Object.fromEntries(entries));
      }
    }

    void load();
    return () => {
      cancelled = true;
    };
  }, [key, timeScale, revision]);

  return histories;
}

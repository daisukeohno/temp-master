import type { Meter } from '../api/types';

export const STALE_METER_THRESHOLD_MS = 7 * 24 * 60 * 60 * 1000;

/** A meter is stale when it has never reported, or has not reported for 7+ days. */
export function isStaleMeter(
  meter: Pick<Meter, 'last_updated'>,
  now: number = Date.now(),
): boolean {
  if (!meter.last_updated) {
    return true;
  }

  const lastUpdated = new Date(meter.last_updated);
  if (Number.isNaN(lastUpdated.getTime())) {
    return true;
  }

  return now - lastUpdated.getTime() >= STALE_METER_THRESHOLD_MS;
}

export function partitionMeters<T extends Pick<Meter, 'last_updated'>>(
  meters: T[],
): { active: T[]; stale: T[] } {
  const active: T[] = [];
  const stale: T[] = [];
  for (const meter of meters) {
    if (isStaleMeter(meter)) {
      stale.push(meter);
    } else {
      active.push(meter);
    }
  }
  return { active, stale };
}

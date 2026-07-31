import type { Meter, TimeScale } from '../api/client';
import { MeterGrid } from './MeterGrid';

interface StaleMetersSectionProps {
  meters: Meter[];
  timeScale: TimeScale;
}

export function StaleMetersSection({ meters, timeScale }: StaleMetersSectionProps) {
  if (meters.length === 0) {
    return null;
  }

  return (
    <section className="mt-6">
      <h3 className="text-lg font-semibold text-warning">⚠ 未更新のメーター</h3>
      <p className="mb-2 text-xs text-warning">
        1週間以上更新されていないデバイス
      </p>
      <div className="rounded-lg border border-warning bg-warning-bg p-4">
        <MeterGrid meters={meters} timeScale={timeScale} isStale />
      </div>
    </section>
  );
}

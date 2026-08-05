import type { Meter, TimeScale } from '../api/types';
import { MeterGrid } from './MeterGrid';
import { MeterPanel } from './MeterPanel';

interface StaleMetersSectionProps {
  meters: Meter[];
  timeScale: TimeScale;
}

export function StaleMetersSection({ meters, timeScale }: StaleMetersSectionProps) {
  return (
    <section className="mb-5 mt-6">
      <div className="mb-2">
        <h3 className="m-0 text-lg font-semibold text-warning">⚠ 未更新のメーター</h3>
        <p className="mt-1 text-xs text-warning">1週間以上更新されていないデバイス</p>
      </div>
      <div className="rounded border border-warning bg-surface-alt p-4">
        <MeterGrid>
          {meters.map((meter) => (
            <MeterPanel
              key={meter.device_id}
              meter={meter}
              history={[]}
              timeScale={timeScale}
              stale
            />
          ))}
        </MeterGrid>
      </div>
    </section>
  );
}

import { MeterCard } from './MeterCard';
import type { MeterDevice, TimeScale } from '../types';

interface StaleMetersSectionProps {
  meters: MeterDevice[];
  timeScale: TimeScale;
}

export function StaleMetersSection({ meters, timeScale }: StaleMetersSectionProps) {
  if (meters.length === 0) {
    return null;
  }

  return (
    <section className="mb-6">
      <div className="mb-2">
        <h2 className="text-lg font-semibold text-warning">⚠ 未更新のメーター</h2>
        <p className="mt-1 text-xs text-warning">1週間以上更新されていないデバイス</p>
      </div>
      <div className="panel border-warning/70 bg-warning/10 p-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {meters.map((meter) => (
            <MeterCard
              key={meter.device_id}
              meter={meter}
              history={[]}
              timeScale={timeScale}
              isStale
            />
          ))}
        </div>
      </div>
    </section>
  );
}

import type { Meter, MeterReading, TimeScale } from '../api/types';
import { MeterCard } from './MeterCard';

interface MeterGridProps {
  meters: Meter[];
  historyByDevice: Record<string, MeterReading[]>;
  timeScale: TimeScale;
}

export function MeterGrid({ meters, historyByDevice, timeScale }: MeterGridProps) {
  if (meters.length === 0) {
    return null;
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {meters.map((meter) => (
        <MeterCard
          key={meter.device_id}
          meter={meter}
          history={historyByDevice[meter.device_id] ?? []}
          timeScale={timeScale}
        />
      ))}
    </div>
  );
}

export function StaleMeterSection({ meters, timeScale }: Omit<MeterGridProps, 'historyByDevice'>) {
  if (meters.length === 0) {
    return null;
  }

  return (
    <section className="space-y-3">
      <div>
        <h2 className="text-lg font-semibold" style={{ color: 'var(--color-warning)' }}>
          未更新のメーター
        </h2>
        <p className="text-xs text-text-muted">1週間以上更新されていないデバイス</p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
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
    </section>
  );
}

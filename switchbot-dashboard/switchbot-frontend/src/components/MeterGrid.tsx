import type { MeterDevice, TimeScale } from '../api';
import type { HistoryMap } from '../hooks/useHistories';
import { MeterCard } from './MeterCard';

export interface MeterGridProps {
  meters: MeterDevice[];
  histories: HistoryMap;
  timeScale: TimeScale;
  stale?: boolean;
}

export function MeterGrid({ meters, histories, timeScale, stale = false }: MeterGridProps) {
  if (meters.length === 0) {
    return null;
  }

  return (
    <div className="meter-grid">
      {meters.map((meter) => (
        <MeterCard
          key={meter.device_id}
          meter={meter}
          history={histories[meter.device_id] ?? []}
          timeScale={timeScale}
          stale={stale}
        />
      ))}
    </div>
  );
}

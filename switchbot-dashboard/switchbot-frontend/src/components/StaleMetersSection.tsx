import type { MeterDevice, TimeScale } from "../api/types";
import { MeterPanel } from "./MeterPanel";

interface StaleMetersSectionProps {
  meters: MeterDevice[];
  timeScale: TimeScale;
}

export function StaleMetersSection({ meters, timeScale }: StaleMetersSectionProps) {
  if (meters.length === 0) {
    return null;
  }

  return (
    <section className="meter-section">
      <div className="meter-section__header">
        <h3 className="meter-section__title">&#9888; 未更新のメーター</h3>
        <p className="meter-section__subtitle">1週間以上更新されていないデバイス</p>
      </div>
      <div className="panel stale-meters-panel">
        <div className="panel__body">
          <div className="meter-grid">
            {meters.map((meter) => (
              <MeterPanel
                key={meter.device_id}
                meter={meter}
                timeScale={timeScale}
                isStale
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

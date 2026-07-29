import type { Meter, TimeScale } from "../api/types";
import { MeterCard } from "./MeterCard";

interface StaleMetersSectionProps {
  meters: Meter[];
  timeScale: TimeScale;
}

export function StaleMetersSection({
  meters,
  timeScale,
}: StaleMetersSectionProps) {
  if (meters.length === 0) return null;

  return (
    <section className="meter-section">
      <div className="meter-section-header">
        <h3 className="meter-section-title">
          <span aria-hidden="true">&#9888;</span> 未更新のメーター
        </h3>
        <p className="meter-section-subtitle">
          1週間以上更新されていないデバイス
        </p>
      </div>
      <div className="stale-panel">
        <div className="meter-grid">
          {meters.map((meter) => (
            <MeterCard
              key={meter.device_id}
              meter={meter}
              timeScale={timeScale}
              stale
            />
          ))}
        </div>
      </div>
    </section>
  );
}

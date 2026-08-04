import type { MeterDevice, TimeScale } from '../api';
import { MeterGrid } from './MeterGrid';

export interface StaleMetersSectionProps {
  meters: MeterDevice[];
  timeScale: TimeScale;
}

export function StaleMetersSection({ meters, timeScale }: StaleMetersSectionProps) {
  if (meters.length === 0) {
    return null;
  }

  return (
    <section className="section section--stale">
      <h3 className="section__title">未更新のメーター</h3>
      <p className="section__subtitle">1週間以上更新されていないデバイス</p>
      <div className="card">
        <div className="card__body">
          <MeterGrid meters={meters} histories={{}} timeScale={timeScale} stale />
        </div>
      </div>
    </section>
  );
}

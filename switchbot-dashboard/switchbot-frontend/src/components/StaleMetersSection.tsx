import { MeterCard } from './MeterCard'
import type { Meter, TimeScale } from '../types'

interface StaleMetersSectionProps {
  meters: Meter[]
  timeScale: TimeScale
}

export function StaleMetersSection({ meters, timeScale }: StaleMetersSectionProps) {
  if (meters.length === 0) {
    return null
  }

  return (
    <section className="meter-section">
      <h3 className="meter-section-title">⚠ 未更新のメーター</h3>
      <p className="meter-section-subtitle">1週間以上更新されていないデバイス</p>
      <div className="panel stale-meters-panel">
        <div className="panel-body">
          <div className="meter-grid">
            {meters.map((meter) => (
              <MeterCard
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
  )
}

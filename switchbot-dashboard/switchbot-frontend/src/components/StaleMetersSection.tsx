import type { Meter, TimeScale } from '../api/types'
import { MeterGrid } from './MeterGrid'

interface Props {
  meters: Meter[]
  timeScale: TimeScale
}

export function StaleMetersSection({ meters, timeScale }: Props) {
  if (meters.length === 0) {
    return null
  }

  return (
    <section className="meter-section">
      <h3 className="meter-section-title">⚠ 未更新のメーター</h3>
      <p className="meter-section-subtitle">1週間以上更新されていないデバイス</p>
      <div className="panel stale-panel">
        <div className="panel-body">
          <MeterGrid meters={meters} timeScale={timeScale} isStale />
        </div>
      </div>
    </section>
  )
}

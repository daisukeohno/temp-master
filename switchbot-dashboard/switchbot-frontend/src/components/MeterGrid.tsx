import type { Meter, TimeScale } from '../api/types'
import { MeterCard } from './MeterCard'

interface Props {
  meters: Meter[]
  timeScale: TimeScale
  isStale?: boolean
}

export function MeterGrid({ meters, timeScale, isStale = false }: Props) {
  if (meters.length === 0) {
    return null
  }

  return (
    <div className="meter-grid">
      {meters.map((meter) => (
        <MeterCard
          key={meter.device_id}
          meter={meter}
          timeScale={timeScale}
          isStale={isStale}
        />
      ))}
    </div>
  )
}

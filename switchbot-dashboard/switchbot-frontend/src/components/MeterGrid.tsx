import type { MeterDevice, TimeScale } from '../types'
import { isStaleMeter } from '../utils/meter'
import MeterCard from './MeterCard'

interface MeterGridProps {
  meters: MeterDevice[]
  timeScale: TimeScale
}

export default function MeterGrid({ meters, timeScale }: MeterGridProps) {
  const activeMeters = meters.filter((meter) => !isStaleMeter(meter))
  const staleMeters = meters.filter((meter) => isStaleMeter(meter))

  return (
    <>
      {activeMeters.length > 0 && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {activeMeters.map((meter) => (
            <MeterCard
              key={meter.device_id}
              meter={meter}
              timeScale={timeScale}
              stale={false}
            />
          ))}
        </div>
      )}

      {staleMeters.length > 0 && (
        <section className="mt-6">
          <h3 className="m-0 text-lg font-semibold" style={{ color: 'var(--color-warning)' }}>
            未更新のメーター
          </h3>
          <p className="mb-3 mt-1 text-xs" style={{ color: 'var(--color-warning)' }}>
            1週間以上更新されていないデバイス
          </p>
          <div
            className="rounded border p-4"
            style={{ borderColor: 'var(--color-warning)' }}
          >
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {staleMeters.map((meter) => (
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
      )}
    </>
  )
}

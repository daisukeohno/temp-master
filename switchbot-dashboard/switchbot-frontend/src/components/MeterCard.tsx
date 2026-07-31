import { getDisplayName } from '../constants'
import type { MeterDevice, TimeScale } from '../types'
import TemperatureChart from './TemperatureChart'

interface MeterCardProps {
  meter: MeterDevice
  timeScale: TimeScale
  stale: boolean
}

function Badge({ color, children }: { color: string; children: string }) {
  return (
    <span
      className="rounded px-2 py-1 text-xs font-semibold text-white"
      style={{ backgroundColor: color }}
    >
      {children}
    </span>
  )
}

export default function MeterCard({ meter, timeScale, stale }: MeterCardProps) {
  return (
    <div className="flex h-full flex-col rounded border border-border bg-surface">
      <div className="flex flex-wrap items-center gap-2 border-b border-border px-4 py-3">
        <strong>{getDisplayName(meter.device_name)}</strong>
        {stale && <Badge color="var(--color-warning)">7日以上未更新</Badge>}
        <span className="ml-auto rounded-full border border-border px-2 py-0.5 text-[11px] text-muted">
          {meter.device_type}
        </span>
      </div>

      <div className="flex flex-1 flex-col gap-3 px-4 py-3">
        <div className="flex flex-wrap gap-2">
          {meter.current_temperature !== null && (
            <Badge color="var(--color-danger)">{`${meter.current_temperature}\u00b0C`}</Badge>
          )}
          {meter.current_humidity !== null && (
            <Badge color="var(--color-accent)">{`${meter.current_humidity}%`}</Badge>
          )}
          {meter.battery !== null && (
            <Badge color="var(--color-success)">{`${meter.battery}%`}</Badge>
          )}
        </div>

        {stale ? (
          <p className="m-0 text-sm text-muted">履歴データの取得対象外</p>
        ) : (
          <TemperatureChart deviceId={meter.device_id} timeScale={timeScale} />
        )}

        {meter.last_updated ? (
          <p className="m-0 mt-auto text-xs text-muted">
            {`Last updated: ${new Date(meter.last_updated).toLocaleString()}`}
          </p>
        ) : (
          stale && <p className="m-0 text-sm text-muted">値がありません（データ未受信）</p>
        )}
      </div>
    </div>
  )
}

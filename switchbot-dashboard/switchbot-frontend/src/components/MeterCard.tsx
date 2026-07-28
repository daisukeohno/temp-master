import type { Meter, TimeScale } from '../api/types'
import { getDisplayName } from '../constants/displayNames'
import { TemperatureChart } from './TemperatureChart'

interface Props {
  meter: Meter
  timeScale: TimeScale
  isStale: boolean
}

export function MeterCard({ meter, timeScale, isStale }: Props) {
  const hasValue = (value: number | null | undefined): value is number =>
    value !== null && value !== undefined

  return (
    <div className="panel">
      <div className="panel-heading">
        <div className="meter-card-header">
          <div className="meter-card-title">
            <strong>{getDisplayName(meter.device_name)}</strong>
            {isStale && <span className="badge-stale">7日以上未更新</span>}
          </div>
          <span className="device-type-tag">{meter.device_type}</span>
        </div>
      </div>
      <div className="panel-body">
        <div className="meter-stats">
          {hasValue(meter.current_temperature) && (
            <span className="stat stat-temperature">{`${meter.current_temperature}°C`}</span>
          )}
          {hasValue(meter.current_humidity) && (
            <span className="stat stat-humidity">{`${meter.current_humidity}%`}</span>
          )}
          {hasValue(meter.battery) && (
            <span className="stat stat-battery">{`${meter.battery}%`}</span>
          )}
        </div>

        {isStale ? (
          <p className="stale-meter-empty">履歴データの取得対象外</p>
        ) : (
          <TemperatureChart deviceId={meter.device_id} timeScale={timeScale} />
        )}

        {meter.last_updated ? (
          <p className="meter-last-updated">
            {`Last updated: ${new Date(meter.last_updated).toLocaleString()}`}
          </p>
        ) : (
          isStale && <p className="stale-meter-empty">値がありません（データ未受信）</p>
        )}
      </div>
    </div>
  )
}

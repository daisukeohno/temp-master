import { getDisplayName } from '../constants'
import { TemperatureChart } from './TemperatureChart'
import type { Meter, TimeScale } from '../types'

interface MeterCardProps {
  meter: Meter
  timeScale: TimeScale
  isStale: boolean
}

export function MeterCard({ meter, timeScale, isStale }: MeterCardProps) {
  return (
    <div className="panel">
      <div className="panel-heading">
        <div className="meter-panel-header">
          <div className="meter-panel-title">
            <strong>{getDisplayName(meter.device_name)}</strong>
            {isStale && <span className="badge badge-warning">7日以上未更新</span>}
          </div>
          <span className="device-type-tag">{meter.device_type}</span>
        </div>
      </div>
      <div className="panel-body">
        <div className="meter-stats">
          {meter.current_temperature != null && (
            <span className="badge badge-temperature">{meter.current_temperature}°C</span>
          )}
          {meter.current_humidity != null && (
            <span className="badge badge-humidity">{meter.current_humidity}%</span>
          )}
          {meter.battery != null && (
            <span className="badge badge-battery">{meter.battery}%</span>
          )}
        </div>

        {isStale ? (
          <p className="stale-meter-note">履歴データの取得対象外</p>
        ) : (
          <TemperatureChart deviceId={meter.device_id} timeScale={timeScale} />
        )}

        {meter.last_updated ? (
          <p className="meter-last-updated">
            {`Last updated: ${new Date(meter.last_updated).toLocaleString()}`}
          </p>
        ) : (
          isStale && <p className="stale-meter-note">値がありません（データ未受信）</p>
        )}
      </div>
    </div>
  )
}

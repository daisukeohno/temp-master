import { getDisplayName } from '../displayNames'
import type { Meter, TimeScale } from '../types'
import { MeterChart } from './MeterChart'

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
            {isStale && (
              <span className="label label-warning">7日以上未更新</span>
            )}
          </div>
          <span className="device-type-tag">{meter.device_type}</span>
        </div>
      </div>
      <div className="panel-body">
        <div className="meter-stats">
          {meter.current_temperature !== null &&
            meter.current_temperature !== undefined && (
              <span className="label label-danger">
                {meter.current_temperature}&deg;C
              </span>
            )}
          {meter.current_humidity !== null &&
            meter.current_humidity !== undefined && (
              <span className="label label-info">{meter.current_humidity}%</span>
            )}
          {meter.battery !== null && meter.battery !== undefined && (
            <span className="label label-success">{meter.battery}%</span>
          )}
        </div>

        {isStale ? (
          <p className="stale-meter-empty">履歴データの取得対象外</p>
        ) : (
          <MeterChart deviceId={meter.device_id} timeScale={timeScale} />
        )}

        {meter.last_updated ? (
          <p className="meter-last-updated">
            Last updated: {new Date(meter.last_updated).toLocaleString()}
          </p>
        ) : (
          isStale && (
            <p className="stale-meter-empty">値がありません（データ未受信）</p>
          )
        )}
      </div>
    </div>
  )
}

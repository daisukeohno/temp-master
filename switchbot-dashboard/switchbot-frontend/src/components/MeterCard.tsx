import type { MeterDevice, MeterReading, TimeScale } from '../api';
import { getDisplayName } from '../utils/meters';
import { TemperatureChart } from './TemperatureChart';

export interface MeterCardProps {
  meter: MeterDevice;
  history: MeterReading[];
  timeScale: TimeScale;
  stale?: boolean;
}

export function MeterCard({ meter, history, timeScale, stale = false }: MeterCardProps) {
  return (
    <div className="card">
      <div className="card__header">
        <div className="meter-card__title">
          <span>{getDisplayName(meter.device_name)}</span>
          {stale && <span className="badge badge--warning">7日以上未更新</span>}
        </div>
        <span className="meter-card__type">{meter.device_type}</span>
      </div>
      <div className="card__body">
        <div className="meter-card__stats">
          {meter.current_temperature != null && (
            <span className="badge badge--temperature">{`${meter.current_temperature}\u00b0C`}</span>
          )}
          {meter.current_humidity != null && (
            <span className="badge badge--humidity">{`${meter.current_humidity}%`}</span>
          )}
          {meter.battery != null && (
            <span className="badge badge--battery">{`${meter.battery}%`}</span>
          )}
        </div>

        {stale ? (
          <p className="meter-card__footnote">履歴データの取得対象外</p>
        ) : (
          <div className="meter-card__chart">
            <TemperatureChart history={history} timeScale={timeScale} />
          </div>
        )}

        {meter.last_updated ? (
          <p className="meter-card__footnote">
            {`Last updated: ${new Date(meter.last_updated).toLocaleString()}`}
          </p>
        ) : (
          stale && <p className="meter-card__footnote">値がありません（データ未受信）</p>
        )}
      </div>
    </div>
  );
}

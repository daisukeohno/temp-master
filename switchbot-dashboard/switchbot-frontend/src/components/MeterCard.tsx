import type { Meter, TimeScale } from "../api/types";
import { getDisplayName } from "../constants/displayNames";
import { useMeterHistory } from "../api/queries";
import { MeterChart } from "./MeterChart";

interface MeterCardProps {
  meter: Meter;
  timeScale: TimeScale;
  stale?: boolean;
}

export function MeterCard({ meter, timeScale, stale = false }: MeterCardProps) {
  const historyQuery = useMeterHistory(meter.device_id, timeScale, !stale);
  const history = historyQuery.data?.history ?? [];

  return (
    <div className="card">
      <div className="card-header">
        <div className="card-title">
          <strong>{getDisplayName(meter.device_name)}</strong>
          {stale && <span className="badge badge-warning">7日以上未更新</span>}
        </div>
        <span className="device-type-tag">{meter.device_type}</span>
      </div>
      <div className="card-body">
        <div className="meter-stats">
          {meter.current_temperature != null && (
            <span className="stat stat-danger">
              {meter.current_temperature}&#176;C
            </span>
          )}
          {meter.current_humidity != null && (
            <span className="stat stat-info">{meter.current_humidity}%</span>
          )}
          {meter.battery != null && (
            <span className="stat stat-success">{meter.battery}%</span>
          )}
        </div>

        {stale ? (
          <p className="stale-meter-note">履歴データの取得対象外</p>
        ) : (
          <div className="meter-chart-wrap">
            {historyQuery.isLoading ? (
              <p className="chart-placeholder">Loading chart...</p>
            ) : history.length === 0 ? (
              <p className="chart-placeholder">No history data</p>
            ) : (
              <MeterChart history={history} timeScale={timeScale} />
            )}
          </div>
        )}

        {meter.last_updated ? (
          <p className="meter-last-updated">
            Last updated: {new Date(meter.last_updated).toLocaleString()}
          </p>
        ) : (
          stale && (
            <p className="stale-meter-note">値がありません（データ未受信）</p>
          )
        )}
      </div>
    </div>
  );
}

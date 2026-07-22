import type { MeterDevice, TimeScale } from "../api/types";
import { useHistory } from "../api/hooks";
import { getDisplayName } from "../utils/displayNames";
import { MeterChart } from "./MeterChart";

interface MeterPanelProps {
  meter: MeterDevice;
  timeScale: TimeScale;
  isStale: boolean;
}

export function MeterPanel({ meter, timeScale, isStale }: MeterPanelProps) {
  const displayName = getDisplayName(meter.device_name);

  return (
    <div className="panel">
      <div className="panel__heading">
        <div className="meter-panel__header">
          <div className="meter-panel__title">
            <span>{displayName}</span>
            {isStale && <span className="stale-meter-badge">7日以上未更新</span>}
          </div>
          <span className="device-type-tag">{meter.device_type}</span>
        </div>
      </div>
      <div className="panel__body">
        <div className="meter-stats">
          {meter.current_temperature != null && (
            <span className="stat-label stat-label--temp">
              {meter.current_temperature}&#176;C
            </span>
          )}
          {meter.current_humidity != null && (
            <span className="stat-label stat-label--humidity">
              {meter.current_humidity}%
            </span>
          )}
          {meter.battery != null && (
            <span className="stat-label stat-label--battery">{meter.battery}%</span>
          )}
        </div>

        {isStale ? (
          <p className="stale-meter-empty">履歴データの取得対象外</p>
        ) : (
          <MeterChartLoader deviceId={meter.device_id} timeScale={timeScale} />
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
  );
}

function MeterChartLoader({
  deviceId,
  timeScale,
}: {
  deviceId: string;
  timeScale: TimeScale;
}) {
  const { data } = useHistory(deviceId, timeScale, true);
  return <MeterChart history={data?.history ?? []} timeScale={timeScale} />;
}

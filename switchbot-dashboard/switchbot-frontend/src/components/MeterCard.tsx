import { getDisplayName } from '../lib/displayNames';
import { TemperatureChart } from './TemperatureChart';
import type { HistoryPoint, MeterDevice, TimeScale } from '../types';

interface MeterCardProps {
  meter: MeterDevice;
  history: HistoryPoint[];
  timeScale: TimeScale;
  isStale: boolean;
}

export function MeterCard({ meter, history, timeScale, isStale }: MeterCardProps) {
  return (
    <div className="panel flex h-full flex-col">
      <div className="flex items-center justify-between gap-2 border-b border-border bg-surface-muted px-4 py-2">
        <div className="flex flex-wrap items-center gap-2">
          <strong className="text-sm">{getDisplayName(meter.device_name)}</strong>
          {isStale && <span className="badge bg-warning text-black">7日以上未更新</span>}
        </div>
        <span className="rounded-full bg-surface px-2 py-0.5 text-[11px] text-muted">
          {meter.device_type}
        </span>
      </div>
      <div className="flex flex-1 flex-col p-4">
        <div className="mb-3 flex flex-wrap gap-2">
          {meter.current_temperature != null && (
            <span className="badge bg-temperature text-white">{meter.current_temperature}&deg;C</span>
          )}
          {meter.current_humidity != null && (
            <span className="badge bg-humidity text-black">{meter.current_humidity}%</span>
          )}
          {meter.battery != null && (
            <span className="badge bg-battery text-black">{meter.battery}%</span>
          )}
        </div>

        {isStale ? (
          <p className="text-sm text-warning">履歴データの取得対象外</p>
        ) : (
          <TemperatureChart history={history} timeScale={timeScale} />
        )}

        {meter.last_updated ? (
          <p className="mt-2 text-xs text-muted">
            Last updated: {new Date(meter.last_updated).toLocaleString()}
          </p>
        ) : (
          isStale && <p className="mt-2 text-sm text-warning">値がありません（データ未受信）</p>
        )}
      </div>
    </div>
  );
}

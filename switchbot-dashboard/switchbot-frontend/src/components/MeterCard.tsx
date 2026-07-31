import type { Meter, TimeScale } from '../api/client';
import { getDisplayName } from '../constants';
import { TemperatureChart } from './TemperatureChart';

interface MeterCardProps {
  meter: Meter;
  timeScale: TimeScale;
  isStale?: boolean;
}

export function MeterCard({ meter, timeScale, isStale = false }: MeterCardProps) {
  return (
    <div className="overflow-hidden rounded-lg border border-border bg-panel">
      <div className="flex items-center justify-between gap-2 border-b border-border bg-panel-header px-3 py-2">
        <div className="flex flex-wrap items-center gap-2">
          <strong className="text-sm">{getDisplayName(meter.device_name)}</strong>
          {isStale && (
            <span className="rounded bg-warning px-2 py-0.5 text-[11px] font-semibold text-panel">
              7日以上未更新
            </span>
          )}
        </div>
        <span className="rounded-full bg-panel px-2 py-0.5 text-[11px] text-muted">
          {meter.device_type}
        </span>
      </div>

      <div className="p-3">
        <div className="mb-2 flex flex-wrap gap-2 text-xs font-semibold text-white">
          {meter.current_temperature != null && (
            <span className="rounded bg-temp px-2 py-1">{`${meter.current_temperature}°C`}</span>
          )}
          {meter.current_humidity != null && (
            <span className="rounded bg-humidity px-2 py-1">{`${meter.current_humidity}%`}</span>
          )}
          {meter.battery != null && (
            <span className="rounded bg-battery px-2 py-1">{`${meter.battery}%`}</span>
          )}
        </div>

        {isStale ? (
          <p className="text-xs text-warning">履歴データの取得対象外</p>
        ) : (
          <TemperatureChart deviceId={meter.device_id} timeScale={timeScale} />
        )}

        {meter.last_updated ? (
          <p className="mt-2 text-[12px] text-muted">
            {`Last updated: ${new Date(meter.last_updated).toLocaleString()}`}
          </p>
        ) : (
          isStale && (
            <p className="mt-2 text-xs text-warning">
              値がありません（データ未受信）
            </p>
          )
        )}
      </div>
    </div>
  );
}

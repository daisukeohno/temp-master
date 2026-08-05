import type { Meter, MeterReading, TimeScale } from '../api/types';
import { getDisplayName } from '../constants';
import { TemperatureChart } from './TemperatureChart';

interface MeterPanelProps {
  meter: Meter;
  history: MeterReading[];
  timeScale: TimeScale;
  stale?: boolean;
}

function Badge({ className, children }: { className: string; children: string }) {
  return (
    <span className={`rounded px-2 py-1 text-sm font-semibold text-white ${className}`}>
      {children}
    </span>
  );
}

export function MeterPanel({ meter, history, timeScale, stale = false }: MeterPanelProps) {
  return (
    <div className="rounded border border-border bg-surface">
      <div className="flex items-center justify-between gap-2 border-b border-border bg-surface-alt px-3 py-2">
        <div className="flex flex-wrap items-center gap-2">
          <strong className="text-text">{getDisplayName(meter.device_name)}</strong>
          {stale && (
            <span className="rounded bg-warning px-2 py-0.5 text-xs font-semibold text-black">
              7日以上未更新
            </span>
          )}
        </div>
        <span className="rounded-full bg-surface px-2 py-0.5 text-[11px] text-muted">
          {meter.device_type}
        </span>
      </div>
      <div className="p-3">
        <div className="mb-2 flex flex-wrap gap-1.5">
          {meter.current_temperature !== null && meter.current_temperature !== undefined && (
            <Badge className="bg-danger">{`${meter.current_temperature}\u00b0C`}</Badge>
          )}
          {meter.current_humidity !== null && meter.current_humidity !== undefined && (
            <Badge className="bg-info">{`${meter.current_humidity}%`}</Badge>
          )}
          {meter.battery !== null && meter.battery !== undefined && (
            <Badge className="bg-success">{`${meter.battery}%`}</Badge>
          )}
        </div>

        {stale ? (
          <p className="m-0 text-sm text-warning">履歴データの取得対象外</p>
        ) : (
          <TemperatureChart history={history} timeScale={timeScale} />
        )}

        {meter.last_updated ? (
          <p className="mb-0 mt-2 text-xs text-muted">
            {`Last updated: ${new Date(meter.last_updated).toLocaleString()}`}
          </p>
        ) : (
          stale && <p className="m-0 text-sm text-warning">値がありません（データ未受信）</p>
        )}
      </div>
    </div>
  );
}

import MeterChart from './MeterChart';
import { getDisplayName } from '../lib/displayNames';
import type { Meter, TimeScale } from '../types';

interface MeterCardProps {
  meter: Meter;
  timeScale: TimeScale;
  isStale?: boolean;
}

function Badge({ className, children }: { className: string; children: React.ReactNode }) {
  return (
    <span className={`rounded px-2 py-1 text-xs font-semibold text-white ${className}`}>
      {children}
    </span>
  );
}

export default function MeterCard({ meter, timeScale, isStale = false }: MeterCardProps) {
  return (
    <div className="overflow-hidden rounded border border-border bg-panel">
      <div className="flex items-center justify-between gap-2 border-b border-border bg-panel-header px-4 py-2">
        <div className="flex flex-wrap items-center gap-2">
          <strong className="text-text">{getDisplayName(meter.device_name)}</strong>
          {isStale && (
            <span className="rounded bg-warning px-2 py-0.5 text-xs font-semibold text-white">
              7日以上未更新
            </span>
          )}
        </div>
        <span className="rounded-full bg-panel px-2 py-0.5 text-[11px] text-muted">
          {meter.device_type}
        </span>
      </div>
      <div className="p-4">
        <div className="mb-3 flex flex-wrap gap-2">
          {meter.current_temperature !== null && meter.current_temperature !== undefined && (
            <Badge className="bg-red-600">{`${meter.current_temperature}\u00b0C`}</Badge>
          )}
          {meter.current_humidity !== null && meter.current_humidity !== undefined && (
            <Badge className="bg-sky-600">{`${meter.current_humidity}%`}</Badge>
          )}
          {meter.battery !== null && meter.battery !== undefined && (
            <Badge className="bg-green-600">{`${meter.battery}%`}</Badge>
          )}
        </div>
        {isStale ? (
          <p className="text-sm text-warning">履歴データの取得対象外</p>
        ) : (
          <MeterChart deviceId={meter.device_id} timeScale={timeScale} />
        )}
        {meter.last_updated ? (
          <p className="mt-2 text-xs text-muted">
            {`Last updated: ${new Date(meter.last_updated).toLocaleString()}`}
          </p>
        ) : (
          isStale && <p className="mt-2 text-sm text-warning">値がありません（データ未受信）</p>
        )}
      </div>
    </div>
  );
}

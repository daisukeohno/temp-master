import type { Meter, MeterReading, TimeScale } from '../api/types';
import { getDisplayName } from '../lib/displayNames';
import { HistoryChart } from './HistoryChart';

interface MeterCardProps {
  meter: Meter;
  history: MeterReading[];
  timeScale: TimeScale;
  isStale?: boolean;
}

function Stat({ value, color }: { value: string; color: string }) {
  return (
    <span className="badge" style={{ backgroundColor: color, color: 'var(--color-surface)' }}>
      {value}
    </span>
  );
}

export function MeterCard({ meter, history, timeScale, isStale = false }: MeterCardProps) {
  return (
    <article className="card flex flex-col p-4">
      <div className="mb-3 flex items-start justify-between gap-2">
        <div className="flex flex-wrap items-center gap-2">
          <h3 className="font-semibold">{getDisplayName(meter.device_name)}</h3>
          {isStale && (
            <span
              className="badge"
              style={{ backgroundColor: 'var(--color-warning)', color: 'var(--color-surface)' }}
            >
              7日以上未更新
            </span>
          )}
        </div>
        <span className="badge bg-surface-muted text-text-muted">{meter.device_type}</span>
      </div>

      <div className="mb-3 flex flex-wrap gap-2">
        {meter.current_temperature != null && (
          <Stat value={`${meter.current_temperature}\u00b0C`} color="var(--color-danger)" />
        )}
        {meter.current_humidity != null && (
          <Stat value={`${meter.current_humidity}%`} color="var(--color-info)" />
        )}
        {meter.battery != null && <Stat value={`${meter.battery}%`} color="var(--color-success)" />}
      </div>

      {isStale ? (
        <p className="text-xs text-text-muted">履歴データの取得対象外</p>
      ) : (
        <HistoryChart history={history} timeScale={timeScale} />
      )}

      {meter.last_updated ? (
        <p className="mt-2 text-xs text-text-muted">
          Last updated: {new Date(meter.last_updated).toLocaleString()}
        </p>
      ) : (
        isStale && <p className="mt-2 text-xs text-text-muted">値がありません（データ未受信）</p>
      )}
    </article>
  );
}

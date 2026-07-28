import { useQuery } from '@tanstack/react-query'
import { fetchHistory } from '../api/client'
import type { Meter, TimeScale } from '../api/types'
import { getDisplayName } from '../constants/displayNames'
import { REFRESH_INTERVAL_MS } from '../constants/timeScales'
import TemperatureChart from './TemperatureChart'

interface MeterCardProps {
  meter: Meter
  timeScale: TimeScale
  isStale: boolean
}

export default function MeterCard({ meter, timeScale, isStale }: MeterCardProps) {
  const historyQuery = useQuery({
    queryKey: ['history', meter.device_id, timeScale],
    queryFn: () => fetchHistory(meter.device_id, timeScale),
    refetchInterval: REFRESH_INTERVAL_MS,
    enabled: !isStale,
  })

  return (
    <div className="card flex flex-col">
      <div className="flex items-center justify-between gap-2 border-b border-border bg-surface-alt px-4 py-2 rounded-t-lg">
        <div className="flex flex-wrap items-center gap-2">
          <strong>{getDisplayName(meter.device_name)}</strong>
          {isStale && (
            <span className="badge bg-warn text-accent-contrast">7日以上未更新</span>
          )}
        </div>
        <span className="rounded-full bg-surface px-2 py-0.5 text-[11px] text-muted">
          {meter.device_type}
        </span>
      </div>

      <div className="flex flex-col gap-3 p-4">
        <div className="flex flex-wrap gap-2">
          {meter.current_temperature !== null && meter.current_temperature !== undefined && (
            <span className="badge bg-temp text-white">{meter.current_temperature}&deg;C</span>
          )}
          {meter.current_humidity !== null && meter.current_humidity !== undefined && (
            <span className="badge bg-humidity text-white">{meter.current_humidity}%</span>
          )}
          {meter.battery !== null && meter.battery !== undefined && (
            <span className="badge bg-battery text-white">{meter.battery}%</span>
          )}
        </div>

        {isStale ? (
          <p className="text-sm text-muted">履歴データの取得対象外</p>
        ) : historyQuery.isPending ? (
          <div className="flex h-[200px] items-center justify-center text-sm text-muted">
            Loading chart...
          </div>
        ) : historyQuery.isError ? (
          <div className="flex h-[200px] items-center justify-center text-sm text-danger">
            Failed to load history
          </div>
        ) : (
          <TemperatureChart history={historyQuery.data.history} timeScale={timeScale} />
        )}

        {meter.last_updated ? (
          <p className="text-xs text-muted">
            Last updated: {new Date(meter.last_updated).toLocaleString()}
          </p>
        ) : (
          isStale && <p className="text-sm text-muted">値がありません（データ未受信）</p>
        )}
      </div>
    </div>
  )
}

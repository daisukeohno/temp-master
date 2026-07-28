import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import type { TimeScale } from '../api/types'
import { useMeterHistory } from '../hooks/useMeterHistory'
import { formatTimestamp } from '../utils/format'

/** Colors reference the CSS variables of the active theme, so they follow theme switches. */
const colors = {
  line: 'var(--chart-line)',
  grid: 'var(--chart-grid)',
  axis: 'var(--chart-axis)',
  tooltipBg: 'var(--panel-bg)',
  tooltipBorder: 'var(--border-color)',
  text: 'var(--text-color)',
}

interface Props {
  deviceId: string
  timeScale: TimeScale
}

export function TemperatureChart({ deviceId, timeScale }: Props) {
  const { data, isPending, isError } = useMeterHistory(deviceId, timeScale)

  if (isPending) {
    return <div className="chart-placeholder">Loading chart...</div>
  }

  if (isError) {
    return <div className="chart-placeholder">履歴データを取得できませんでした</div>
  }

  const points = data.history.map((reading) => ({
    label: formatTimestamp(reading.timestamp, timeScale),
    temperature: reading.temperature,
  }))

  if (points.length === 0) {
    return <div className="chart-placeholder">履歴データがありません</div>
  }

  const gradientId = `temp-gradient-${deviceId}`

  return (
    <div className="meter-chart-wrap">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={points} margin={{ top: 8, right: 8, bottom: 0, left: -16 }}>
          <defs>
            <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={colors.line} stopOpacity={0.35} />
              <stop offset="100%" stopColor={colors.line} stopOpacity={0.02} />
            </linearGradient>
          </defs>
          <CartesianGrid stroke={colors.grid} strokeDasharray="3 3" />
          <XAxis
            dataKey="label"
            tick={{ fontSize: 10, fill: colors.axis }}
            stroke={colors.grid}
            interval="preserveStartEnd"
            minTickGap={24}
          />
          <YAxis
            tick={{ fontSize: 10, fill: colors.axis }}
            stroke={colors.grid}
            width={44}
            tickFormatter={(value: number) => `${value}°`}
            domain={['auto', 'auto']}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: colors.tooltipBg,
              border: `1px solid ${colors.tooltipBorder}`,
              borderRadius: 4,
              color: colors.text,
              fontSize: 12,
            }}
            labelStyle={{ color: colors.axis }}
            formatter={(value: number) => [`${value.toFixed(1)}°C`, 'Temperature']}
          />
          <Area
            type="monotone"
            dataKey="temperature"
            stroke={colors.line}
            strokeWidth={2}
            fill={`url(#${gradientId})`}
            dot={false}
            activeDot={{ r: 4, fill: colors.line }}
            isAnimationActive={false}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}

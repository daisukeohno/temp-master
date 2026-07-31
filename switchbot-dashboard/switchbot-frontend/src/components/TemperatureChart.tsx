import { useMemo } from 'react'
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { useHistoryQuery } from '../hooks/useDashboardData'
import { useChartColors } from '../theme/useChartColors'
import { formatTimestamp } from '../utils/format'
import type { TimeScale } from '../types'

interface TemperatureChartProps {
  deviceId: string
  timeScale: TimeScale
}

export function TemperatureChart({ deviceId, timeScale }: TemperatureChartProps) {
  const colors = useChartColors()
  const { data, isPending, isError } = useHistoryQuery(deviceId, timeScale, true)

  const points = useMemo(
    () =>
      (data?.history ?? []).map((reading) => ({
        label: formatTimestamp(reading.timestamp, timeScale),
        temperature: reading.temperature,
      })),
    [data, timeScale],
  )

  if (isPending || isError || points.length === 0) {
    let message = 'No history data'
    if (isPending) {
      message = 'Loading chart...'
    } else if (isError) {
      message = 'Failed to load history'
    }
    return (
      <div className="meter-chart-wrap">
        <p className="chart-empty">{message}</p>
      </div>
    )
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
            interval="preserveStartEnd"
            minTickGap={24}
            tick={{ fill: colors.tick, fontSize: 10 }}
            stroke={colors.grid}
          />
          <YAxis
            width={48}
            tick={{ fill: colors.tick, fontSize: 10 }}
            stroke={colors.grid}
            tickFormatter={(value: number) => `${value}\u00b0`}
            domain={['auto', 'auto']}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: colors.tooltipBg,
              border: `1px solid ${colors.tooltipBorder}`,
              color: colors.tooltipText,
            }}
            labelStyle={{ color: colors.tooltipText }}
            itemStyle={{ color: colors.line }}
            formatter={(value: number) => [`${value.toFixed(1)}\u00b0C`, 'Temperature']}
          />
          <Area
            type="monotone"
            dataKey="temperature"
            stroke={colors.line}
            strokeWidth={2}
            fill={`url(#${gradientId})`}
            dot={false}
            activeDot={{ r: 4, fill: colors.line, stroke: colors.line }}
            isAnimationActive={false}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}

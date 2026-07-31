import { useQuery } from '@tanstack/react-query'
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { getHistory } from '../api/client'
import { useTheme } from '../theme/ThemeProvider'
import type { TimeScale } from '../types'
import { formatTimestamp } from '../utils/format'

interface TemperatureChartProps {
  deviceId: string
  timeScale: TimeScale
}

export default function TemperatureChart({ deviceId, timeScale }: TemperatureChartProps) {
  const { colors } = useTheme()
  const { data, isLoading, isError } = useQuery({
    queryKey: ['history', deviceId, timeScale],
    queryFn: () => getHistory(deviceId, timeScale),
  })

  if (isLoading) {
    return <p className="h-[200px] text-xs text-muted">Loading chart...</p>
  }

  if (isError) {
    return <p className="h-[200px] text-xs text-muted">Failed to load history.</p>
  }

  const points = (data?.history ?? []).map((reading) => ({
    label: formatTimestamp(reading.timestamp, timeScale),
    temperature: reading.temperature,
  }))

  if (points.length === 0) {
    return <p className="h-[200px] text-xs text-muted">No history data.</p>
  }

  return (
    <div className="h-[200px]">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={points} margin={{ top: 8, right: 8, bottom: 0, left: -20 }}>
          <CartesianGrid stroke={colors.chartGrid} />
          <XAxis
            dataKey="label"
            interval="preserveStartEnd"
            minTickGap={24}
            tick={{ fontSize: 10, fill: colors.muted }}
            stroke={colors.border}
          />
          <YAxis
            tick={{ fontSize: 10, fill: colors.muted }}
            stroke={colors.border}
            tickFormatter={(value: number) => `${value}\u00b0`}
            domain={['auto', 'auto']}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: colors.surface,
              border: `1px solid ${colors.border}`,
              color: colors.text,
              fontSize: 12,
            }}
            labelStyle={{ color: colors.muted }}
            formatter={(value: number) => [`${value.toFixed(1)}\u00b0C`, 'Temperature']}
          />
          <Line
            type="monotone"
            dataKey="temperature"
            stroke={colors.chartLine}
            strokeWidth={2}
            fill={colors.chartFill}
            dot={{ r: 2, fill: colors.chartLine }}
            activeDot={{ r: 5, fill: colors.accent }}
            isAnimationActive={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}

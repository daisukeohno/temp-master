import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import type { HistoryPoint, TimeScale } from '../api/types'
import { useTheme } from '../theme/ThemeProvider'
import { formatTimestamp } from '../utils/format'

interface TemperatureChartProps {
  history: HistoryPoint[]
  timeScale: TimeScale
}

export default function TemperatureChart({ history, timeScale }: TemperatureChartProps) {
  const { theme } = useTheme()
  const chart = theme.chart

  const data = history.map((point) => ({
    label: formatTimestamp(point.timestamp, timeScale),
    temperature: point.temperature,
  }))

  if (data.length === 0) {
    return (
      <div className="flex h-[200px] items-center justify-center text-sm text-muted">
        No history data yet
      </div>
    )
  }

  return (
    <div className="h-[200px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 8, right: 8, bottom: 0, left: -20 }}>
          <CartesianGrid stroke={chart.grid} strokeDasharray="3 3" />
          <XAxis
            dataKey="label"
            tick={{ fill: chart.axis, fontSize: 10 }}
            stroke={chart.grid}
            interval="preserveStartEnd"
            minTickGap={24}
          />
          <YAxis
            tick={{ fill: chart.axis, fontSize: 10 }}
            stroke={chart.grid}
            tickFormatter={(value: number) => `${value}\u00b0`}
            domain={['auto', 'auto']}
            width={44}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: chart.tooltipBg,
              border: `1px solid ${chart.grid}`,
              borderRadius: 6,
              color: chart.tooltipText,
              fontSize: 12,
            }}
            labelStyle={{ color: chart.tooltipText }}
            itemStyle={{ color: chart.line }}
            formatter={(value: number | string) =>
              [`${Number(value).toFixed(1)}\u00b0C`, 'Temperature'] as [string, string]
            }
          />
          <Line
            type="monotone"
            dataKey="temperature"
            stroke={chart.line}
            strokeWidth={2}
            dot={{ r: 2, fill: chart.line, stroke: chart.line }}
            activeDot={{ r: 4 }}
            connectNulls
            isAnimationActive={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}

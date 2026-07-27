import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { formatTimestamp } from '../lib/format';
import { useChartColors } from '../theme/useChartColors';
import type { HistoryPoint, TimeScale } from '../types';

interface TemperatureChartProps {
  history: HistoryPoint[];
  timeScale: TimeScale;
}

export function TemperatureChart({ history, timeScale }: TemperatureChartProps) {
  const colors = useChartColors();
  const data = history.map((point) => ({
    label: formatTimestamp(point.timestamp, timeScale),
    temperature: point.temperature,
  }));

  if (data.length === 0) {
    return (
      <div className="flex h-[200px] items-center justify-center text-sm text-muted">
        履歴データがありません
      </div>
    );
  }

  return (
    <div className="h-[200px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 8, right: 8, bottom: 0, left: -20 }}>
          <defs>
            <linearGradient id="temperature-fill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={colors.line} stopOpacity={0.35} />
              <stop offset="100%" stopColor={colors.line} stopOpacity={0.02} />
            </linearGradient>
          </defs>
          <CartesianGrid stroke={colors.grid} strokeDasharray="3 3" />
          <XAxis
            dataKey="label"
            tick={{ fontSize: 10, fill: colors.tick }}
            stroke={colors.grid}
            interval="preserveStartEnd"
            minTickGap={24}
          />
          <YAxis
            tick={{ fontSize: 10, fill: colors.tick }}
            stroke={colors.grid}
            tickFormatter={(value: number) => `${value}\u00b0`}
            width={44}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: colors.tooltipBackground,
              border: `1px solid ${colors.tooltipBorder}`,
              borderRadius: 6,
              color: colors.tooltipText,
              fontSize: 12,
            }}
            labelStyle={{ color: colors.tooltipText }}
            formatter={(value: number | string) =>
              [`${Number(value).toFixed(1)}\u00b0C`, 'Temperature'] as [string, string]
            }
          />
          <Area
            type="monotone"
            dataKey="temperature"
            stroke={colors.line}
            strokeWidth={2}
            fill="url(#temperature-fill)"
            dot={{ r: 2, fill: colors.line, stroke: colors.line }}
            activeDot={{ r: 5 }}
            connectNulls
            isAnimationActive={false}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

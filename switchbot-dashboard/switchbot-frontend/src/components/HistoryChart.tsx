import { useMemo } from 'react';
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import type { MeterReading, TimeScale } from '../api/types';
import { formatTimestamp } from '../lib/format';
import { useChartTokens } from '../theme/useChartTokens';

interface HistoryChartProps {
  history: MeterReading[];
  timeScale: TimeScale;
}

export function HistoryChart({ history, timeScale }: HistoryChartProps) {
  const tokens = useChartTokens();
  const gradientId = useMemo(() => `temp-gradient-${Math.random().toString(36).slice(2)}`, []);

  const data = useMemo(
    () =>
      history.map((reading) => ({
        label: formatTimestamp(reading.timestamp, timeScale),
        temperature: reading.temperature,
      })),
    [history, timeScale],
  );

  if (data.length === 0) {
    return (
      <p className="flex h-[200px] items-center justify-center text-xs text-text-muted">
        No history data for this range.
      </p>
    );
  }

  return (
    <div className="h-[200px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 8, right: 8, bottom: 0, left: -20 }}>
          <defs>
            <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={tokens.line} stopOpacity={0.35} />
              <stop offset="100%" stopColor={tokens.line} stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid stroke={tokens.grid} />
          <XAxis
            dataKey="label"
            tick={{ fill: tokens.axis, fontSize: 10 }}
            stroke={tokens.grid}
            interval="preserveStartEnd"
            minTickGap={24}
          />
          <YAxis
            tick={{ fill: tokens.axis, fontSize: 10 }}
            stroke={tokens.grid}
            width={44}
            tickFormatter={(value: number) => `${value}\u00b0`}
            domain={['auto', 'auto']}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: tokens.tooltipBg,
              borderColor: tokens.grid,
              borderRadius: 8,
              color: tokens.tooltipText,
              fontSize: 12,
            }}
            labelStyle={{ color: tokens.axis }}
            itemStyle={{ color: tokens.tooltipText }}
            formatter={(value: number) => [`${value.toFixed(1)}\u00b0C`, 'Temperature']}
          />
          <Area
            type="monotone"
            dataKey="temperature"
            stroke={tokens.line}
            strokeWidth={2}
            fill={`url(#${gradientId})`}
            dot={false}
            activeDot={{ r: 4, fill: tokens.line }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

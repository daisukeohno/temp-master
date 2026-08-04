import { useMemo } from 'react';
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import type { MeterReading, TimeScale } from '../api';
import { formatTimestamp } from '../utils/meters';

export interface TemperatureChartProps {
  history: MeterReading[];
  timeScale: TimeScale;
}

export function TemperatureChart({ history, timeScale }: TemperatureChartProps) {
  const data = useMemo(
    () =>
      history.map((reading) => ({
        label: formatTimestamp(reading.timestamp, timeScale),
        temperature: reading.temperature,
      })),
    [history, timeScale],
  );

  if (data.length === 0) {
    return <p className="chart-empty">履歴データがありません</p>;
  }

  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={data} margin={{ top: 8, right: 12, bottom: 0, left: -20 }}>
        <CartesianGrid stroke="var(--color-chart-grid)" />
        <XAxis
          dataKey="label"
          interval="preserveStartEnd"
          minTickGap={24}
          tick={{ fontSize: 10, fill: 'var(--color-text-muted)' }}
          stroke="var(--color-chart-grid)"
        />
        <YAxis
          tick={{ fontSize: 10, fill: 'var(--color-text-muted)' }}
          stroke="var(--color-chart-grid)"
          tickFormatter={(value: number) => `${value}\u00b0`}
          domain={['auto', 'auto']}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: 'var(--color-surface)',
            border: '1px solid var(--color-border)',
            borderRadius: 4,
            color: 'var(--color-text)',
          }}
          labelStyle={{ color: 'var(--color-text-muted)' }}
          formatter={(value) => [`${Number(value).toFixed(1)}\u00b0C`, 'Temperature']}
        />
        <Line
          type="monotone"
          dataKey="temperature"
          stroke="var(--color-temperature)"
          strokeWidth={2}
          dot={false}
          activeDot={{ r: 4, fill: 'var(--color-temperature)' }}
          isAnimationActive={false}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}

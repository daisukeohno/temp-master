import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import type { TimeScale } from '../api/client';
import { useHistory } from '../api/hooks';
import { formatTimestamp } from '../lib/format';

interface TemperatureChartProps {
  deviceId: string;
  timeScale: TimeScale;
}

export function TemperatureChart({ deviceId, timeScale }: TemperatureChartProps) {
  const { data, isLoading, isError } = useHistory(deviceId, timeScale, true);

  if (isLoading) {
    return <p className="py-16 text-center text-xs text-muted">Loading chart...</p>;
  }

  if (isError) {
    return <p className="py-16 text-center text-xs text-danger">Failed to load history</p>;
  }

  const points = (data?.history ?? []).map((point) => ({
    label: formatTimestamp(point.timestamp, timeScale),
    temperature: point.temperature,
  }));

  return (
    <div className="h-[200px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={points} margin={{ top: 8, right: 8, bottom: 0, left: -20 }}>
          <defs>
            <linearGradient id={`temp-fill-${deviceId}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--color-temp)" stopOpacity={0.3} />
              <stop offset="100%" stopColor="var(--color-temp)" stopOpacity={0.05} />
            </linearGradient>
          </defs>
          <CartesianGrid stroke="var(--color-grid)" />
          <XAxis
            dataKey="label"
            tick={{ fontSize: 10, fill: 'var(--color-muted)' }}
            stroke="var(--color-grid)"
            interval="preserveStartEnd"
            minTickGap={24}
          />
          <YAxis
            tick={{ fontSize: 10, fill: 'var(--color-muted)' }}
            stroke="var(--color-grid)"
            tickFormatter={(value: number) => `${value}\u00b0`}
            domain={['auto', 'auto']}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: 'var(--color-panel)',
              border: '1px solid var(--color-border)',
              color: 'var(--color-fg)',
              fontSize: 12,
            }}
            labelStyle={{ color: 'var(--color-muted)' }}
            formatter={(value) =>
              typeof value === 'number'
                ? [`${value.toFixed(1)}\u00b0C`, 'Temperature']
                : ['', 'Temperature']
            }
          />
          <Area
            type="monotone"
            dataKey="temperature"
            stroke="var(--color-temp)"
            strokeWidth={2}
            fill={`url(#temp-fill-${deviceId})`}
            dot={{ r: 2, fill: 'var(--color-temp)' }}
            activeDot={{ r: 5, fill: 'var(--color-humidity)' }}
            connectNulls
            isAnimationActive={false}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

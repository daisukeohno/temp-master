import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { useHistory } from '../hooks/useApi';
import { formatTimestamp } from '../lib/format';
import { useThemeColor } from '../theme/ThemeProvider';
import type { TimeScale } from '../types';

interface MeterChartProps {
  deviceId: string;
  timeScale: TimeScale;
}

export default function MeterChart({ deviceId, timeScale }: MeterChartProps) {
  const { data, isError } = useHistory(deviceId, timeScale);
  const accent = useThemeColor('--color-accent');
  const muted = useThemeColor('--color-muted');
  const panel = useThemeColor('--color-panel');
  const border = useThemeColor('--color-border');

  if (isError) {
    return <p className="h-[200px] text-sm text-muted">Failed to load history.</p>;
  }

  const points = (data?.history ?? []).map((reading) => ({
    label: formatTimestamp(reading.timestamp, timeScale),
    temperature: reading.temperature,
  }));

  return (
    <div className="h-[200px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={points} margin={{ top: 8, right: 8, bottom: 0, left: -20 }}>
          <CartesianGrid stroke={border} strokeDasharray="3 3" />
          <XAxis dataKey="label" tick={{ fontSize: 10, fill: muted }} minTickGap={24} />
          <YAxis
            tick={{ fontSize: 10, fill: muted }}
            tickFormatter={(value: number) => `${value}\u00b0`}
          />
          <Tooltip
            contentStyle={{ backgroundColor: panel, borderColor: border, fontSize: 12 }}
            labelStyle={{ color: muted }}
            formatter={(value) => [`${Number(value).toFixed(1)}\u00b0C`, 'Temperature']}
          />
          <Line
            type="monotone"
            dataKey="temperature"
            stroke={accent}
            strokeWidth={2}
            dot={{ r: 2, fill: accent }}
            activeDot={{ r: 5 }}
            isAnimationActive={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

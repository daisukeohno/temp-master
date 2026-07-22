import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { MeterReading, TimeScale } from "../api/types";
import { useThemeColors } from "../theme/useThemeColors";
import { formatTimestamp } from "../utils/format";

interface MeterChartProps {
  history: MeterReading[];
  timeScale: TimeScale;
}

export function MeterChart({ history, timeScale }: MeterChartProps) {
  const colors = useThemeColors();

  const data = history.map((reading) => ({
    label: formatTimestamp(reading.timestamp, timeScale),
    temperature: reading.temperature,
  }));

  return (
    <div className="meter-chart-wrap">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 8, right: 12, bottom: 0, left: -12 }}>
          <defs>
            <linearGradient id="tempFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={colors.line} stopOpacity={0.3} />
              <stop offset="100%" stopColor={colors.line} stopOpacity={0.02} />
            </linearGradient>
          </defs>
          <CartesianGrid stroke={colors.grid} vertical={false} />
          <XAxis
            dataKey="label"
            tick={{ fontSize: 10, fill: colors.axis }}
            tickLine={{ stroke: colors.grid }}
            axisLine={{ stroke: colors.grid }}
            minTickGap={24}
          />
          <YAxis
            width={44}
            tick={{ fontSize: 10, fill: colors.axis }}
            tickLine={{ stroke: colors.grid }}
            axisLine={{ stroke: colors.grid }}
            tickFormatter={(value: number) => `${value}\u00b0`}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "var(--surface)",
              border: "1px solid var(--border)",
              borderRadius: 4,
              color: "var(--text)",
              fontSize: 12,
            }}
            labelStyle={{ color: "var(--text-muted)" }}
            formatter={(value: number) => [`${value.toFixed(1)}\u00b0C`, "Temp"]}
          />
          <Area
            type="monotone"
            dataKey="temperature"
            stroke={colors.line}
            strokeWidth={2}
            fill="url(#tempFill)"
            dot={{ r: 2, fill: colors.line, stroke: colors.line }}
            activeDot={{ r: 4 }}
            isAnimationActive={false}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

import { useMemo } from "react";
import {
  CategoryScale,
  Chart as ChartJS,
  Filler,
  LineElement,
  LinearScale,
  PointElement,
  Tooltip,
  type ChartData,
  type ChartOptions,
  type TooltipItem,
} from "chart.js";
import { Line } from "react-chartjs-2";
import type { MeterReading, TimeScale } from "../api/types";
import { formatTimestamp } from "../utils/meter";
import { useTheme } from "../theme/ThemeContext";
import { CHART_COLORS } from "../theme/themes";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
);

interface MeterChartProps {
  history: MeterReading[];
  timeScale: TimeScale;
}

export function MeterChart({ history, timeScale }: MeterChartProps) {
  const { theme } = useTheme();

  const { data, options } = useMemo(() => {
    const colors = CHART_COLORS[theme];

    const chartData: ChartData<"line"> = {
      labels: history.map((h) => formatTimestamp(h.timestamp, timeScale)),
      datasets: [
        {
          label: "Temperature (C)",
          data: history.map((h) => h.temperature),
          borderColor: colors.line,
          backgroundColor: colors.fill,
          borderWidth: 2,
          pointRadius: 3,
          pointBackgroundColor: colors.line,
          pointBorderColor: colors.line,
          pointHoverRadius: 5,
          pointHoverBackgroundColor: colors.pointHover,
          fill: true,
          tension: 0.4,
        },
      ],
    };

    const chartOptions: ChartOptions<"line"> = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          mode: "index",
          intersect: false,
          callbacks: {
            label: (item: TooltipItem<"line">) => {
              const v = item.parsed.y;
              if (v === null || v === undefined) return "";
              return `${v.toFixed(1)}\u00b0C`;
            },
          },
        },
      },
      scales: {
        x: {
          grid: { color: colors.grid },
          ticks: { maxTicksLimit: 8, font: { size: 10 }, color: colors.tick },
        },
        y: {
          grid: { color: colors.grid },
          ticks: {
            font: { size: 10 },
            color: colors.tick,
            callback: (value) => `${Number(value).toFixed(1)}\u00b0`,
          },
        },
      },
    };

    return { data: chartData, options: chartOptions };
  }, [history, timeScale, theme]);

  return <Line data={data} options={options} />;
}

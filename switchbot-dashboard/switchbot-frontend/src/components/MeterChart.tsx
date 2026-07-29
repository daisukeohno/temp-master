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
import { readThemeVar, useTheme } from "../theme/ThemeContext";

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
  // `theme` participates in the deps so colors recompute on theme change.
  const { theme } = useTheme();

  const { data, options } = useMemo(() => {
    const lineColor = readThemeVar("--chart-line") || "#d9534f";
    const fillColor = readThemeVar("--chart-fill") || "rgba(217,83,79,0.15)";
    const gridColor = readThemeVar("--chart-grid") || "rgba(0,0,0,0.05)";
    const tickColor = readThemeVar("--chart-tick") || "#777";
    const pointHover = readThemeVar("--chart-point-hover") || "#5bc0de";

    const chartData: ChartData<"line"> = {
      labels: history.map((h) => formatTimestamp(h.timestamp, timeScale)),
      datasets: [
        {
          label: "Temperature (C)",
          data: history.map((h) => h.temperature),
          borderColor: lineColor,
          backgroundColor: fillColor,
          borderWidth: 2,
          pointRadius: 3,
          pointBackgroundColor: lineColor,
          pointBorderColor: lineColor,
          pointHoverRadius: 5,
          pointHoverBackgroundColor: pointHover,
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
          grid: { color: gridColor },
          ticks: { maxTicksLimit: 8, font: { size: 10 }, color: tickColor },
        },
        y: {
          grid: { color: gridColor },
          ticks: {
            font: { size: 10 },
            color: tickColor,
            callback: (value) => `${value}\u00b0`,
          },
        },
      },
    };

    return { data: chartData, options: chartOptions };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [history, timeScale, theme]);

  return <Line data={data} options={options} />;
}

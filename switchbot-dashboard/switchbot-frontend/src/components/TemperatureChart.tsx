import {
  CategoryScale,
  Chart as ChartJS,
  Filler,
  Legend,
  LineElement,
  LinearScale,
  PointElement,
  Tooltip,
  type ChartOptions,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import type { MeterReading, TimeScale } from '../api/types';
import { useChartColors } from '../theme/useChartColors';
import { formatTimestamp } from '../utils';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
);

interface TemperatureChartProps {
  history: MeterReading[];
  timeScale: TimeScale;
}

export function TemperatureChart({ history, timeScale }: TemperatureChartProps) {
  const colors = useChartColors();

  const data = {
    labels: history.map((reading) => formatTimestamp(reading.timestamp, timeScale)),
    datasets: [
      {
        label: 'Temperature (C)',
        data: history.map((reading) => reading.temperature),
        borderColor: colors.line,
        backgroundColor: colors.fill,
        borderWidth: 2,
        pointRadius: 3,
        pointBackgroundColor: colors.line,
        pointBorderColor: colors.line,
        pointHoverRadius: 5,
        pointHoverBackgroundColor: colors.point,
        fill: true,
        tension: 0.4,
      },
    ],
  };

  const options: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        mode: 'index',
        intersect: false,
        callbacks: {
          label: (item) => {
            const value = item.parsed.y;
            return value === null || value === undefined
              ? ''
              : `${value.toFixed(1)}\u00b0C`;
          },
        },
      },
    },
    scales: {
      x: {
        display: true,
        grid: { display: true, color: colors.grid },
        ticks: { maxTicksLimit: 8, font: { size: 10 }, color: colors.tick },
      },
      y: {
        display: true,
        grid: { display: true, color: colors.grid },
        ticks: {
          font: { size: 10 },
          color: colors.tick,
          callback: (value) =>
            `${typeof value === 'number' ? Number(value.toFixed(1)) : value}\u00b0`,
        },
      },
    },
  };

  return (
    <div className="relative h-[200px]">
      <Line data={data} options={options} />
    </div>
  );
}

import { useQuery } from '@tanstack/react-query'
import {
  CategoryScale,
  Chart as ChartJS,
  Filler,
  LineElement,
  LinearScale,
  PointElement,
  Tooltip,
  type ChartOptions,
} from 'chart.js'
import { Line } from 'react-chartjs-2'
import { fetchHistory } from '../api'
import { useChartPalette } from '../theme'
import type { TimeScale } from '../types'
import { formatTimestamp } from '../utils'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
)

interface MeterChartProps {
  deviceId: string
  timeScale: TimeScale
}

export function MeterChart({ deviceId, timeScale }: MeterChartProps) {
  const palette = useChartPalette()
  const { data, isError } = useQuery({
    queryKey: ['history', deviceId, timeScale],
    queryFn: () => fetchHistory(deviceId, timeScale),
    refetchInterval: 30000,
  })

  if (isError) {
    return <div className="meter-chart-wrap" />
  }

  const history = data?.history ?? []
  const chartData = {
    labels: history.map((point) => formatTimestamp(point.timestamp, timeScale)),
    datasets: [
      {
        label: 'Temperature (C)',
        data: history.map((point) => point.temperature),
        borderColor: palette.line,
        backgroundColor: palette.fill,
        borderWidth: 2,
        pointRadius: 3,
        pointBackgroundColor: palette.point,
        pointBorderColor: palette.point,
        pointHoverRadius: 5,
        pointHoverBackgroundColor: palette.pointHover,
        fill: true,
        tension: 0.4,
      },
    ],
  }

  const options: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        mode: 'index',
        intersect: false,
        backgroundColor: palette.tooltipBackground,
        titleColor: palette.tooltipText,
        bodyColor: palette.tooltipText,
        callbacks: {
          label: (context) => {
            const value = context.parsed.y
            if (value === null || value === undefined) return ''
            return `${value.toFixed(1)}\u00b0C`
          },
        },
      },
    },
    scales: {
      x: {
        display: true,
        grid: { display: true, color: palette.grid },
        ticks: {
          maxTicksLimit: 8,
          font: { size: 10 },
          color: palette.tick,
        },
      },
      y: {
        display: true,
        grid: { display: true, color: palette.grid },
        ticks: {
          font: { size: 10 },
          color: palette.tick,
          callback: (value) => `${value}\u00b0`,
        },
      },
    },
  }

  return (
    <div className="meter-chart-wrap">
      <Line data={chartData} options={options} />
    </div>
  )
}

import { useContext, useEffect, useState } from 'react'
import { ThemeContext } from './ThemeContext'

export function useTheme() {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}

export interface ChartColors {
  line: string
  fill: string
  grid: string
  axis: string
  tooltipBg: string
  tooltipBorder: string
  text: string
}

function readChartColors(): ChartColors {
  const styles = getComputedStyle(document.documentElement)
  const read = (name: string) => styles.getPropertyValue(name).trim()
  return {
    line: read('--chart-line'),
    fill: read('--chart-fill'),
    grid: read('--chart-grid'),
    axis: read('--chart-axis'),
    tooltipBg: read('--panel-bg'),
    tooltipBorder: read('--border-color'),
    text: read('--text-color'),
  }
}

/** Chart colors resolved from the CSS variables of the active theme. */
export function useChartColors(): ChartColors {
  const { theme } = useTheme()
  const [colors, setColors] = useState<ChartColors>(readChartColors)

  useEffect(() => {
    setColors(readChartColors())
  }, [theme])

  return colors
}

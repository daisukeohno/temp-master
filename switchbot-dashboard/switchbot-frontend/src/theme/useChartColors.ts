import { useEffect, useState } from 'react'
import { useTheme } from './useTheme'

export interface ChartColors {
  line: string
  fill: string
  grid: string
  tick: string
  tooltipBg: string
  tooltipBorder: string
  tooltipText: string
}

const CHART_VARIABLES: Record<keyof ChartColors, string> = {
  line: '--chart-line',
  fill: '--chart-fill',
  grid: '--chart-grid',
  tick: '--chart-tick',
  tooltipBg: '--chart-tooltip-bg',
  tooltipBorder: '--chart-tooltip-border',
  tooltipText: '--chart-tooltip-text',
}

function readChartColors(): ChartColors {
  const styles = getComputedStyle(document.documentElement)
  const entries = Object.entries(CHART_VARIABLES).map(([key, variable]) => [
    key,
    styles.getPropertyValue(variable).trim(),
  ])
  return Object.fromEntries(entries) as ChartColors
}

/** Chart palette derived from the active theme's CSS custom properties. */
export function useChartColors(): ChartColors {
  const { theme } = useTheme()
  const [colors, setColors] = useState<ChartColors>(readChartColors)

  useEffect(() => {
    setColors(readChartColors())
  }, [theme])

  return colors
}

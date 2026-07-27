import { useMemo } from 'react';
import { useTheme } from './useTheme';

export interface ChartColors {
  line: string;
  fill: string;
  grid: string;
  tick: string;
  tooltipBackground: string;
  tooltipBorder: string;
  tooltipText: string;
}

function cssColor(variable: string, alpha = 1): string {
  const raw = getComputedStyle(document.documentElement).getPropertyValue(variable).trim();
  const channels = raw || '0 0 0';
  return alpha === 1 ? `rgb(${channels})` : `rgb(${channels} / ${alpha})`;
}

export function useChartColors(): ChartColors {
  const { theme } = useTheme();

  return useMemo(
    () => ({
      line: cssColor('--color-temperature'),
      fill: cssColor('--color-temperature', 0.2),
      grid: cssColor('--color-border', 0.6),
      tick: cssColor('--color-muted'),
      tooltipBackground: cssColor('--color-surface'),
      tooltipBorder: cssColor('--color-border'),
      tooltipText: cssColor('--color-foreground'),
    }),
    // Colors are read from CSS variables that change with the active theme.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [theme],
  );
}

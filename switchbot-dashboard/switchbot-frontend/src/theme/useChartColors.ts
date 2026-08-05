import { useEffect, useState } from 'react';
import { useTheme } from './ThemeProvider';

export interface ChartColors {
  line: string;
  fill: string;
  grid: string;
  tick: string;
  point: string;
}

function readColors(): ChartColors {
  const styles = getComputedStyle(document.documentElement);
  const value = (name: string, fallback: string) =>
    styles.getPropertyValue(name).trim() || fallback;

  return {
    line: value('--chart-line', '#d9534f'),
    fill: value('--chart-fill', 'rgba(217, 83, 79, 0.15)'),
    grid: value('--chart-grid', 'rgba(0, 0, 0, 0.05)'),
    tick: value('--chart-tick', '#777777'),
    point: value('--color-info', '#5bc0de'),
  };
}

export function useChartColors(): ChartColors {
  const { theme } = useTheme();
  const [colors, setColors] = useState<ChartColors>(readColors);

  useEffect(() => {
    setColors(readColors());
  }, [theme]);

  return colors;
}

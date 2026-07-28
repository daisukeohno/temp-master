import { useEffect, useState } from 'react';
import { useTheme } from './useTheme';

export interface ChartTokens {
  line: string;
  lineFill: string;
  grid: string;
  axis: string;
  tooltipBg: string;
  tooltipText: string;
}

const FALLBACK: ChartTokens = {
  line: '#dc2626',
  lineFill: 'rgba(220, 38, 38, 0.15)',
  grid: 'rgba(0, 0, 0, 0.08)',
  axis: '#6b7280',
  tooltipBg: '#ffffff',
  tooltipText: '#111827',
};

function readVar(styles: CSSStyleDeclaration, name: string, fallback: string): string {
  const value = styles.getPropertyValue(name).trim();
  return value || fallback;
}

/** Reads Recharts colors from the active theme's CSS variables. */
export function useChartTokens(): ChartTokens {
  const { theme } = useTheme();
  const [tokens, setTokens] = useState<ChartTokens>(FALLBACK);

  useEffect(() => {
    const styles = getComputedStyle(document.documentElement);
    setTokens({
      line: readVar(styles, '--chart-line', FALLBACK.line),
      lineFill: readVar(styles, '--chart-line-fill', FALLBACK.lineFill),
      grid: readVar(styles, '--chart-grid', FALLBACK.grid),
      axis: readVar(styles, '--chart-axis', FALLBACK.axis),
      tooltipBg: readVar(styles, '--chart-tooltip-bg', FALLBACK.tooltipBg),
      tooltipText: readVar(styles, '--chart-tooltip-text', FALLBACK.tooltipText),
    });
  }, [theme]);

  return tokens;
}

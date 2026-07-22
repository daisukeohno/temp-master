import { useEffect, useState } from "react";
import { useTheme } from "./ThemeProvider";

export interface ChartColors {
  line: string;
  fill: string;
  grid: string;
  axis: string;
}

function readVar(name: string, fallback: string): string {
  const value = getComputedStyle(document.documentElement)
    .getPropertyValue(name)
    .trim();
  return value || fallback;
}

// Resolves chart-related CSS custom properties for the active theme so that
// Recharts (which needs concrete color strings) stays in sync with the theme.
export function useThemeColors(): ChartColors {
  const { theme } = useTheme();
  const [colors, setColors] = useState<ChartColors>(() => read());

  useEffect(() => {
    setColors(read());
  }, [theme]);

  return colors;
}

function read(): ChartColors {
  return {
    line: readVar("--chart-line", "#d9534f"),
    fill: readVar("--chart-fill", "rgba(217, 83, 79, 0.15)"),
    grid: readVar("--chart-grid", "rgba(0, 0, 0, 0.05)"),
    axis: readVar("--chart-axis", "#777777"),
  };
}

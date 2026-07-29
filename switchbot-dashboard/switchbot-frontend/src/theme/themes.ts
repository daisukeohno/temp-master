export const THEMES = ["light", "dark", "solarized", "ocean"] as const;

export type ThemeName = (typeof THEMES)[number];

export const THEME_LABELS: Record<ThemeName, string> = {
  light: "Light",
  dark: "Dark",
  solarized: "Solarized",
  ocean: "Ocean",
};

export interface ChartColors {
  line: string;
  fill: string;
  grid: string;
  tick: string;
  pointHover: string;
}

// Chart colors live here (keyed by theme name) so charts can pick colors
// deterministically from the active theme rather than reading computed CSS,
// which would otherwise lag a render behind the `data-theme` attribute.
export const CHART_COLORS: Record<ThemeName, ChartColors> = {
  light: {
    line: "#d9534f",
    fill: "rgba(217, 83, 79, 0.15)",
    grid: "rgba(0, 0, 0, 0.05)",
    tick: "#777777",
    pointHover: "#5bc0de",
  },
  dark: {
    line: "#ff7b76",
    fill: "rgba(255, 123, 118, 0.2)",
    grid: "rgba(255, 255, 255, 0.08)",
    tick: "#9aa4b2",
    pointHover: "#4fd0e3",
  },
  solarized: {
    line: "#cb4b16",
    fill: "rgba(203, 75, 22, 0.18)",
    grid: "rgba(101, 123, 131, 0.18)",
    tick: "#657b83",
    pointHover: "#2aa198",
  },
  ocean: {
    line: "#37d3a0",
    fill: "rgba(55, 211, 160, 0.2)",
    grid: "rgba(143, 179, 196, 0.15)",
    tick: "#8fb3c4",
    pointHover: "#56ccf2",
  },
};

const STORAGE_KEY = "temp-master-theme";

function isThemeName(value: string | null): value is ThemeName {
  return value !== null && (THEMES as readonly string[]).includes(value);
}

export function getInitialTheme(): ThemeName {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (isThemeName(stored)) {
    return stored;
  }
  if (
    window.matchMedia &&
    window.matchMedia("(prefers-color-scheme: dark)").matches
  ) {
    return "dark";
  }
  return "light";
}

export function persistTheme(theme: ThemeName): void {
  localStorage.setItem(STORAGE_KEY, theme);
}

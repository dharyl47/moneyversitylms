import type { ChartOptions, ChartType } from "chart.js";

/**
 * Utility functions for dashboard charts
 */

const AXIS_TEXT_COLOR = "#050505";
const MONTSERRAT = "Montserrat, sans-serif";

const mergeChartOptions = <T extends ChartType>(
  base: ChartOptions<T>,
  overrides: ChartOptions<T>
): ChartOptions<T> => {
  const merged = {
    ...base,
    ...overrides,
  } as ChartOptions<T> & { [key: string]: any };

  merged.plugins = {
    ...base.plugins,
    ...overrides?.plugins,
    legend: {
      ...base.plugins?.legend,
      ...overrides?.plugins?.legend,
      labels: {
        ...base.plugins?.legend?.labels,
        ...overrides?.plugins?.legend?.labels,
      },
    },
    tooltip: {
      ...base.plugins?.tooltip,
      ...overrides?.plugins?.tooltip,
    },
  };

  merged.scales = {
    ...base.scales,
    ...overrides?.scales,
  } as any;

  if (merged.scales?.x) {
    merged.scales.x = {
      ...base.scales?.x,
      ...overrides?.scales?.x,
      ticks: {
        ...base.scales?.x?.ticks,
        ...overrides?.scales?.x?.ticks,
      },
      grid: {
        ...base.scales?.x?.grid,
        ...overrides?.scales?.x?.grid,
      },
    };
  }

  if (merged.scales?.y) {
    merged.scales.y = {
      ...base.scales?.y,
      ...overrides?.scales?.y,
      ticks: {
        ...base.scales?.y?.ticks,
        ...overrides?.scales?.y?.ticks,
      },
      grid: {
        ...base.scales?.y?.grid,
        ...overrides?.scales?.y?.grid,
      },
    };
  }

  return merged;
};

export const createChartOptions = <T extends ChartType>(
  overrides: ChartOptions<T> = {} as ChartOptions<T>
): ChartOptions<T> => {
  const base = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: {
          color: AXIS_TEXT_COLOR,
          font: {
            family: MONTSERRAT,
            weight: "600",
            size: 12,
          },
        },
      },
      tooltip: {
        backgroundColor: "#050505",
        titleColor: "#FFFFFF",
        bodyColor: "#FFFFFF",
        footerColor: "#FFFFFF",
        titleFont: {
          family: MONTSERRAT,
          weight: "600",
        },
        bodyFont: {
          family: MONTSERRAT,
        },
        footerFont: {
          family: MONTSERRAT,
        },
      },
    },
    scales: {
      x: {
        grid: {
          color: "rgba(5, 5, 5, 0.08)",
        },
        ticks: {
          color: AXIS_TEXT_COLOR,
          font: {
            family: MONTSERRAT,
            size: 12,
          },
        },
      },
      y: {
        beginAtZero: true,
        grid: {
          color: "rgba(5, 5, 5, 0.08)",
        },
        ticks: {
          color: AXIS_TEXT_COLOR,
          font: {
            family: MONTSERRAT,
            size: 12,
          },
        },
      },
    },
  } as ChartOptions<T>;

  return mergeChartOptions<T>(base, overrides);
};

/**
 * Parse a month string in "Jan 2024" format to a Date object
 */
export const parseMonthString = (str: string): Date => {
  const [month, year] = str.split(" ");
  const monthMap: { [key: string]: number } = {
    Jan: 0,
    Feb: 1,
    Mar: 2,
    Apr: 3,
    May: 4,
    Jun: 5,
    Jul: 6,
    Aug: 7,
    Sep: 8,
    Oct: 9,
    Nov: 10,
    Dec: 11,
  };
  return new Date(parseInt(year, 10), monthMap[month] || 0);
};

/**
 * Sort month strings in chronological order
 */
export const sortMonths = (months: string[]): string[] => {
  return [...months].sort((a, b) => {
    return parseMonthString(a).getTime() - parseMonthString(b).getTime();
  });
};


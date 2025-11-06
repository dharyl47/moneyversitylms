/**
 * Utility functions for dashboard charts
 */

/**
 * Parse a month string in "Jan 2024" format to a Date object
 */
export const parseMonthString = (str: string): Date => {
  const [month, year] = str.split(' ');
  const monthMap: { [key: string]: number } = {
    'Jan': 0, 'Feb': 1, 'Mar': 2, 'Apr': 3, 'May': 4, 'Jun': 5,
    'Jul': 6, 'Aug': 7, 'Sep': 8, 'Oct': 9, 'Nov': 10, 'Dec': 11
  };
  return new Date(parseInt(year), monthMap[month] || 0);
};

/**
 * Sort month strings in chronological order
 */
export const sortMonths = (months: string[]): string[] => {
  return [...months].sort((a, b) => {
    return parseMonthString(a).getTime() - parseMonthString(b).getTime();
  });
};


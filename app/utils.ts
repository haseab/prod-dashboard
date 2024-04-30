export const roundToThree = (num: number) => {
  return Math.round(num * 10000 + Number.EPSILON) / 10000;
};

export const simpleMovingAverage = (prices: number[], interval: number) => {
  const results = new Array(interval - 1).fill(null); // Fill the first 'interval-1' slots with null

  for (let index = interval - 1; index < prices.length; index++) {
    const intervalSlice = prices.slice(index - interval + 1, index + 1);
    const sum = intervalSlice.reduce((prev, curr) => prev + curr, 0);
    results.push(sum / interval);
  }

  return results;
};

interface HistoricalWeeklyData {
  week: number;
  date: string;
  p1HUT: number;
  movingAverage?: number;
}

interface HistoricalDailyData {
  day: number;
  date: string;
  p1HUT: number;
  movingAverage?: number;
}

export const p1HUTWeekly: HistoricalWeeklyData[] = [
  { week: 1, date: "01-02", p1HUT: 23.234 },
  { week: 2, date: "01-09", p1HUT: 27.676 },
  { week: 3, date: "01-16", p1HUT: 25.972 },
  { week: 4, date: "01-23", p1HUT: 29.366 },
  { week: 5, date: "01-30", p1HUT: 26.02 },
  { week: 6, date: "02-06", p1HUT: 12.576 },
  { week: 7, date: "02-13", p1HUT: 25.871 },
  { week: 8, date: "02-20", p1HUT: 31.199 },
  { week: 9, date: "02-27", p1HUT: 28.782 },
  { week: 10, date: "03-06", p1HUT: 31.01 },
  { week: 11, date: "03-13", p1HUT: 46.862 },
  { week: 12, date: "03-20", p1HUT: 34.099 },
  { week: 13, date: "03-27", p1HUT: 33.295 },
  { week: 14, date: "04-03", p1HUT: 35.823 },
  { week: 15, date: "04-10", p1HUT: 58.886 },
  { week: 16, date: "04-17", p1HUT: 35.734 },
  { week: 17, date: "04-24", p1HUT: 36.346 },
  { week: 18, date: "05-01", p1HUT: 61.694 },
  { week: 19, date: "05-08", p1HUT: 61.485 },
  { week: 20, date: "05-15", p1HUT: 54.027 },
  { week: 21, date: "05-22", p1HUT: 41.726 },
  { week: 22, date: "05-29", p1HUT: 23.526 },
  { week: 23, date: "06-05", p1HUT: 53.362 },
  { week: 24, date: "06-12", p1HUT: 49.611 },
  { week: 25, date: "06-19", p1HUT: 39.191 },
  { week: 26, date: "06-26", p1HUT: 35.225 },
  { week: 27, date: "07-03", p1HUT: 18.842 },
  { week: 28, date: "07-10", p1HUT: 24.109 },
  { week: 29, date: "07-17", p1HUT: 23.008 },
  { week: 30, date: "07-24", p1HUT: 17.027 },
  { week: 31, date: "07-31", p1HUT: 32.326 },
  { week: 32, date: "08-07", p1HUT: 24.134 },
  { week: 33, date: "08-14", p1HUT: 15.668 },
  { week: 34, date: "08-21", p1HUT: 23.198 },
  { week: 35, date: "08-28", p1HUT: 22.369 },
  { week: 36, date: "09-04", p1HUT: 42.569 },
  { week: 37, date: "09-11", p1HUT: 54.087 },
  { week: 38, date: "09-18", p1HUT: 62.517 },
  { week: 39, date: "09-25", p1HUT: 59.319 },
  { week: 40, date: "10-02", p1HUT: 48.308 },
  { week: 41, date: "10-09", p1HUT: 42.709 },
  { week: 42, date: "10-16", p1HUT: 44.446 },
  { week: 43, date: "10-23", p1HUT: 40.645 },
  { week: 44, date: "10-30", p1HUT: 28.336 },
  { week: 45, date: "11-06", p1HUT: 39.028 },
  { week: 46, date: "11-13", p1HUT: 26.677 },
  { week: 47, date: "11-20", p1HUT: 25.398 },
  { week: 48, date: "11-27", p1HUT: 18.326 },
  { week: 49, date: "12-04", p1HUT: 16.376 },
  { week: 50, date: "12-11", p1HUT: 17.633 },
  { week: 51, date: "12-18", p1HUT: 17.27 },
  { week: 52, date: "12-25", p1HUT: 22.676 },
  { week: 53, date: "01-01", p1HUT: 18.172 },
  { week: 54, date: "01-08", p1HUT: 30.201 },
  { week: 55, date: "01-15", p1HUT: 32.65 },
  { week: 56, date: "01-22", p1HUT: 66.441 },
  { week: 57, date: "01-29", p1HUT: 53.605 },
  { week: 58, date: "02-05", p1HUT: 83.787 },
  { week: 59, date: "02-12", p1HUT: 54.454 },
  { week: 60, date: "02-19", p1HUT: 52.257 },
  { week: 61, date: "02-26", p1HUT: 40.804 },
  { week: 62, date: "03-04", p1HUT: 56.404 },
  { week: 63, date: "03-11", p1HUT: 58.818 },
  { week: 64, date: "03-18", p1HUT: 58.732 },
  { week: 65, date: "03-25", p1HUT: 79.898 },
  { week: 66, date: "04-01", p1HUT: 62.256 },
  { week: 67, date: "04-08", p1HUT: 51.207 },
  { week: 68, date: "04-15", p1HUT: 48.723 },
  { week: 69, date: "04-22", p1HUT: 67.991 },
];

export const p1HUTDaily: HistoricalDailyData[] = [
  { day: 1, date: "03-04", p1HUT: 6.073 },
  { day: 2, date: "03-05", p1HUT: 8.951 },
  { day: 3, date: "03-06", p1HUT: 9.831 },
  { day: 4, date: "03-07", p1HUT: 4.998 },
  { day: 5, date: "03-08", p1HUT: 12.109 },
  { day: 6, date: "03-09", p1HUT: 11.077 },
  { day: 7, date: "03-10", p1HUT: 3.365 },
  { day: 8, date: "03-11", p1HUT: 13.29 },
  { day: 9, date: "03-12", p1HUT: 10.172 },
  { day: 10, date: "03-13", p1HUT: 7.84 },
  { day: 11, date: "03-14", p1HUT: 12.578 },
  { day: 12, date: "03-15", p1HUT: 5.513 },
  { day: 13, date: "03-16", p1HUT: 3.026 },
  { day: 14, date: "03-17", p1HUT: 6.4 },
  { day: 15, date: "03-18", p1HUT: 12.474 },
  { day: 16, date: "03-19", p1HUT: 9.648 },
  { day: 17, date: "03-20", p1HUT: 9.602 },
  { day: 18, date: "03-21", p1HUT: 8.008 },
  { day: 19, date: "03-22", p1HUT: 7.878 },
  { day: 20, date: "03-23", p1HUT: 6.407 },
  { day: 21, date: "03-24", p1HUT: 4.715 },
  { day: 22, date: "03-25", p1HUT: 13.921 },
  { day: 23, date: "03-26", p1HUT: 11.996 },
  { day: 24, date: "03-27", p1HUT: 10.249 },
  { day: 25, date: "03-28", p1HUT: 12.921 },
  { day: 26, date: "03-29", p1HUT: 15.249 },
  { day: 27, date: "03-30", p1HUT: 8.307 },
  { day: 28, date: "03-31", p1HUT: 7.256 },
  { day: 29, date: "04-01", p1HUT: 9.923 },
  { day: 30, date: "04-02", p1HUT: 11.001 },
  { day: 31, date: "04-03", p1HUT: 10.213 },
  { day: 32, date: "04-04", p1HUT: 7.87 },
  { day: 33, date: "04-05", p1HUT: 7.928 },
  { day: 34, date: "04-06", p1HUT: 9.997 },
  { day: 35, date: "04-07", p1HUT: 5.325 },
  { day: 36, date: "04-08", p1HUT: 9.738 },
  { day: 37, date: "04-09", p1HUT: 13.199 },
  { day: 38, date: "04-10", p1HUT: 3.411 },
  { day: 39, date: "04-11", p1HUT: 7.529 },
  { day: 40, date: "04-12", p1HUT: 8.107 },
  { day: 41, date: "04-13", p1HUT: 5.452 },
  { day: 42, date: "04-14", p1HUT: 3.772 },
  { day: 43, date: "04-15", p1HUT: 4.634 },
  { day: 44, date: "04-16", p1HUT: 10.575 },
  { day: 45, date: "04-17", p1HUT: 7.562 },
  { day: 46, date: "04-18", p1HUT: 8.216 },
  { day: 47, date: "04-19", p1HUT: 3.858 },
  { day: 48, date: "04-20", p1HUT: 5.39 },
  { day: 49, date: "04-21", p1HUT: 9.438 },
];

/*
'2024-03-04': 6.073,
 '2024-03-05': 8.951,
 '2024-03-06': 9.831,
 '2024-03-07': 4.998,
 '2024-03-08': 12.109,
 '2024-03-09': 11.077,
 '2024-03-10': 3.365
'2024-03-11': 13.29,
 '2024-03-12': 10.172,
 '2024-03-13': 7.84,
 '2024-03-14': 12.578,
 '2024-03-15': 5.513,
 '2024-03-16': 3.026,
 '2024-03-17': 6.4
'2024-03-18': 12.474,
 '2024-03-19': 9.648,
 '2024-03-20': 9.602,
 '2024-03-21': 8.008,
 '2024-03-22': 7.878,
 '2024-03-23': 6.407,
 '2024-03-24': 4.715
'2024-03-25': 13.921,
 '2024-03-26': 11.996,
 '2024-03-27': 10.249,
 '2024-03-28': 12.921,
 '2024-03-29': 15.249,
 '2024-03-30': 8.307,
 '2024-03-31': 7.256
'2024-04-01': 9.923,
 '2024-04-02': 11.001,
 '2024-04-03': 10.213,
 '2024-04-04': 7.87,
 '2024-04-05': 7.928,
 '2024-04-06': 9.997,
 '2024-04-07': 5.325
'2024-04-08': 9.738,
 '2024-04-09': 13.199,
 '2024-04-10': 3.411,
 '2024-04-11': 7.529,
 '2024-04-12': 8.107,
 '2024-04-13': 5.452,
 '2024-04-14': 3.772
 '2024-04-15': 4.634,
 '2024-04-16': 10.575,
 '2024-04-17': 7.562,
 '2024-04-18': 8.216,
 '2024-04-19': 3.858,
 '2024-04-20': 5.39,
 '2024-04-21': 9.438
  

*/

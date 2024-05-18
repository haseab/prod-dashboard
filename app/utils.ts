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
  p1HUTPercentage: number;
  movingAverage?: number;
  movingAveragePercentage?: number;
}

interface HistoricalDailyData {
  day: number;
  date: string;
  p1HUT: number;
  movingAverage?: number;
}

export const p1HUTWeekly: HistoricalWeeklyData[] = [
  { week: 1, date: "01-02", p1HUT: 23.234, p1HUTPercentage: 0.24979 },
  { week: 2, date: "01-09", p1HUT: 27.676, p1HUTPercentage: 0.28589 },
  { week: 3, date: "01-16", p1HUT: 25.972, p1HUTPercentage: 0.27962 },
  { week: 4, date: "01-23", p1HUT: 29.366, p1HUTPercentage: 0.32406 },
  { week: 5, date: "2023-01-30", p1HUT: 26.02, p1HUTPercentage: 0.13063 },
  { week: 6, date: "02-06", p1HUT: 12.576, p1HUTPercentage: 0.29647 },
  { week: 7, date: "02-13", p1HUT: 25.871, p1HUTPercentage: 0.34462 },
  { week: 8, date: "02-20", p1HUT: 31.199, p1HUTPercentage: 0.34043 },
  { week: 9, date: "02-27", p1HUT: 28.782, p1HUTPercentage: 0.34682 },
  { week: 10, date: "03-06", p1HUT: 31.01, p1HUTPercentage: 0.47793 },
  { week: 11, date: "03-13", p1HUT: 46.862, p1HUTPercentage: 0.37755 },
  { week: 12, date: "03-20", p1HUT: 34.099, p1HUTPercentage: 0.3635 },
  { week: 13, date: "03-27", p1HUT: 33.295, p1HUTPercentage: 0.41175 },
  { week: 14, date: "04-03", p1HUT: 35.823, p1HUTPercentage: 0.64434 },
  { week: 15, date: "04-10", p1HUT: 58.886, p1HUTPercentage: 0.39201 },
  { week: 16, date: "04-17", p1HUT: 35.734, p1HUTPercentage: 0.42056 },
  { week: 17, date: "04-24", p1HUT: 36.346, p1HUTPercentage: 0.62422 },
  { week: 18, date: "05-01", p1HUT: 61.694, p1HUTPercentage: 0.64367 },
  { week: 19, date: "05-08", p1HUT: 61.485, p1HUTPercentage: 0.64367 },
  { week: 20, date: "05-15", p1HUT: 54.027, p1HUTPercentage: 0.54649 },
  { week: 21, date: "05-22", p1HUT: 41.726, p1HUTPercentage: 0.42034 },
  { week: 22, date: "05-29", p1HUT: 23.526, p1HUTPercentage: 0.31307 },
  { week: 23, date: "06-05", p1HUT: 53.362, p1HUTPercentage: 0.58772 },
  { week: 24, date: "06-12", p1HUT: 49.611, p1HUTPercentage: 0.53151 },
  { week: 25, date: "06-19", p1HUT: 39.191, p1HUTPercentage: 0.44695 },
  { week: 26, date: "06-26", p1HUT: 35.225, p1HUTPercentage: 0.3166 },
  { week: 27, date: "07-03", p1HUT: 18.842, p1HUTPercentage: 0.19992 },
  { week: 28, date: "07-10", p1HUT: 24.109, p1HUTPercentage: 0.27028 },
  { week: 29, date: "07-17", p1HUT: 23.008, p1HUTPercentage: 0.23473 },
  { week: 30, date: "07-24", p1HUT: 17.027, p1HUTPercentage: 0.19246 },
  { week: 31, date: "07-31", p1HUT: 32.326, p1HUTPercentage: 0.34479 },
  { week: 32, date: "08-07", p1HUT: 24.134, p1HUTPercentage: 0.24525 },
  { week: 33, date: "08-14", p1HUT: 15.668, p1HUTPercentage: 0.18082 },
  { week: 34, date: "08-21", p1HUT: 23.198, p1HUTPercentage: 0.3001 },
  { week: 35, date: "08-28", p1HUT: 22.369, p1HUTPercentage: 0.26984 },
  { week: 36, date: "09-04", p1HUT: 42.569, p1HUTPercentage: 0.42262 },
  { week: 37, date: "09-11", p1HUT: 54.087, p1HUTPercentage: 0.55354 },
  { week: 38, date: "09-18", p1HUT: 62.517, p1HUTPercentage: 0.61846 },
  { week: 39, date: "09-25", p1HUT: 59.319, p1HUTPercentage: 0.61093 },
  { week: 40, date: "10-02", p1HUT: 48.308, p1HUTPercentage: 0.50723 },
  { week: 41, date: "10-09", p1HUT: 42.709, p1HUTPercentage: 0.43847 },
  { week: 42, date: "10-16", p1HUT: 44.446, p1HUTPercentage: 0.46164 },
  { week: 43, date: "10-23", p1HUT: 40.645, p1HUTPercentage: 0.40923 },
  { week: 44, date: "10-30", p1HUT: 28.336, p1HUTPercentage: 0.30935 },
  { week: 45, date: "11-06", p1HUT: 39.028, p1HUTPercentage: 0.4207 },
  { week: 46, date: "11-13", p1HUT: 26.677, p1HUTPercentage: 0.28699 },
  { week: 47, date: "11-20", p1HUT: 25.398, p1HUTPercentage: 0.29832 },
  { week: 48, date: "11-27", p1HUT: 18.326, p1HUTPercentage: 0.21424 },
  { week: 49, date: "12-04", p1HUT: 16.376, p1HUTPercentage: 0.17251 },
  { week: 50, date: "12-11", p1HUT: 17.633, p1HUTPercentage: 0.20098 },
  { week: 51, date: "12-18", p1HUT: 17.27, p1HUTPercentage: 0.20269 },
  { week: 52, date: "12-25", p1HUT: 22.676, p1HUTPercentage: 0.27644 },
  { week: 53, date: "01-01", p1HUT: 18.172, p1HUTPercentage: 0.18239 },
  { week: 54, date: "01-08", p1HUT: 30.201, p1HUTPercentage: 0.329 },
  { week: 55, date: "01-15", p1HUT: 32.65, p1HUTPercentage: 0.36101 },
  { week: 56, date: "01-22", p1HUT: 66.441, p1HUTPercentage: 0.63902 },
  { week: 57, date: "01-29", p1HUT: 53.605, p1HUTPercentage: 0.57062 },
  { week: 58, date: "02-05", p1HUT: 83.787, p1HUTPercentage: 0.77999 },
  { week: 59, date: "02-12", p1HUT: 54.454, p1HUTPercentage: 0.55339 },
  { week: 60, date: "02-19", p1HUT: 52.257, p1HUTPercentage: 0.5602 },
  { week: 61, date: "02-26", p1HUT: 40.804, p1HUTPercentage: 0.44484 },
  { week: 62, date: "03-04", p1HUT: 56.404, p1HUTPercentage: 0.57327 },
  { week: 63, date: "03-11", p1HUT: 58.818, p1HUTPercentage: 0.57273 },
  { week: 64, date: "03-18", p1HUT: 58.732, p1HUTPercentage: 0.56438 },
  { week: 65, date: "03-25", p1HUT: 79.898, p1HUTPercentage: 0.75275 },
  { week: 66, date: "04-01", p1HUT: 62.256, p1HUTPercentage: 0.64297 },
  { week: 67, date: "04-08", p1HUT: 51.207, p1HUTPercentage: 0.58113 },
  { week: 68, date: "04-15", p1HUT: 48.723, p1HUTPercentage: 0.5317 },
  { week: 69, date: "04-22", p1HUT: 67.991, p1HUTPercentage: 0.68545 },
  { week: 70, date: "04-29", p1HUT: 59.007, p1HUTPercentage: 0.58274 },
  { week: 71, date: "05-06", p1HUT: 52.089, p1HUTPercentage: 0.5965 },
];

export const p1HUTDaily: HistoricalDailyData[] = [
  { day: 1, date: "01-01", p1HUT: 1.933 },
  { day: 2, date: "01-03", p1HUT: 1.127 },
  { day: 3, date: "01-05", p1HUT: 9.721 },
  { day: 4, date: "01-07", p1HUT: 0.0 },
  { day: 5, date: "01-09", p1HUT: 6.346 },
  { day: 6, date: "01-11", p1HUT: 1.042 },
  { day: 7, date: "01-13", p1HUT: 4.995 },
  { day: 8, date: "01-15", p1HUT: 2.76 },
  { day: 9, date: "01-17", p1HUT: 5.538 },
  { day: 10, date: "01-19", p1HUT: 5.216 },
  { day: 11, date: "01-21", p1HUT: 2.527 },
  { day: 12, date: "01-23", p1HUT: 8.671 },
  { day: 13, date: "01-25", p1HUT: 6.892 },
  { day: 14, date: "01-27", p1HUT: 12.455 },
  { day: 15, date: "01-29", p1HUT: 6.76 },
  { day: 16, date: "01-31", p1HUT: 9.57 },
  { day: 17, date: "02-02", p1HUT: 4.235 },
  { day: 18, date: "02-04", p1HUT: 5.449 },
  { day: 19, date: "02-06", p1HUT: 12.168 },
  { day: 20, date: "02-08", p1HUT: 11.589 },
  { day: 21, date: "02-10", p1HUT: 11.754 },
  { day: 22, date: "02-12", p1HUT: 8.542 },
  { day: 23, date: "02-14", p1HUT: 10.007 },
  { day: 24, date: "02-16", p1HUT: 9.306 },
  { day: 25, date: "02-18", p1HUT: 4.35 },
  { day: 26, date: "02-20", p1HUT: 11.559 },
  { day: 27, date: "02-22", p1HUT: 13.43 },
  { day: 28, date: "02-24", p1HUT: 3.603 },
  { day: 29, date: "02-26", p1HUT: 4.013 },
  { day: 30, date: "02-28", p1HUT: 6.406 },
  { day: 31, date: "03-01", p1HUT: 6.935 },
  { day: 32, date: "03-03", p1HUT: 1.529 },
  { day: 33, date: "03-05", p1HUT: 8.951 },
  { day: 34, date: "03-07", p1HUT: 4.998 },
  { day: 35, date: "03-09", p1HUT: 11.077 },
  { day: 36, date: "03-11", p1HUT: 13.29 },
  { day: 37, date: "03-13", p1HUT: 7.84 },
  { day: 38, date: "03-15", p1HUT: 5.513 },
  { day: 39, date: "03-17", p1HUT: 6.4 },
  { day: 40, date: "03-19", p1HUT: 9.648 },
  { day: 41, date: "03-21", p1HUT: 8.008 },
  { day: 42, date: "03-23", p1HUT: 6.407 },
  { day: 43, date: "03-25", p1HUT: 13.921 },
  { day: 44, date: "03-27", p1HUT: 10.249 },
  { day: 45, date: "03-29", p1HUT: 15.249 },
  { day: 46, date: "03-31", p1HUT: 7.256 },
  { day: 47, date: "04-01", p1HUT: 9.923 },
  { day: 48, date: "04-03", p1HUT: 10.213 },
  { day: 49, date: "04-05", p1HUT: 7.928 },
  { day: 50, date: "04-07", p1HUT: 5.325 },
  { day: 51, date: "04-09", p1HUT: 13.199 },
  { day: 52, date: "04-11", p1HUT: 7.529 },
  { day: 53, date: "04-13", p1HUT: 5.452 },
  { day: 54, date: "04-15", p1HUT: 4.634 },
  { day: 55, date: "04-17", p1HUT: 7.562 },
  { day: 56, date: "04-19", p1HUT: 3.858 },
  { day: 57, date: "04-21", p1HUT: 9.438 },
  { day: 58, date: "04-23", p1HUT: 13.9 },
  { day: 59, date: "04-25", p1HUT: 9.2 },
  { day: 60, date: "04-27", p1HUT: 2.431 },
  { day: 61, date: "04-29", p1HUT: 10.259 },
  { day: 62, date: "05-01", p1HUT: 8.149 },
  { day: 63, date: "05-03", p1HUT: 4.542 },
  { day: 64, date: "05-05", p1HUT: 2.676 },
  { day: 65, date: "05-07", p1HUT: 8.606 },
  { day: 66, date: "05-09", p1HUT: 10.367 },
  { day: 67, date: "05-11", p1HUT: 4.421 },
];

/*

        "2024-04-29": 10.259,
        "2024-04-30": 10.805,
        "2024-05-01": 8.149,
        "2024-05-02": 9.194,
        "2024-05-03": 4.542,
        "2024-05-04": 13.382,
        "2024-05-05": 2.676
                "2024-05-06": 6.218,
        "2024-05-07": 8.606,
        "2024-05-08": 9.804,
        "2024-05-09": 10.367,
        "2024-05-10": 7.539,
        "2024-05-11": 4.421,
        "2024-05-12": 5.134
"2024-01-01": 1.933,
"2024-01-02": 2.292,
"2024-01-03": 1.127,
"2024-01-04": 1.949,
"2024-01-05": 9.721,
"2024-01-06": 1.15,
"2024-01-07": 0.0
"2024-01-08": 7.566,
"2024-01-09": 6.346,
"2024-01-10": 3.257,
"2024-01-11": 1.042,
"2024-01-12": 2.786,
"2024-01-13": 4.995,
"2024-01-14": 4.208
"2024-01-15": 2.76,
"2024-01-16": 5.047,
"2024-01-17": 5.538,
"2024-01-18": 7.579,
"2024-01-19": 5.216,
"2024-01-20": 3.983,
"2024-01-21": 2.527
"2024-01-22": 6.322,
"2024-01-23": 8.671,
"2024-01-24": 10.029,
"2024-01-25": 6.892,
"2024-01-26": 10.429,
"2024-01-27": 12.455,
"2024-01-28": 11.643
"2024-01-29": 6.76,
"2024-01-30": 11.172,
"2024-01-31": 9.57,
"2024-02-01": 9.091,
"2024-02-02": 4.235,
"2024-02-03": 7.329,
"2024-02-04": 5.449
"2024-02-05": 11.071,
"2024-02-06": 12.168,
"2024-02-07": 6.831,
"2024-02-08": 11.589,
"2024-02-09": 15.832,
"2024-02-10": 11.754,
"2024-02-11": 14.541
"2024-02-12": 8.542,
"2024-02-13": 10.407,
"2024-02-14": 10.007,
"2024-02-15": 5.495,
"2024-02-16": 9.306,
"2024-02-17": 6.346,
"2024-02-18": 4.35
"2024-02-19": 4.296,
"2024-02-20": 11.559,
"2024-02-21": 7.567,
"2024-02-22": 13.43,
"2024-02-23": 9.103,
"2024-02-24": 3.603,
"2024-02-25": 2.698
"2024-02-26": 4.013,
"2024-02-27": 7.486,
"2024-02-28": 6.406,
"2024-02-29": 8.945,
"2024-03-01": 6.935,
"2024-03-02": 5.49,
"2024-03-03": 1.529
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
  "2024-04-22": 6.616,
  "2024-04-23": 13.9,
  "2024-04-24": 9.732,
  "2024-04-25": 9.2,
  "2024-04-26": 12.782,
  "2024-04-27": 2.431,
  "2024-04-28": 13.33
  

*/

export const roundToThree = (num: number) => {
  return Math.round(num * 10000 + Number.EPSILON) / 10000;
};

export const p1HUTWeekly = [
  { week: "Jan '23", p1HUT: 23.23 },
  { week: 2, p1HUT: 26.03 },
  { week: 3, p1HUT: 25.0 },
  { week: 4, p1HUT: 28.45 },
  { week: 5, p1HUT: 23.08 },
  { week: 6, p1HUT: 11.28 },
  { week: 7, p1HUT: 15.0 },
  { week: 8, p1HUT: 29.24 },
  { week: 9, p1HUT: 27.06 },
  { week: 10, p1HUT: 28.03 },
  { week: 11, p1HUT: 34.38 },
  { week: 12, p1HUT: 28.13 },
  { week: 13, p1HUT: 31.57 },
  { week: 14, p1HUT: 30.46 },
  { week: 15, p1HUT: 52.91 },
  { week: 16, p1HUT: 34.14 },
  { week: 17, p1HUT: 33.55 },
  { week: 18, p1HUT: 58.68 },
  { week: 19, p1HUT: 61.48 },
  { week: 20, p1HUT: 52.89 },
  { week: 21, p1HUT: 40.88 },
  { week: 22, p1HUT: 22.21 },
  { week: 23, p1HUT: 45.35 },
  { week: 24, p1HUT: 41.06 },
  { week: 25, p1HUT: 39.19 },
  { week: 26, p1HUT: 35.23 },
  { week: 27, p1HUT: 18.84 },
  { week: 28, p1HUT: 19.56 },
  { week: 29, p1HUT: 23.01 },
  { week: 30, p1HUT: 17.03 },
  { week: 31, p1HUT: 32.33 },
  { week: 32, p1HUT: 24.13 },
  { week: 33, p1HUT: 14.39 },
  { week: 34, p1HUT: 23.2 },
  { week: 35, p1HUT: 22.37 },
  { week: 36, p1HUT: 40.1 },
  { week: 37, p1HUT: 54.09 },
  { week: 38, p1HUT: 62.52 },
  { week: 39, p1HUT: 58.29 },
  { week: 40, p1HUT: 48.31 },
  { week: 41, p1HUT: 41.61 },
  { week: 42, p1HUT: 35.75 },
  { week: 43, p1HUT: 40.65 },
  { week: 44, p1HUT: 23.68 },
  { week: 45, p1HUT: 36.4 },
  { week: 46, p1HUT: 21.45 },
  { week: 47, p1HUT: 22.6 },
  { week: 48, p1HUT: 18.33 },
  { week: 49, p1HUT: 15.13 },
  { week: 50, p1HUT: 16.75 },
  { week: 51, p1HUT: 11.89 },
  { week: 52, p1HUT: 15.96 },
  { week: 53, p1HUT: 4.37 },
  { week: 54, p1HUT: 27.98 },
  { week: 55, p1HUT: 11.42 },
  { week: 56, p1HUT: 50.92 },
  { week: 57, p1HUT: 33.08 },
  { week: 58, p1HUT: 75.08 },
  { week: 59, p1HUT: 53.073 },
  { week: 60, p1HUT: 51.607 },
  { week: 61, p1HUT: 38.96 },
];

export const p1HUTDaily = [
  { day: 0, p1HUT: 8.87 },
  { day: 1, p1HUT: 4.18 },
  { day: 2, p1HUT: 2.65 },
  { day: 3, p1HUT: 8.39 },
  { day: 4, p1HUT: 7.52 },
  { day: 5, p1HUT: 1.25 },
  { day: 6, p1HUT: 3.55 },
  { day: 7, p1HUT: 1.61 },
  { day: 8, p1HUT: 5.19 },
  { day: 9, p1HUT: 0.0 },
  { day: 10, p1HUT: 4.2 },
  { day: 11, p1HUT: 5.64 },
  { day: 12, p1HUT: 0.0 },
  { day: 13, p1HUT: 4.8 },
  { day: 14, p1HUT: 2.97 },
  { day: 15, p1HUT: 9.42 },
  { day: 16, p1HUT: 1.55 },
  { day: 17, p1HUT: 5.21 },
  { day: 18, p1HUT: 3.46 },
  { day: 19, p1HUT: 0.0 },
  { day: 20, p1HUT: 0.0 },
  { day: 21, p1HUT: 3.51 },
  { day: 22, p1HUT: 7.58 },
  { day: 23, p1HUT: 0.0 },
  { day: 24, p1HUT: 2.16 },
  { day: 25, p1HUT: 3.98 },
  { day: 26, p1HUT: 0.0 },
  { day: 27, p1HUT: 1.1 },
  { day: 28, p1HUT: 3.95 },
  { day: 29, p1HUT: 4.18 },
  { day: 30, p1HUT: 0.0 },
  { day: 31, p1HUT: 5.88 },
  { day: 32, p1HUT: 0.0 },
  { day: 33, p1HUT: 0.0 },
  { day: 34, p1HUT: 1.12 },
  { day: 35, p1HUT: 2.4 },
  { day: 36, p1HUT: 4.26 },
  { day: 37, p1HUT: 2.16 },
  { day: 38, p1HUT: 6.89 },
  { day: 39, p1HUT: 1.05 },
  { day: 40, p1HUT: 0.0 },
  { day: 41, p1HUT: 0.0 },
  { day: 42, p1HUT: 2.35 },
  { day: 43, p1HUT: 3.86 },
  { day: 44, p1HUT: 0.86 },
  { day: 45, p1HUT: 3.89 },
  { day: 46, p1HUT: 0.0 },
  { day: 47, p1HUT: 0.94 },
  { day: 48, p1HUT: 0.0 },
  { day: 49, p1HUT: 4.85 },
  { day: 50, p1HUT: 6.35 },
  { day: 51, p1HUT: 2.23 },
  { day: 52, p1HUT: 1.38 },
  { day: 53, p1HUT: 1.15 },
  { day: 54, p1HUT: 0.0 },
  { day: 55, p1HUT: 0.0 },
  { day: 56, p1HUT: 0.0 },
  { day: 57, p1HUT: 2.29 },
  { day: 58, p1HUT: 0.0 },
  { day: 59, p1HUT: 0.93 },
  { day: 60, p1HUT: 0.0 },
  { day: 61, p1HUT: 1.15 },
  { day: 62, p1HUT: 0.0 },
  { day: 63, p1HUT: 7.57 },
  { day: 64, p1HUT: 4.29 },
  { day: 65, p1HUT: 3.09 },
  { day: 66, p1HUT: 1.04 },
  { day: 67, p1HUT: 2.79 },
  { day: 68, p1HUT: 4.99 },
  { day: 69, p1HUT: 4.21 },
  { day: 70, p1HUT: 0.0 },
  { day: 71, p1HUT: 3.47 },
  { day: 72, p1HUT: 2.37 },
  { day: 73, p1HUT: 2.02 },
  { day: 74, p1HUT: 1.55 },
  { day: 75, p1HUT: 2.02 },
  { day: 76, p1HUT: 0.0 },
  { day: 77, p1HUT: 3.87 },
  { day: 78, p1HUT: 5.49 },
  { day: 79, p1HUT: 1.57 },
  { day: 80, p1HUT: 6.63 },
  { day: 81, p1HUT: 10.2 },
  { day: 82, p1HUT: 12.45 },
  { day: 83, p1HUT: 10.7 },
  { day: 84, p1HUT: 3.0 },
  { day: 85, p1HUT: 5.32 },
  { day: 86, p1HUT: 7.31 },
  { day: 87, p1HUT: 3.41 },
  { day: 88, p1HUT: 3.1 },
  { day: 89, p1HUT: 5.49 },
  { day: 90, p1HUT: 5.45 },
  { day: 91, p1HUT: 6.23 },
  { day: 92, p1HUT: 12.14 },
  { day: 93, p1HUT: 5.94 },
  { day: 94, p1HUT: 10.64 },
  { day: 95, p1HUT: 15.83 },
  { day: 96, p1HUT: 10.67 },
  { day: 97, p1HUT: 13.63 },
  { day: 98, p1HUT: 8.542 },
  { day: 99, p1HUT: 11.655 },
  { day: 100, p1HUT: 7.69 },
  { day: 101, p1HUT: 5.495 },
  { day: 102, p1HUT: 9.308 },
  { day: 103, p1HUT: 6.9 },
  { day: 104, p1HUT: 3.483 },
  { day: 105, p1HUT: 4.296 },
  { day: 106, p1HUT: 9.471 },
  { day: 107, p1HUT: 7.567 },
  { day: 108, p1HUT: 13.433 },
  { day: 109, p1HUT: 9.103 },
  { day: 110, p1HUT: 3.606 },
  { day: 111, p1HUT: 4.131 },
  { day: 112, p1HUT: 4.013 },
  { day: 113, p1HUT: 6.636 },
  { day: 114, p1HUT: 7.519 },
  { day: 115, p1HUT: 9.445 },
  { day: 116, p1HUT: 6.88 },
  { day: 117, p1HUT: 2.938 },
  { day: 118, p1HUT: 1.529 },
];

/*


        "2024-02-26": 4.013,
        "2024-02-27": 6.636,
        "2024-02-28": 7.519,
        "2024-02-29": 9.445,
        "2024-03-01": 6.88,
        "2024-03-02": 2.938,
        "2024-03-03": 1.529



*/

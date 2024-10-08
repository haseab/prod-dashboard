import {
  HistoricalDailyData,
  HistoricalWeeklyData,
  MetricNames,
} from "@/types";

export const targets = {
  [MetricNames.HOURS_FREE]: "N/A",
  [MetricNames.N1HUT]: "N/A",
  [MetricNames.PRODUCTIVITY]: "70",
  [MetricNames.EFFICIENCY]: "70",
  [MetricNames.PRODUCTIVE_FLOW]: "55",
  [MetricNames.TOTAL_FLOW]: "55",
  [MetricNames.UNPRODUCTIVE]: "2.5",
  [MetricNames.UNPLANNED_TIME]: "16.5",
  [MetricNames.PRODUCTIVE_FLOW_EFFICIENCY]: "50",
  [MetricNames.DISTRACTION_COUNT]: "500",
};

export const tooltips = {
  [MetricNames.HOURS_FREE]:
    "means the total hours in a week that I had freedom to do whatever I wanted (excluding sleep, eating, and other necessities)\nI track this because It gives me clarity on how much free time I have in the week so I notice if I have too much or too little free time relative to my productivity",
  [MetricNames.N1HUT]:
    "means the total hours in a week that I spent doing a neutral activity for over 50 consecutive minutes (e.g. sleep, eating, etc.)\nI track this because it gives me a sense of how much flow I have in neutral tasks",
  [MetricNames.PRODUCTIVITY]:
    "means the total hours in a week that I did anything that moved me closer to my goals (e.g. startup work, gym, reading books, research, etc.)\nI track this because it gives me a sense of how much time I spent on things that move me closer to my goals",
  [MetricNames.EFFICIENCY]:
    "calculated as productive hours divided by the # hours that I had free to be productive that week\nI track this because it gives me a good understanding early in the week of how much I'm getting done",
  [MetricNames.PRODUCTIVE_FLOW]:
    "answers the question: how many of those productive hours was I really focused? strictly means the total hours in a week that I spent doing a productive activity for over 50 consecutive minutes\n I track this because it's a good indicator of how much of my productive time was spent in flow state and not just doing busy work",
  [MetricNames.TOTAL_FLOW]:
    "means the total hours in a week that I spent on any activity for over 50 consecutive minutes\nI track this because it gives me a good number of how many hours of flow I had in a week, the goal is to have this number be as high as possible at minimum so even if I am unproductive I am at least in flow state doing something unproductive",
  [MetricNames.UNPRODUCTIVE]:
    "means the total hours in a week that I did unproductive tasks\nI track this because it gives me a sense of how much time I spent on things that don't move me closer to my goals",
  [MetricNames.UNPLANNED_TIME]:
    "means the total hours in a week that I didn't intentionally decide to do. Strictly calculated as the number of hours in my calendar that I didn't explictly put an event for\nI track this because my goal is to have as little unplanned time as possible, i have a theory the less unplanned time you have the less self conflict you have",
  [MetricNames.PRODUCTIVE_FLOW_EFFICIENCY]:
    "calculated as productive flow hours divided by # hours that I had free to be productive that week\nI track this because it gives me a good understanding early in the week of how much I'm getting done in a flow state",
  [MetricNames.DISTRACTION_COUNT]:
    "means the total number of times that I checked my message notifications. Strictly calculated by the number of times I hit a keyboard shortcut to check my messages\nI track this because it is a good proxy to understanding how many times I got distracted in a week, the goal is to have this number be as low as possible",
};

export const weeklyProductiveFlow: HistoricalWeeklyData[] = [
  { week: 1, date: "Jan 02", productiveFlow: 23.234, flowPercentage: 0.24979 },
  { week: 2, date: "Jan 09", productiveFlow: 27.676, flowPercentage: 0.28589 },
  { week: 3, date: "Jan 16", productiveFlow: 25.972, flowPercentage: 0.27962 },
  { week: 4, date: "Jan 23", productiveFlow: 29.366, flowPercentage: 0.32406 },
  {
    week: 5,
    date: "Jan 30 2023",
    productiveFlow: 26.02,
    flowPercentage: 0.13063,
  },
  { week: 6, date: "Feb 06", productiveFlow: 12.576, flowPercentage: 0.29647 },
  { week: 7, date: "Feb 13", productiveFlow: 25.871, flowPercentage: 0.34462 },
  { week: 8, date: "Feb 20", productiveFlow: 31.199, flowPercentage: 0.34043 },
  { week: 9, date: "Feb 27", productiveFlow: 28.782, flowPercentage: 0.34682 },
  { week: 10, date: "Mar 06", productiveFlow: 31.01, flowPercentage: 0.47793 },
  { week: 11, date: "Mar 13", productiveFlow: 46.862, flowPercentage: 0.37755 },
  { week: 12, date: "Mar 20", productiveFlow: 34.099, flowPercentage: 0.3635 },
  { week: 13, date: "Mar 27", productiveFlow: 33.295, flowPercentage: 0.41175 },
  { week: 14, date: "Apr 03", productiveFlow: 35.823, flowPercentage: 0.64434 },
  { week: 15, date: "Apr 10", productiveFlow: 58.886, flowPercentage: 0.39201 },
  { week: 16, date: "Apr 17", productiveFlow: 35.734, flowPercentage: 0.42056 },
  { week: 17, date: "Apr 24", productiveFlow: 36.346, flowPercentage: 0.62422 },
  { week: 18, date: "May 01", productiveFlow: 61.694, flowPercentage: 0.64367 },
  { week: 19, date: "May 08", productiveFlow: 61.485, flowPercentage: 0.64367 },
  { week: 20, date: "May 15", productiveFlow: 54.027, flowPercentage: 0.54649 },
  { week: 21, date: "May 22", productiveFlow: 41.726, flowPercentage: 0.42034 },
  { week: 22, date: "May 29", productiveFlow: 23.526, flowPercentage: 0.31307 },
  { week: 23, date: "Jun 05", productiveFlow: 53.362, flowPercentage: 0.58772 },
  { week: 24, date: "Jun 12", productiveFlow: 49.611, flowPercentage: 0.53151 },
  { week: 25, date: "Jun 19", productiveFlow: 39.191, flowPercentage: 0.44695 },
  { week: 26, date: "Jun 26", productiveFlow: 35.225, flowPercentage: 0.3166 },
  { week: 27, date: "Jul 03", productiveFlow: 18.842, flowPercentage: 0.19992 },
  { week: 28, date: "Jul 10", productiveFlow: 24.109, flowPercentage: 0.27028 },
  { week: 29, date: "Jul 17", productiveFlow: 23.008, flowPercentage: 0.23473 },
  { week: 30, date: "Jul 24", productiveFlow: 17.027, flowPercentage: 0.19246 },
  { week: 31, date: "Jul 31", productiveFlow: 32.326, flowPercentage: 0.34479 },
  { week: 32, date: "Aug 07", productiveFlow: 24.134, flowPercentage: 0.24525 },
  { week: 33, date: "Aug 14", productiveFlow: 15.668, flowPercentage: 0.18082 },
  { week: 34, date: "Aug 21", productiveFlow: 23.198, flowPercentage: 0.3001 },
  { week: 35, date: "Aug 28", productiveFlow: 22.369, flowPercentage: 0.26984 },
  { week: 36, date: "Sep 04", productiveFlow: 42.569, flowPercentage: 0.42262 },
  { week: 37, date: "Sep 11", productiveFlow: 54.087, flowPercentage: 0.55354 },
  { week: 38, date: "Sep 18", productiveFlow: 62.517, flowPercentage: 0.61846 },
  { week: 39, date: "Sep 25", productiveFlow: 59.319, flowPercentage: 0.61093 },
  { week: 40, date: "Oct 02", productiveFlow: 48.308, flowPercentage: 0.50723 },
  { week: 41, date: "Oct 09", productiveFlow: 42.709, flowPercentage: 0.43847 },
  { week: 42, date: "Oct 16", productiveFlow: 44.446, flowPercentage: 0.46164 },
  { week: 43, date: "Oct 23", productiveFlow: 40.645, flowPercentage: 0.40923 },
  { week: 44, date: "Oct 30", productiveFlow: 28.336, flowPercentage: 0.30935 },
  { week: 45, date: "Nov 06", productiveFlow: 39.028, flowPercentage: 0.4207 },
  { week: 46, date: "Nov 13", productiveFlow: 26.677, flowPercentage: 0.28699 },
  { week: 47, date: "Nov 20", productiveFlow: 25.398, flowPercentage: 0.29832 },
  { week: 48, date: "Nov 27", productiveFlow: 18.326, flowPercentage: 0.21424 },
  { week: 49, date: "Dec 04", productiveFlow: 16.376, flowPercentage: 0.17251 },
  { week: 50, date: "Dec 11", productiveFlow: 17.633, flowPercentage: 0.20098 },
  { week: 51, date: "Dec 18", productiveFlow: 17.27, flowPercentage: 0.20269 },
  { week: 52, date: "Dec 25", productiveFlow: 22.676, flowPercentage: 0.27644 },
  {
    week: 53,
    date: "Jan 01 2024",
    productiveFlow: 18.172,
    flowPercentage: 0.18239,
  },
  { week: 54, date: "Jan 08", productiveFlow: 30.201, flowPercentage: 0.329 },
  { week: 55, date: "Jan 15", productiveFlow: 32.65, flowPercentage: 0.36101 },
  { week: 56, date: "Jan 22", productiveFlow: 66.441, flowPercentage: 0.63902 },
  { week: 57, date: "Jan 29", productiveFlow: 53.605, flowPercentage: 0.57062 },
  { week: 58, date: "Feb 05", productiveFlow: 83.787, flowPercentage: 0.77999 },
  { week: 59, date: "Feb 12", productiveFlow: 54.454, flowPercentage: 0.55339 },
  { week: 60, date: "Feb 19", productiveFlow: 52.257, flowPercentage: 0.5602 },
  { week: 61, date: "Feb 26", productiveFlow: 40.804, flowPercentage: 0.44484 },
  { week: 62, date: "Mar 04", productiveFlow: 56.404, flowPercentage: 0.57327 },
  { week: 63, date: "Mar 11", productiveFlow: 58.818, flowPercentage: 0.57273 },
  { week: 64, date: "Mar 18", productiveFlow: 58.732, flowPercentage: 0.56438 },
  { week: 65, date: "Mar 25", productiveFlow: 79.898, flowPercentage: 0.75275 },
  { week: 66, date: "Apr 01", productiveFlow: 62.256, flowPercentage: 0.64297 },
  { week: 67, date: "Apr 08", productiveFlow: 51.207, flowPercentage: 0.58113 },
  { week: 68, date: "Apr 15", productiveFlow: 48.723, flowPercentage: 0.5317 },
  { week: 69, date: "Apr 22", productiveFlow: 67.991, flowPercentage: 0.68545 },
  { week: 70, date: "Apr 29", productiveFlow: 59.007, flowPercentage: 0.58274 },
  { week: 71, date: "May 06", productiveFlow: 52.089, flowPercentage: 0.5965 },
  { week: 72, date: "May 13", productiveFlow: 56.228, flowPercentage: 0.59855 },
  { week: 73, date: "May 20", productiveFlow: 52.663, flowPercentage: 0.59749 },
  { week: 74, date: "May 27", productiveFlow: 52.1, flowPercentage: 0.59214 },
  { week: 75, date: "Jun 03", productiveFlow: 54.957, flowPercentage: 0.61521 },
  { week: 76, date: "Jun 10", productiveFlow: 54.806, flowPercentage: 0.57709 },
  { week: 77, date: "Jun 17", productiveFlow: 46.202, flowPercentage: 0.53428 },
  { week: 78, date: "Jun 24", productiveFlow: 53.496, flowPercentage: 0.59195 },
  { week: 79, date: "Jul 01", productiveFlow: 60.421, flowPercentage: 0.63102 },
  { week: 80, date: "Jul 08", productiveFlow: 51.826, flowPercentage: 0.57138 },
  { week: 81, date: "Jul 15", productiveFlow: 49.801, flowPercentage: 0.54889 },
  { week: 82, date: "Jul 22", productiveFlow: 57.01, flowPercentage: 0.62036 },
  { week: 83, date: "Jul 29", productiveFlow: 53.337, flowPercentage: 0.56839 },
  { week: 84, date: "Aug 05", productiveFlow: 48.676, flowPercentage: 0.54058 },
];

export const dailyProductiveFlow: HistoricalDailyData[] = [
  { day: 1, date: "01-01", productiveFlow: 1.933 },
  { day: 2, date: "01-03", productiveFlow: 1.127 },
  { day: 3, date: "01-05", productiveFlow: 9.721 },
  { day: 4, date: "01-07", productiveFlow: 0.0 },
  { day: 5, date: "01-09", productiveFlow: 6.346 },
  { day: 6, date: "01-11", productiveFlow: 1.042 },
  { day: 7, date: "01-13", productiveFlow: 4.995 },
  { day: 8, date: "01-15", productiveFlow: 2.76 },
  { day: 9, date: "01-17", productiveFlow: 5.538 },
  { day: 10, date: "01-19", productiveFlow: 5.216 },
  { day: 11, date: "01-21", productiveFlow: 2.527 },
  { day: 12, date: "01-23", productiveFlow: 8.671 },
  { day: 13, date: "01-25", productiveFlow: 6.892 },
  { day: 14, date: "01-27", productiveFlow: 12.455 },
  { day: 15, date: "01-29", productiveFlow: 6.76 },
  { day: 16, date: "01-31", productiveFlow: 9.57 },
  { day: 17, date: "02-02", productiveFlow: 4.235 },
  { day: 18, date: "02-04", productiveFlow: 5.449 },
  { day: 19, date: "02-06", productiveFlow: 12.168 },
  { day: 20, date: "02-08", productiveFlow: 11.589 },
  { day: 21, date: "02-10", productiveFlow: 11.754 },
  { day: 22, date: "02-12", productiveFlow: 8.542 },
  { day: 23, date: "02-14", productiveFlow: 10.007 },
  { day: 24, date: "02-16", productiveFlow: 9.306 },
  { day: 25, date: "02-18", productiveFlow: 4.35 },
  { day: 26, date: "02-20", productiveFlow: 11.559 },
  { day: 27, date: "02-22", productiveFlow: 13.43 },
  { day: 28, date: "02-24", productiveFlow: 3.603 },
  { day: 29, date: "02-26", productiveFlow: 4.013 },
  { day: 30, date: "02-28", productiveFlow: 6.406 },
  { day: 31, date: "03-01", productiveFlow: 6.935 },
  { day: 32, date: "03-03", productiveFlow: 1.529 },
  { day: 33, date: "03-05", productiveFlow: 8.951 },
  { day: 34, date: "03-07", productiveFlow: 4.998 },
  { day: 35, date: "03-09", productiveFlow: 11.077 },
  { day: 36, date: "03-11", productiveFlow: 13.29 },
  { day: 37, date: "03-13", productiveFlow: 7.84 },
  { day: 38, date: "03-15", productiveFlow: 5.513 },
  { day: 39, date: "03-17", productiveFlow: 6.4 },
  { day: 40, date: "03-19", productiveFlow: 9.648 },
  { day: 41, date: "03-21", productiveFlow: 8.008 },
  { day: 42, date: "03-23", productiveFlow: 6.407 },
  { day: 43, date: "03-25", productiveFlow: 13.921 },
  { day: 44, date: "03-27", productiveFlow: 10.249 },
  { day: 45, date: "03-29", productiveFlow: 15.249 },
  { day: 46, date: "03-31", productiveFlow: 7.256 },
  { day: 47, date: "04-01", productiveFlow: 9.923 },
  { day: 48, date: "04-03", productiveFlow: 10.213 },
  { day: 49, date: "04-05", productiveFlow: 7.928 },
  { day: 50, date: "04-07", productiveFlow: 5.325 },
  { day: 51, date: "04-09", productiveFlow: 13.199 },
  { day: 52, date: "04-11", productiveFlow: 7.529 },
  { day: 53, date: "04-13", productiveFlow: 5.452 },
  { day: 54, date: "04-15", productiveFlow: 4.634 },
  { day: 55, date: "04-17", productiveFlow: 7.562 },
  { day: 56, date: "04-19", productiveFlow: 3.858 },
  { day: 57, date: "04-21", productiveFlow: 9.438 },
  { day: 58, date: "04-23", productiveFlow: 13.9 },
  { day: 59, date: "04-25", productiveFlow: 9.2 },
  { day: 60, date: "04-27", productiveFlow: 2.431 },
  { day: 61, date: "04-29", productiveFlow: 10.259 },
  { day: 62, date: "05-01", productiveFlow: 8.149 },
  { day: 63, date: "05-03", productiveFlow: 4.542 },
  { day: 64, date: "05-05", productiveFlow: 2.676 },
  { day: 65, date: "05-07", productiveFlow: 8.606 },
  { day: 66, date: "05-09", productiveFlow: 10.367 },
  { day: 67, date: "05-11", productiveFlow: 4.421 },
  { day: 68, date: "05-13", productiveFlow: 9.184 },
  { day: 69, date: "05-15", productiveFlow: 8.269 },
  { day: 70, date: "05-17", productiveFlow: 9.979 },
  { day: 71, date: "05-19", productiveFlow: 9.283 },
  { day: 72, date: "05-21", productiveFlow: 7.51 },
  { day: 73, date: "05-23", productiveFlow: 8.884 },
  { day: 74, date: "05-25", productiveFlow: 9.078 },
  { day: 75, date: "05-27", productiveFlow: 6.107 },
  { day: 76, date: "05-29", productiveFlow: 7.652 },
  { day: 77, date: "05-31", productiveFlow: 5.483 },
  { day: 78, date: "06-02", productiveFlow: 10.308 },
  { day: 79, date: "06-04", productiveFlow: 7.88 },
  { day: 80, date: "06-06", productiveFlow: 9.413 },
  { day: 81, date: "06-08", productiveFlow: 4.278 },
  { day: 82, date: "06-10", productiveFlow: 4.499 },
  { day: 83, date: "06-12", productiveFlow: 5.552 },
  { day: 84, date: "06-14", productiveFlow: 7.652 },
  { day: 85, date: "06-16", productiveFlow: 7.079 },
  { day: 86, date: "06-18", productiveFlow: 7.272 },
  { day: 87, date: "06-20", productiveFlow: 8.002 },
  { day: 88, date: "06-22", productiveFlow: 6.441 },
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
                "2024-05-13": 9.184,
        "2024-05-14": 8.873,
        "2024-05-15": 8.269,
        "2024-05-16": 4.075,
        "2024-05-17": 9.979,
        "2024-05-18": 6.565,
        "2024-05-19": 9.283
               "2024-05-20": 4.937,
        "2024-05-21": 7.51,
        "2024-05-22": 5.725,
        "2024-05-23": 8.884,
        "2024-05-24": 8.726,
        "2024-05-25": 9.078,
        "2024-05-26": 7.803
                "2024-05-27": 6.107,
        "2024-05-28": 8.452,
        "2024-05-29": 7.652,
        "2024-05-30": 7.254,
        "2024-05-31": 5.483,
        "2024-06-01": 6.844,
        "2024-06-02": 10.308
                "2024-06-03": 10.55,
        "2024-06-04": 7.88,
        "2024-06-05": 7.03,
        "2024-06-06": 9.413,
        "2024-06-07": 8.72,
        "2024-06-08": 4.278,
        "2024-06-09": 7.086
                "2024-06-10": 4.499,
        "2024-06-11": 10.918,
        "2024-06-12": 5.552,
        "2024-06-13": 7.872,
        "2024-06-14": 7.652,
        "2024-06-15": 11.234,
        "2024-06-16": 7.079
                "2024-06-17": 5.189,
        "2024-06-18": 7.272,
        "2024-06-19": 7.297,
        "2024-06-20": 8.002,
        "2024-06-21": 7.629,
        "2024-06-22": 6.441,
        "2024-06-23": 4.372
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

export const weeklyProductiveFlow2018: HistoricalWeeklyData[] = [
  { week: 1, date: "2018-07-16", productiveFlow: 6.485, flowPercentage: 0.078 },
  {
    week: 5,
    date: "2018-08-13",
    productiveFlow: 12.824,
    flowPercentage: 0.27403,
  },
  {
    week: 9,
    date: "2018-09-10",
    productiveFlow: 45.353,
    flowPercentage: 0.49296,
  },
  {
    week: 13,
    date: "2018-10-08",
    productiveFlow: 26.541,
    flowPercentage: 0.3274,
  },
  {
    week: 17,
    date: "2018-11-05",
    productiveFlow: 28.342,
    flowPercentage: 0.32195,
  },
  {
    week: 21,
    date: "2018-12-03",
    productiveFlow: 27.401,
    flowPercentage: 0.28511,
  },
  {
    week: 25,
    date: "2018-12-31",
    productiveFlow: 7.808,
    flowPercentage: 0.08824,
  },
  {
    week: 29,
    date: "2019-01-28",
    productiveFlow: 9.672,
    flowPercentage: 0.12711,
  },
  {
    week: 33,
    date: "2019-02-25",
    productiveFlow: 27.873,
    flowPercentage: 0.33668,
  },
  {
    week: 37,
    date: "2019-03-25",
    productiveFlow: 32.679,
    flowPercentage: 0.42044,
  },
  {
    week: 41,
    date: "2019-04-22",
    productiveFlow: 48.897,
    flowPercentage: 0.60691,
  },
  {
    week: 45,
    date: "2019-05-20",
    productiveFlow: 32.826,
    flowPercentage: 0.40754,
  },
  {
    week: 49,
    date: "2019-06-17",
    productiveFlow: 52.186,
    flowPercentage: 0.65889,
  },
  {
    week: 53,
    date: "2019-07-15",
    productiveFlow: 37.51,
    flowPercentage: 0.54171,
  },
  {
    week: 57,
    date: "2019-08-12",
    productiveFlow: 20.783,
    flowPercentage: 0.31142,
  },
  {
    week: 61,
    date: "2019-09-09",
    productiveFlow: 13.816,
    flowPercentage: 0.21801,
  },
  {
    week: 65,
    date: "2019-10-07",
    productiveFlow: 16.27,
    flowPercentage: 0.24331,
  },
  {
    week: 69,
    date: "2019-11-04",
    productiveFlow: 16.054,
    flowPercentage: 0.27906,
  },
  {
    week: 73,
    date: "2019-12-02",
    productiveFlow: 43.099,
    flowPercentage: 0.51216,
  },
  {
    week: 77,
    date: "2019-12-30",
    productiveFlow: 15.481,
    flowPercentage: 0.18296,
  },
  {
    week: 81,
    date: "2020-01-27",
    productiveFlow: 9.591,
    flowPercentage: 0.13328,
  },
  {
    week: 85,
    date: "2020-02-24",
    productiveFlow: 26.536,
    flowPercentage: 0.3798,
  },
  {
    week: 89,
    date: "2020-03-23",
    productiveFlow: 17.104,
    flowPercentage: 0.19428,
  },
  {
    week: 93,
    date: "2020-04-20",
    productiveFlow: 10.597,
    flowPercentage: 0.13081,
  },
  {
    week: 97,
    date: "2020-05-18",
    productiveFlow: 23.349,
    flowPercentage: 0.29572,
  },
  {
    week: 101,
    date: "2020-06-15",
    productiveFlow: 21.884,
    flowPercentage: 0.28766,
  },
  {
    week: 105,
    date: "2020-07-13",
    productiveFlow: 8.744,
    flowPercentage: 0.12589,
  },
  {
    week: 109,
    date: "2020-08-10",
    productiveFlow: 13.344,
    flowPercentage: 0.20031,
  },
  {
    week: 113,
    date: "2020-09-07",
    productiveFlow: 32.197,
    flowPercentage: 0.35209,
  },
  {
    week: 117,
    date: "2020-10-05",
    productiveFlow: 12.459,
    flowPercentage: 0.16644,
  },
  {
    week: 121,
    date: "2020-11-02",
    productiveFlow: 9.32,
    flowPercentage: 0.12547,
  },
  {
    week: 125,
    date: "2020-11-30",
    productiveFlow: 23.851,
    flowPercentage: 0.32264,
  },
  {
    week: 129,
    date: "2020-12-28",
    productiveFlow: 29.624,
    flowPercentage: 0.37735,
  },
  {
    week: 133,
    date: "2021-01-25",
    productiveFlow: 18.942,
    flowPercentage: 0.21672,
  },
  {
    week: 137,
    date: "2021-02-22",
    productiveFlow: 16.466,
    flowPercentage: 0.20758,
  },
  {
    week: 141,
    date: "2021-03-22",
    productiveFlow: 27.41,
    flowPercentage: 0.29358,
  },
  {
    week: 145,
    date: "2021-04-19",
    productiveFlow: 31.862,
    flowPercentage: 0.3374,
  },
  {
    week: 149,
    date: "2021-05-17",
    productiveFlow: 19.073,
    flowPercentage: 0.21818,
  },
  {
    week: 153,
    date: "2021-06-14",
    productiveFlow: 8.801,
    flowPercentage: 0.09097,
  },
  {
    week: 157,
    date: "2021-07-12",
    productiveFlow: 25.33,
    flowPercentage: 0.28247,
  },
  {
    week: 161,
    date: "2021-08-09",
    productiveFlow: 16.261,
    flowPercentage: 0.20083,
  },
  {
    week: 165,
    date: "2021-09-06",
    productiveFlow: 20.705,
    flowPercentage: 0.25454,
  },
  {
    week: 169,
    date: "2021-10-04",
    productiveFlow: 6.756,
    flowPercentage: 0.07791,
  },
  {
    week: 173,
    date: "2021-11-01",
    productiveFlow: 8.836,
    flowPercentage: 0.08831,
  },
  {
    week: 177,
    date: "2021-11-29",
    productiveFlow: 18.888,
    flowPercentage: 0.21547,
  },
  {
    week: 181,
    date: "2021-12-27",
    productiveFlow: 7.881,
    flowPercentage: 0.07453,
  },
  {
    week: 185,
    date: "2022-01-24",
    productiveFlow: 22.697,
    flowPercentage: 0.24806,
  },
  {
    week: 189,
    date: "2022-02-21",
    productiveFlow: 15.39,
    flowPercentage: 0.19835,
  },
  {
    week: 193,
    date: "2022-03-21",
    productiveFlow: 27.198,
    flowPercentage: 0.33236,
  },
  {
    week: 197,
    date: "2022-04-18",
    productiveFlow: 19.664,
    flowPercentage: 0.27669,
  },
  {
    week: 201,
    date: "2022-05-16",
    productiveFlow: 22.305,
    flowPercentage: 0.26294,
  },
  {
    week: 205,
    date: "2022-06-13",
    productiveFlow: 19.532,
    flowPercentage: 0.25928,
  },
  {
    week: 209,
    date: "2022-07-11",
    productiveFlow: 30.816,
    flowPercentage: 0.35127,
  },
  {
    week: 213,
    date: "2022-08-08",
    productiveFlow: 45.596,
    flowPercentage: 0.487,
  },
  {
    week: 217,
    date: "2022-09-05",
    productiveFlow: 33.854,
    flowPercentage: 0.34247,
  },
  {
    week: 221,
    date: "2022-10-03",
    productiveFlow: 32.902,
    flowPercentage: 0.35889,
  },
  {
    week: 225,
    date: "2022-10-31",
    productiveFlow: 38.869,
    flowPercentage: 0.40507,
  },
  {
    week: 229,
    date: "2022-11-28",
    productiveFlow: 41.396,
    flowPercentage: 0.41359,
  },
  {
    week: 233,
    date: "2022-12-26",
    productiveFlow: 26.22,
    flowPercentage: 0.28632,
  },
  {
    week: 237,
    date: "2023-01-23",
    productiveFlow: 27.424,
    flowPercentage: 0.27962,
  },
  {
    week: 241,
    date: "2023-02-20",
    productiveFlow: 31.199,
    flowPercentage: 0.34462,
  },
  {
    week: 245,
    date: "2023-03-20",
    productiveFlow: 35.024,
    flowPercentage: 0.37755,
  },
  {
    week: 249,
    date: "2023-04-17",
    productiveFlow: 33.544,
    flowPercentage: 0.39201,
  },
  {
    week: 253,
    date: "2023-05-15",
    productiveFlow: 54.027,
    flowPercentage: 0.54649,
  },
  {
    week: 257,
    date: "2023-06-12",
    productiveFlow: 49.611,
    flowPercentage: 0.53151,
  },
  {
    week: 261,
    date: "2023-07-10",
    productiveFlow: 24.109,
    flowPercentage: 0.27028,
  },
  {
    week: 265,
    date: "2023-08-07",
    productiveFlow: 24.134,
    flowPercentage: 0.24525,
  },
  {
    week: 269,
    date: "2023-09-04",
    productiveFlow: 40.249,
    flowPercentage: 0.42262,
  },
  {
    week: 273,
    date: "2023-10-02",
    productiveFlow: 48.506,
    flowPercentage: 0.50723,
  },
  {
    week: 277,
    date: "2023-10-30",
    productiveFlow: 27.336,
    flowPercentage: 0.30935,
  },
  {
    week: 281,
    date: "2023-11-27",
    productiveFlow: 19.309,
    flowPercentage: 0.21424,
  },
  {
    week: 285,
    date: "2023-12-25",
    productiveFlow: 25.426,
    flowPercentage: 0.27644,
  },
  {
    week: 289,
    date: "2024-01-22",
    productiveFlow: 66.441,
    flowPercentage: 0.63902,
  },
  {
    week: 293,
    date: "2024-02-19",
    productiveFlow: 52.257,
    flowPercentage: 0.5602,
  },
  {
    week: 297,
    date: "2024-03-18",
    productiveFlow: 57.511,
    flowPercentage: 0.56438,
  },
  {
    week: 301,
    date: "2024-04-15",
    productiveFlow: 48.722,
    flowPercentage: 0.5317,
  },
  {
    week: 305,
    date: "2024-05-13",
    productiveFlow: 58.402,
    flowPercentage: 0.57395,
  },
  {
    week: 309,
    date: "2024-06-10",
    productiveFlow: 53.86,
    flowPercentage: 0.57709,
  },
  {
    week: 313,
    date: "2024-07-08",
    productiveFlow: 51.102,
    flowPercentage: 0.53369,
  },
];

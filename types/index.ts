export interface HistoricalWeeklyData {
  week: number;
  date: string;
  p1HUT: number;
  p1HUTPercentage: number;
  movingAverage?: number;
  movingAveragePercentage?: number;
}

export interface HistoricalDailyData {
  day: number;
  date: string;
  p1HUT: number;
  movingAverage?: number;
}

export declare interface ChartData {
  date: string;
  oneHUT: number | null;
  p1HUT: number | null;
}

export declare interface MonthlyData {
  week: number;
  date: string;
  p1HUT: number;
  movingAverage?: number;
  movingAveragePercentage?: number;
}

export declare interface DailyData {
  day: string | number;
  p1HUT: number;
  movingAverage?: number;
}

export declare interface BarData {
  date: string;
  value: number | null;
}

export declare interface EfficiencyData {
  date: string;
  productiveTime: number | null;
  hoursFree: number | null;
}

type MetricKey =
  | "hoursFree"
  | "unplannedTime"
  | "oneHUT"
  | "p1HUT"
  | "n1HUT"
  | "nw1HUT"
  | "w1HUT"
  | "unproductiveTime"
  | "productiveTime"
  | "oneHUTEfficiency"
  | "efficiency"
  | "distraction_count";

export declare interface MetricData {
  metric: MetricNames;
  prevScore: number;
  score: number;
  percentageOfTarget: number;
  targetScore: string;
  color: TremorColors;
  tooltip?: string;
}

export declare interface MetricsResponse {
  unplannedTimeList: { [key: string]: number };
  oneHUTList: { [key: string]: number };
  p1HUTList: { [key: string]: number };
  n1HUTList: { [key: string]: number };
  nw1HUTList: { [key: string]: number };
  w1HUTList: { [key: string]: number };
  unproductiveList: { [key: string]: number };
  hoursFreeList: { [key: string]: number };
  distractionCountList: { [key: string]: number };
  efficiencyList: { [key: string]: number };
  productiveList: { [key: string]: number };
  flow: number;
  currentActivity: string;
  startDate: string;
  endDate: string;
  // efficiencyList: (presumably an array of numbers or a specific object structure)
}

export type TremorColors =
  | "slate"
  | "gray"
  | "zinc"
  | "neutral"
  | "stone"
  | "red"
  | "orange"
  | "amber"
  | "yellow"
  | "lime"
  | "green"
  | "emerald"
  | "teal"
  | "cyan"
  | "sky"
  | "blue"
  | "indigo"
  | "violet"
  | "purple"
  | "fuchsia"
  | "pink"
  | "rose"
  | undefined;

export const weekdays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export enum MetricNames {
  HOURS_FREE = "Hours Free",
  ONE_HUT = "Total Flow (hours)",
  UNPLANNED_TIME = "Unplanned Hours",
  DISTRACTION_COUNT = "Distraction #",
  P1HUT = "Productive Flow (h)",
  N1HUT = "Neutral Flow (hours)",
  UNPRODUCTIVE = "Unproductive Flow (hours)",
  ONE_HUT_EFFICIENCY = "% of Productive Flow",
  EFFICIENCY = "Efficiency (%)",
  PRODUCTIVITY = "Productive Hours",
}

export const metrics: MetricNames[] = [
  MetricNames.PRODUCTIVITY,
  MetricNames.HOURS_FREE,
  MetricNames.EFFICIENCY,
  MetricNames.UNPRODUCTIVE,
  MetricNames.UNPLANNED_TIME,
  MetricNames.P1HUT,
  MetricNames.ONE_HUT,
  MetricNames.ONE_HUT_EFFICIENCY,
  MetricNames.N1HUT,
  MetricNames.DISTRACTION_COUNT,
];

export const publicMetrics: MetricNames[] = [
  MetricNames.PRODUCTIVITY,
  MetricNames.EFFICIENCY,
  MetricNames.P1HUT,
  MetricNames.ONE_HUT_EFFICIENCY,
  MetricNames.UNPLANNED_TIME,
  MetricNames.DISTRACTION_COUNT,
];

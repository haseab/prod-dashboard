export declare interface ChartData {
  date: string;
  oneHUT: number | null;
  p1HUT: number | null;
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
  | "adhocTime"
  | "oneHUT"
  | "p1HUT"
  | "n1HUT"
  | "nw1HUT"
  | "w1HUT"
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
}

export declare interface MetricsResponse {
  adhocTimeList: { [key: string]: number };
  oneHUTList: { [key: string]: number };
  p1HUTList: { [key: string]: number };
  n1HUTList: { [key: string]: number };
  nw1HUTList: { [key: string]: number };
  w1HUTList: { [key: string]: number };
  hoursFreeList: { [key: string]: number };
  distractionCountList: { [key: string]: number };
  efficiencyList: { [key: string]: number };
  productiveList: { [key: string]: number };
  flow: boolean;
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
  ONE_HUT = "1HUT Time",
  AD_HOC_TIME = "Ad Hoc Time",
  DISTRACTION_COUNT = "Distraction #",
  P1HUT = "p1HUT",
  N1HUT = "n1HUT",
  W1HUT = "w1HUT",
  ONE_HUT_EFFICIENCY = "1HUT Efficiency",
  EFFICIENCY = "Efficiency",
  PRODUCTIVITY = "Productivity",
}

export const metrics: MetricNames[] = [
  MetricNames.PRODUCTIVITY,
  MetricNames.HOURS_FREE,
  MetricNames.EFFICIENCY,
  MetricNames.W1HUT,
  MetricNames.AD_HOC_TIME,
  MetricNames.P1HUT,
  MetricNames.ONE_HUT,
  MetricNames.ONE_HUT_EFFICIENCY,
  MetricNames.N1HUT,
  MetricNames.DISTRACTION_COUNT,
];

import { pile_history } from "@prisma/client";

export interface HistoricalWeeklyData {
  week: number;
  date: string;
  productiveFlow: number;
  flowPercentage: number;
  movingAverage?: number;
  movingAveragePercentage?: number;
}

export interface HistoricalDailyData {
  day: number;
  date: string;
  productiveFlow: number;
  movingAverage?: number;
}

export declare interface ChartData {
  date: string;
  totalFlow: number | null;
  productiveFlow: number | null;
}

export declare interface MonthlyData {
  week: number;
  date: string;
  productiveFlow: number;
  movingAverage?: number;
  movingAveragePercentage?: number;
}

export declare interface DailyData {
  day: string | number;
  productiveFlow: number;
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
  | "totalFlow"
  | "productiveFlow"
  | "n1HUT"
  | "nw1HUT"
  | "w1HUT"
  | "unproductiveTime"
  | "productiveTime"
  | "productiveFlowEfficiency"
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
  totalFlowList: { [key: string]: number };
  productiveFlowList: { [key: string]: number };
  n1HUTList: { [key: string]: number };
  nw1HUTList: { [key: string]: number };
  w1HUTList: { [key: string]: number };
  unproductiveList: { [key: string]: number };
  hoursFreeList: { [key: string]: number };
  distractionCountList: { [key: string]: number };
  efficiencyList: { [key: string]: number };
  productiveList: { [key: string]: number };
  flow: number;
  startDate: string;
  endDate: string;
  currentActivityStartTime: string;
  currentActivity: string;
  taskPile: number;
  pileHistory: pile_history[];
  pileRefreshesLeft: number;
  neutralActivity: boolean;
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
  TOTAL_FLOW = "Total Flow (hours)",
  UNPLANNED_TIME = "Unplanned Hours",
  DISTRACTION_COUNT = "Distraction #",
  PRODUCTIVE_FLOW = "Productive Flow (h)",
  N1HUT = "Neutral Flow (hours)",
  UNPRODUCTIVE = "Unproductive Flow (hours)",
  PRODUCTIVE_FLOW_EFFICIENCY = "Flow Efficiency (%)",
  EFFICIENCY = "Efficiency (%)",
  PRODUCTIVITY = "Productive Hours",
}

export const metrics: MetricNames[] = [
  MetricNames.PRODUCTIVITY,
  MetricNames.HOURS_FREE,
  MetricNames.EFFICIENCY,
  MetricNames.UNPRODUCTIVE,
  MetricNames.UNPLANNED_TIME,
  MetricNames.PRODUCTIVE_FLOW,
  MetricNames.TOTAL_FLOW,
  MetricNames.PRODUCTIVE_FLOW_EFFICIENCY,
  MetricNames.N1HUT,
  MetricNames.DISTRACTION_COUNT,
];

export const publicMetrics: MetricNames[] = [
  MetricNames.PRODUCTIVITY,
  MetricNames.EFFICIENCY,
  MetricNames.PRODUCTIVE_FLOW,
  MetricNames.PRODUCTIVE_FLOW_EFFICIENCY,
  MetricNames.UNPLANNED_TIME,
  MetricNames.DISTRACTION_COUNT,
];

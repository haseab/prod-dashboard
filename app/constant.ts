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

export declare interface MetricData {
  metric: string;
  score: number;
  percentageOfTarget: number;
  targetScore: string;
  color: string;
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

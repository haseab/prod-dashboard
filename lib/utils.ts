import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

import { targets, tooltips } from "@/app/constant";
import { MetricData, MetricNames, TremorColors } from "@/types";

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

export const formatToCurrentTimezone = (date: Date, timezone: string) => {
  const options: Record<string, string | boolean> = {
    timeZone: timezone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  };

  return new Intl.DateTimeFormat("en-US", options).format(date);
};

const getMetricsPercentage = ({
  partialNewMetricsData,
  inverse,
}: {
  partialNewMetricsData: MetricData;
  inverse: boolean;
}) => {
  if (inverse) {
    return roundToThree(
      Math.min(
        (parseFloat(targets[partialNewMetricsData.metric]) /
          partialNewMetricsData.score) *
          100,
        100
      )
    );
  }
  return roundToThree(
    Math.min(
      (partialNewMetricsData.score /
        parseFloat(targets[partialNewMetricsData.metric])) *
        100,
      100
    )
  );
};

export const getNewMetricsData = ({
  data,
  metricsData,
}: {
  data: any;
  metricsData: MetricData[];
}) => {
  return metricsData.map((metricData) => {
    const {
      unplannedTime,
      p1HUT,
      n1HUT,
      nw1HUT,
      w1HUT,
      hoursFree,
      distraction_count,
      productiveTime,
      flow,
    } = data;

    const partialNewMetricsData = {
      metric: metricData.metric,
      prevScore: metricData.score,
      score:
        metricData.metric === "Hours Free (h)"
          ? hoursFree
          : metricData.metric === "Total Flow Time (h)"
          ? p1HUT + n1HUT + nw1HUT + w1HUT
          : metricData.metric === "Unplanned Time (h)"
          ? unplannedTime
          : metricData.metric === "Distraction #"
          ? distraction_count
          : metricData.metric === "Productive Flow (h)"
          ? p1HUT
          : metricData.metric === "Neutral Flow (h)"
          ? n1HUT
          : metricData.metric === "Unproductive Flow (h)"
          ? w1HUT
          : metricData.metric === "Prod. Flow Efficiency (%)"
          ? roundToThree((p1HUT / hoursFree) * 100)
          : metricData.metric === "Efficiency (%)"
          ? roundToThree((productiveTime / hoursFree) * 100)
          : roundToThree(productiveTime),
      targetScore: targets[metricData.metric],
      percentageOfTarget: metricData.percentageOfTarget,
      color: metricData.color,
      tooltip: tooltips[metricData.metric],
    };

    const percentage = [
      MetricNames.HOURS_FREE,
      MetricNames.N1HUT,
    ].includes(metricData.metric) ? 100 : getMetricsPercentage({
      partialNewMetricsData,
      inverse: [
        MetricNames.UNPLANNED_TIME,
        MetricNames.DISTRACTION_COUNT,
        MetricNames.UNPRODUCTIVE,
      ].includes(metricData.metric),
    });

    return {
      ...partialNewMetricsData,
      percentageOfTarget: percentage,
      color: getColorForPercentage(percentage, flow),
    };
  });
};

export const sumValues = (obj: Record<string, number>) =>
  Object.values(obj).reduce((a, b) => a + b, 0);

export const getColorForPercentage = (
  percentage: number,
  flow: number
): TremorColors => {
  if (flow > 2.5) {
    if (percentage >= 95) return "red";
    if (percentage >= 80 && percentage < 95) return "orange";
    if (percentage >= 60 && percentage < 80) return "yellow";
    if (percentage >= 40 && percentage < 60) return "lime";
    if (percentage >= 20 && percentage < 40) return "cyan";
    if (percentage >= 0 && percentage < 20) return "blue";
    if (percentage === -1) return "gray";
  } else if (flow > 1.5) {
    if (percentage >= 95) return "purple";
    if (percentage >= 80 && percentage < 95) return "indigo";
    if (percentage >= 60 && percentage < 80) return "cyan";
    if (percentage >= 40 && percentage < 60) return "yellow";
    if (percentage >= 10 && percentage < 40) return "orange";
    if (percentage >= 0 && percentage < 10) return "red";
    if (percentage === -1) return "gray";
  } else if (flow > 0.8) {
    if (percentage >= 95) return "emerald";
    if (percentage >= 80 && percentage < 95) return "green";
    if (percentage >= 60 && percentage < 80) return "yellow";
    if (percentage >= 40 && percentage < 60) return "amber";
    if (percentage >= 15 && percentage < 40) return "orange";
    if (percentage >= 0 && percentage < 15) return "red";
    if (percentage === -1) return "gray";
  } else {
    if (percentage >= 95) return "purple";
    if (percentage >= 80 && percentage < 95) return "indigo";
    if (percentage >= 60 && percentage < 80) return "cyan";
    if (percentage >= 40 && percentage < 60) return "yellow";
    if (percentage >= 10 && percentage < 40) return "orange";
    if (percentage >= 0 && percentage < 10) return "red";
    if (percentage === -1) return "gray";
  }
  return "red";
};

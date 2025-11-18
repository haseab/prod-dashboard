"use client";

import AreaGraph from "@/components/area";
import { task_backlog } from "@prisma/client";
import { useMemo } from "react";

interface TaskBacklogChartProps {
  taskBacklogHistory: Pick<task_backlog, "id" | "amount" | "createdAt">[];
  flow: number;
  showOnlyMA: boolean;
  taskBacklogRefreshesLeft: number;
  neutralActivity: boolean;
}

// Calculate linear regression (line of best fit) from data points
function calculateLinearRegression(dataPoints: { x: number; y: number }[]): {
  slope: number;
  intercept: number;
} {
  const n = dataPoints.length;
  if (n < 2) {
    return { slope: 0, intercept: dataPoints[0]?.y || 0 };
  }

  const sumX = dataPoints.reduce((sum, p) => sum + p.x, 0);
  const sumY = dataPoints.reduce((sum, p) => sum + p.y, 0);
  const sumXY = dataPoints.reduce((sum, p) => sum + p.x * p.y, 0);
  const sumXX = dataPoints.reduce((sum, p) => sum + p.x * p.x, 0);

  const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
  const intercept = (sumY - slope * sumX) / n;

  return { slope, intercept };
}

export default function TaskBacklogChart({
  taskBacklogHistory,
  flow,
  showOnlyMA,
  taskBacklogRefreshesLeft,
  neutralActivity,
}: TaskBacklogChartProps) {
  const chartData = useMemo(() => {
    if (taskBacklogHistory.length === 0) return [];

    // Group data into 4-hour intervals and calculate averages
    const FOUR_HOURS = 4 * 60 * 60 * 1000; // milliseconds in 4 hours
    const grouped = new Map<
      number,
      { amounts: number[]; timestamps: number[] }
    >();

    taskBacklogHistory.forEach((item) => {
      const timestamp = new Date(item.createdAt).getTime();
      const intervalStart = Math.floor(timestamp / FOUR_HOURS) * FOUR_HOURS;

      if (!grouped.has(intervalStart)) {
        grouped.set(intervalStart, { amounts: [], timestamps: [] });
      }
      grouped.get(intervalStart)!.amounts.push(item.amount);
      grouped.get(intervalStart)!.timestamps.push(timestamp);
    });

    // Convert to array and calculate averages
    const baseData = Array.from(grouped.entries())
      .sort(([a], [b]) => a - b)
      .map(([intervalStart, data], index, array) => {
        const avgAmount =
          data.amounts.reduce((sum, val) => sum + val, 0) / data.amounts.length;
        const avgTimestamp =
          data.timestamps.reduce((sum, val) => sum + val, 0) /
          data.timestamps.length;
        const date = new Date(avgTimestamp);

        return {
          day: `interval-${intervalStart}`,
          "hours of planned tasks left": avgAmount,
          date:
            index === array.length - 1
              ? "LIVE"
              : `${date.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })} ${date.toLocaleTimeString("en-GB", {
                  hour: "numeric",
                  minute: "2-digit",
                  hour12: true,
                })}`,
          timestamp: avgTimestamp,
          amount: avgAmount,
        };
      });

    if (baseData.length === 0) return baseData;

    // Get the last 7 days of data for linear regression
    const now = Date.now();
    const sevenDaysAgo = now - 7 * 24 * 60 * 60 * 1000;
    const recentData = baseData.filter(
      (item) =>
        item.timestamp >= sevenDaysAgo &&
        item.amount !== null &&
        item.amount !== undefined
    );

    const currentBacklog = baseData[baseData.length - 1]?.amount || 0;
    const currentTimestamp = baseData[baseData.length - 1].timestamp;
    const idealBurndownRate = 8; // hours per day

    // Calculate projected line using linear regression on last 7 days
    let projectedSlope = 0;
    let projectedIntercept = currentBacklog;

    if (recentData.length >= 2) {
      const recentFirstTimestamp = recentData[0].timestamp;
      const regressionPoints = recentData.map((item) => ({
        x: (item.timestamp - recentFirstTimestamp) / (24 * 60 * 60 * 1000),
        y: item.amount,
      }));

      const regression = calculateLinearRegression(regressionPoints);
      projectedSlope = regression.slope;
      projectedIntercept = regression.intercept;
    }

    // Add burndown values to existing data points
    const dataWithBurndown = baseData.map((item) => {
      const daysFromCurrent =
        (item.timestamp - currentTimestamp) / (24 * 60 * 60 * 1000);

      // Ideal: starts from current point, 8 hr/day
      const idealValue =
        daysFromCurrent >= 0
          ? Math.max(0, currentBacklog - daysFromCurrent * idealBurndownRate)
          : null;

      // Projected: line of best fit from last 7 days
      let projectedValue = null;
      if (recentData.length >= 2) {
        const recentFirstTimestamp = recentData[0].timestamp;
        const daysFromRecentFirst =
          (item.timestamp - recentFirstTimestamp) / (24 * 60 * 60 * 1000);
        if (daysFromRecentFirst >= 0) {
          projectedValue = Math.max(
            0,
            projectedSlope * daysFromRecentFirst + projectedIntercept
          );
        }
      }

      return {
        ...item,
        "ideal burndown": idealValue,
        "projected burndown": projectedValue,
      };
    });

    // Add future projection points (extend both lines to zero) in 4-hour intervals
    const futurePoints = [];
    const lastTimestamp = baseData[baseData.length - 1].timestamp;

    // Calculate how far to extend
    const daysToZeroIdeal = currentBacklog / idealBurndownRate;
    const daysToZeroProjected =
      projectedSlope < 0
        ? -projectedIntercept / projectedSlope
        : daysToZeroIdeal;
    const maxDays = Math.min(
      Math.ceil(Math.max(daysToZeroIdeal, daysToZeroProjected)),
      60
    );

    // Generate future points at 4-hour intervals
    const maxFutureTimestamp = lastTimestamp + maxDays * 24 * 60 * 60 * 1000;
    let futureTimestamp = lastTimestamp + FOUR_HOURS;
    let intervalIndex = 1;

    while (futureTimestamp <= maxFutureTimestamp) {
      const futureDate = new Date(futureTimestamp);
      const futureDateStr = `${futureDate.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      })} ${futureDate.toLocaleTimeString("en-GB", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      })}`;

      const daysFromCurrent =
        (futureTimestamp - currentTimestamp) / (24 * 60 * 60 * 1000);
      const idealValue = Math.max(
        0,
        currentBacklog - daysFromCurrent * idealBurndownRate
      );

      const recentFirstTimestamp = recentData[0]?.timestamp || currentTimestamp;
      const daysFromRecentFirst =
        (futureTimestamp - recentFirstTimestamp) / (24 * 60 * 60 * 1000);
      const projectedValue = Math.max(
        0,
        projectedSlope * daysFromRecentFirst + projectedIntercept
      );

      futurePoints.push({
        day: `future-${intervalIndex}`,
        "hours of planned tasks left": null,
        date: futureDateStr,
        timestamp: futureTimestamp,
        amount: null,
        "ideal burndown": idealValue,
        "projected burndown": projectedValue,
      });

      // Stop if both lines reached zero
      if (idealValue === 0 && projectedValue === 0) break;

      futureTimestamp += FOUR_HOURS;
      intervalIndex++;
    }

    return [...dataWithBurndown, ...futurePoints];
  }, [taskBacklogHistory]);

  return (
    <AreaGraph
      data={chartData}
      className="h-[40vh]"
      title={"Hours of Planned Tasks Left (h)"}
      categories={[
        "hours of planned tasks left",
        "projected burndown",
        "ideal burndown",
      ]}
      colors={
        showOnlyMA
          ? ["slate", "gray", "zinc"]
          : flow > 2.5
          ? ["red", "gray", "zinc"]
          : flow > 1.5
          ? ["fuchsia", "gray", "zinc"]
          : flow > 0.8334
          ? ["emerald", "gray", "zinc"]
          : ["blue", "gray", "zinc"]
      }
      index={"date"}
      minutesLeft={taskBacklogRefreshesLeft / 4}
      timeUnits="minutes"
      liveCategory="hours of planned tasks left"
      neutralActivity={neutralActivity}
      tooltip={
        "This graph shows the status of how many hours of planned work is left on my to-do list. It refreshes every hour and if it goes down it means I'm completing more tasks than planning, and vice versa.\nI track this because this is single handedly the most useful metric for me to know if I'm moving the needle toward my goals. This is because my planned tasks are essentially my theory of the qucikest steps required to get closer to my goals, and if I can do what I say I will do, that's a good sign."
      }
    />
  );
}

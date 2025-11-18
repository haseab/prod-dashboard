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

    console.log("📈 TaskBacklogChart Debug:");
    console.log("  - Total history entries:", taskBacklogHistory.length);
    console.log(
      "  - Last 3 entries:",
      taskBacklogHistory
        .slice(-3)
        .map((h) => ({ amount: h.amount, date: h.createdAt }))
    );

    // Separate the LIVE point (last entry) from historical data
    const livePoint = taskBacklogHistory[taskBacklogHistory.length - 1];
    const historicalData = taskBacklogHistory.slice(0, -1);

    // Group historical data into 4-hour intervals and calculate averages
    const FOUR_HOURS = 4 * 60 * 60 * 1000; // milliseconds in 4 hours
    const grouped = new Map<
      number,
      { amounts: number[]; timestamps: number[] }
    >();

    historicalData.forEach((item) => {
      const timestamp = new Date(item.createdAt).getTime();
      const intervalStart = Math.floor(timestamp / FOUR_HOURS) * FOUR_HOURS;

      if (!grouped.has(intervalStart)) {
        grouped.set(intervalStart, { amounts: [], timestamps: [] });
      }
      grouped.get(intervalStart)!.amounts.push(item.amount);
      grouped.get(intervalStart)!.timestamps.push(timestamp);
    });

    // Convert to array and calculate averages for historical data
    const historicalBaseData = Array.from(grouped.entries())
      .sort(([a], [b]) => a - b)
      .map(([intervalStart, data]) => {
        const avgAmount =
          data.amounts.reduce((sum, val) => sum + val, 0) / data.amounts.length;
        const avgTimestamp =
          data.timestamps.reduce((sum, val) => sum + val, 0) /
          data.timestamps.length;
        const date = new Date(avgTimestamp);

        return {
          day: `interval-${intervalStart}`,
          "hours of planned tasks left": avgAmount,
          date: `${date.toLocaleDateString("en-US", {
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

    // Add the LIVE point as-is (not aggregated)
    const liveTimestamp = new Date(livePoint.createdAt).getTime();
    const baseData = [
      ...historicalBaseData,
      {
        day: `live-${livePoint.id}`,
        "hours of planned tasks left": livePoint.amount,
        date: "LIVE",
        timestamp: liveTimestamp,
        amount: livePoint.amount,
      },
    ];

    if (baseData.length === 0) return baseData;

    // Get data for linear regression (last 7 days if available, otherwise all available data)
    const now = Date.now();
    const sevenDaysAgo = now - 7 * 24 * 60 * 60 * 1000;
    const firstDataTimestamp = baseData[0].timestamp;

    // Use all available data if we have less than 7 days
    const regressionStartTime = Math.max(sevenDaysAgo, firstDataTimestamp);
    const recentData = baseData.filter(
      (item) =>
        item.timestamp >= regressionStartTime &&
        item.amount !== null &&
        item.amount !== undefined
    );

    const currentBacklog = baseData[baseData.length - 1]?.amount || 0;
    const currentTimestamp = baseData[baseData.length - 1].timestamp;
    const idealBurndownRate = 6; // hours per day

    console.log("  - After 4hr aggregation, entries:", baseData.length);
    console.log("  - Current backlog (last point):", currentBacklog);
    console.log("  - Last aggregated point:", baseData[baseData.length - 1]);

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
    const dataWithBurndown = baseData.map((item, index) => {
      const daysFromCurrent =
        (item.timestamp - currentTimestamp) / (24 * 60 * 60 * 1000);

      // Ideal: starts from current point, 6 hr/day
      let idealValue = null;
      if (daysFromCurrent >= 0) {
        const calculated = currentBacklog - daysFromCurrent * idealBurndownRate;
        idealValue = calculated > 0 ? calculated : null;
      }

      // Projected: only show at the very last point, null for all historical data
      const isLastPoint = index === baseData.length - 1;
      const projectedValue = isLastPoint ? currentBacklog : null;

      return {
        ...item,
        "ideal burndown": idealValue,
        "projected burndown": projectedValue,
      };
    });

    // Add future projection points (extend both lines to zero) in 4-hour intervals
    const futurePoints = [];
    const lastTimestamp = baseData[baseData.length - 1].timestamp;

    // Calculate how far to extend - no limit, go until projected reaches 0
    const daysToZeroIdeal = currentBacklog / idealBurndownRate;
    const daysToZeroProjected =
      projectedSlope < 0
        ? -projectedIntercept / projectedSlope
        : daysToZeroIdeal * 2; // If slope is positive, extend further
    const maxDays = Math.ceil(Math.max(daysToZeroIdeal, daysToZeroProjected));

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
      const idealCalculated =
        currentBacklog - daysFromCurrent * idealBurndownRate;
      const idealValue = idealCalculated > 0 ? idealCalculated : null;

      // Projected: extend from current backlog using the calculated slope
      const projectedCalculated =
        currentBacklog + projectedSlope * daysFromCurrent;
      const projectedValue =
        projectedCalculated > 0 ? projectedCalculated : null;

      futurePoints.push({
        day: `future-${intervalIndex}`,
        "hours of planned tasks left": null,
        date: futureDateStr,
        timestamp: futureTimestamp,
        amount: null,
        "ideal burndown": idealValue,
        "projected burndown": projectedValue,
      });

      // Stop if both lines reached zero (null)
      if (idealValue === null && projectedValue === null) break;

      futureTimestamp += FOUR_HOURS;
      intervalIndex++;
    }

    const finalData = [...dataWithBurndown, ...futurePoints];
    console.log("  - Final chart data length:", finalData.length);
    console.log("  - Last data point:", finalData[finalData.length - 1]);
    console.log("  - Second to last:", finalData[finalData.length - 2]);

    return finalData;
  }, [taskBacklogHistory]);

  // Calculate projected burndown color based on slope comparison
  const projectedBurndownColor = useMemo(() => {
    if (chartData.length < 2) return "gray";

    const now = Date.now();
    const sevenDaysAgo = now - 7 * 24 * 60 * 60 * 1000;
    const firstDataTimestamp = chartData[0].timestamp;
    const regressionStartTime = Math.max(sevenDaysAgo, firstDataTimestamp);

    const recentData = chartData.filter(
      (item) =>
        item.timestamp >= regressionStartTime &&
        item.amount !== null &&
        item.amount !== undefined
    );

    if (recentData.length < 2) return "gray";

    // Calculate projected slope (hours per day)
    const firstPoint = recentData[0];
    const lastPoint = recentData[recentData.length - 1];

    if (!firstPoint.amount || !lastPoint.amount) return "gray";

    const daysDiff =
      (lastPoint.timestamp - firstPoint.timestamp) / (24 * 60 * 60 * 1000);
    const projectedSlope = (lastPoint.amount - firstPoint.amount) / daysDiff;

    const idealBurndownRate = -6; // negative because we want decline

    // If projected slope is more negative (faster decline), it's better (green)
    // If projected slope is less negative (slower decline), it's worse (red)
    return projectedSlope < idealBurndownRate ? "emerald" : "red";
  }, [chartData]);

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
          ? ["slate", projectedBurndownColor, "zinc"]
          : flow > 2.5
          ? ["red", projectedBurndownColor, "zinc"]
          : flow > 1.5
          ? ["fuchsia", projectedBurndownColor, "zinc"]
          : flow > 0.8334
          ? ["emerald", projectedBurndownColor, "zinc"]
          : ["blue", projectedBurndownColor, "zinc"]
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

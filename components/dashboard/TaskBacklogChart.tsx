"use client";

import AreaGraph from "@/components/area";
import { task_backlog } from "@prisma/client";
import { useMemo } from "react";

interface TaskBacklogChartProps {
  taskBacklogHistory: Pick<task_backlog, "id" | "amount" | "createdAt" | "deadline">[];
  flow: number;
  showOnlyMA: boolean;
  taskBacklogRefreshesLeft: number;
  neutralActivity: boolean;
  dailyIdealBurndown?: { [key: string]: number };
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
  dailyIdealBurndown = {},
}: TaskBacklogChartProps) {
  const chartData = useMemo(() => {
    if (taskBacklogHistory.length === 0) return [];

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

    // Get data for linear regression (last 1 day if available, otherwise all available data)
    const now = Date.now();
    const threeDaysAgo = now - 1 * 24 * 60 * 60 * 1000;
    const firstDataTimestamp = baseData[0].timestamp;

    // Use all available data if we have less than 1 day
    const regressionStartTime = Math.max(threeDaysAgo, firstDataTimestamp);
    const recentData = baseData.filter(
      (item) =>
        item.timestamp >= regressionStartTime &&
        item.amount !== null &&
        item.amount !== undefined
    );

    const currentBacklog = baseData[baseData.length - 1]?.amount || 0;
    const currentTimestamp = baseData[baseData.length - 1].timestamp;

    // Helper function to get ideal burndown rate for a given timestamp (4-hour interval)
    const getIdealBurndownRate = (timestamp: number): number => {
      const date = new Date(timestamp);
      const dateStr = date.toISOString().split("T")[0]; // YYYY-MM-DD format
      const dailyRate = dailyIdealBurndown[dateStr] ?? 6; // Default to 6 if not found
      // Convert daily rate to 4-hour interval rate (1 day = 6 intervals of 4 hours)
      return dailyRate / 6;
    };

    // Calculate projected line using linear regression on last 1 day
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

      // Ideal: starts from current point, using 4-hour interval rates
      let idealValue = null;
      if (daysFromCurrent >= 0) {
        let remainingBacklog = currentBacklog;
        // Calculate number of 4-hour intervals from current point
        const intervalCount = Math.floor((daysFromCurrent * 24) / 4);
        for (let i = 0; i < intervalCount && remainingBacklog > 0; i++) {
          const checkTimestamp = currentTimestamp + i * 4 * 60 * 60 * 1000;
          const intervalRate = getIdealBurndownRate(checkTimestamp);
          remainingBacklog = Math.max(0, remainingBacklog - intervalRate);
        }
        idealValue = remainingBacklog > 0 ? remainingBacklog : null;
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

    // Calculate how far to extend - estimate based on average daily rate
    const avgDailyRate =
      Object.values(dailyIdealBurndown).length > 0
        ? Object.values(dailyIdealBurndown).reduce((a, b) => a + b, 0) /
          Object.values(dailyIdealBurndown).length
        : 6; // Default to 6 if no rates available
    const daysToZeroIdeal = currentBacklog / avgDailyRate;
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

      // Calculate cumulative burndown using 4-hour interval rates for future points
      let remainingBacklog = currentBacklog;
      const intervalCount = Math.floor((daysFromCurrent * 24) / 4);

      for (let i = 0; i < intervalCount && remainingBacklog > 0; i++) {
        const checkTimestamp = currentTimestamp + i * 4 * 60 * 60 * 1000;
        const intervalRate = getIdealBurndownRate(checkTimestamp);
        remainingBacklog = Math.max(0, remainingBacklog - intervalRate);
      }

      const idealValue = remainingBacklog > 0 ? remainingBacklog : null;

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

    let finalData = [...dataWithBurndown, ...futurePoints];

    // Insert deadline point if it exists
    const deadlines = taskBacklogHistory
      .map(item => item.deadline)
      .filter((d): d is Date => d !== null && d !== undefined);

    if (deadlines.length > 0) {
      const latestTimestamp = Math.max(...deadlines.map(d => new Date(d).getTime()));
      const deadlineDate = new Date(latestTimestamp);
      const deadlineTimestamp = deadlineDate.getTime();

      // Find where to insert the deadline in the data
      const insertIndex = finalData.findIndex(item => item.timestamp > deadlineTimestamp);

      if (insertIndex !== -1) {
        const deadlineStr = `${deadlineDate.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        })} ${deadlineDate.toLocaleTimeString("en-GB", {
          hour: "numeric",
          minute: "2-digit",
          hour12: true,
        })}`;

        // Get interpolated values for the deadline point
        const prevPoint = finalData[insertIndex - 1];
        const nextPoint = finalData[insertIndex];

        const deadlinePoint = {
          day: `deadline-point`,
          "hours of planned tasks left": null,
          date: deadlineStr,
          timestamp: deadlineTimestamp,
          amount: null,
          "ideal burndown": prevPoint && nextPoint ?
            prevPoint["ideal burndown"] : null,
          "projected burndown": prevPoint && nextPoint ?
            prevPoint["projected burndown"] : null,
        };

        // Insert the deadline point
        finalData = [
          ...finalData.slice(0, insertIndex),
          deadlinePoint,
          ...finalData.slice(insertIndex)
        ];

        console.log("TaskBacklogChart - Inserted deadline point at index", insertIndex, deadlinePoint);
      }
    }

    return finalData;
  }, [taskBacklogHistory, dailyIdealBurndown]);

  // Calculate projected burndown color based on slope comparison
  const projectedBurndownColor = useMemo(() => {
    if (chartData.length < 2) return "gray";

    const now = Date.now();
    const threeDaysAgo = now - 1 * 24 * 60 * 60 * 1000;
    const firstDataTimestamp = chartData[0].timestamp;
    const regressionStartTime = Math.max(threeDaysAgo, firstDataTimestamp);

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

    // If projected slope is positive (backlog growing), it's red
    // If projected slope is more negative (faster decline), it's better (green)
    // If projected slope is less negative (slower decline), it's worse (red)
    return projectedSlope >= 0 || projectedSlope >= idealBurndownRate ? "red" : "emerald";
  }, [chartData]);

  // Find the latest deadline from the task backlog history
  const latestDeadline = useMemo(() => {
    console.log("TaskBacklogChart - taskBacklogHistory:", taskBacklogHistory);
    const deadlines = taskBacklogHistory
      .map(item => item.deadline)
      .filter((d): d is Date => d !== null && d !== undefined);

    console.log("TaskBacklogChart - filtered deadlines:", deadlines);

    if (deadlines.length === 0) {
      console.log("TaskBacklogChart - No deadlines found");
      return null;
    }

    // Convert to timestamps and find the max
    const latestTimestamp = Math.max(...deadlines.map(d => new Date(d).getTime()));
    const deadline = new Date(latestTimestamp);
    console.log("TaskBacklogChart - Latest deadline:", deadline);
    return deadline;
  }, [taskBacklogHistory]);

  // Create reference line for deadline and zero intersections
  const referenceLines = useMemo(() => {
    console.log("TaskBacklogChart - Computing reference lines");
    console.log("TaskBacklogChart - Chart data length:", chartData.length);

    const lines: Array<{ x?: string | number; y?: number; label?: string; color?: string; strokeWidth?: number }> = [];

    // Add deadline reference line
    if (latestDeadline) {
      const deadlineDate = new Date(latestDeadline);
      const deadlineStr = `${deadlineDate.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      })} ${deadlineDate.toLocaleTimeString("en-GB", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      })}`;

      console.log("TaskBacklogChart - Deadline string for chart:", deadlineStr);
      console.log("TaskBacklogChart - Available chart dates:", chartData.map(d => d.date));

      lines.push({
        x: deadlineStr,
        label: "DEADLINE",
        color: "#ef4444",
        strokeWidth: 2,
      });

      console.log("TaskBacklogChart - Reference line config:", lines[0]);
    }

    // Find where projected burndown hits zero
    console.log("TaskBacklogChart - Looking for projected zero point");

    // Log some sample values to understand the data
    const projectedValues = chartData
      .filter(item => "projected burndown" in item && item["projected burndown"] !== null && item["projected burndown"] !== undefined)
      .slice(-10);
    console.log("TaskBacklogChart - Last 10 projected burndown values:",
      projectedValues.map(item => ({ date: item.date, value: "projected burndown" in item ? item["projected burndown"] : null }))
    );

    const projectedZeroPoint = chartData.find((item, index) => {
      if (index === 0) return false;
      const prev = chartData[index - 1];

      // Check if previous had a positive value and current is null (line stopped because it hit zero)
      const crossesViaNull = (
        "projected burndown" in prev &&
        prev["projected burndown"] !== null &&
        prev["projected burndown"] !== undefined &&
        prev["projected burndown"] > 0 &&
        (!("projected burndown" in item) || item["projected burndown"] === null || item["projected burndown"] === undefined)
      );

      // Check if it explicitly crosses zero (value goes from positive to zero/negative)
      const crossesExplicitly = (
        "projected burndown" in prev &&
        prev["projected burndown"] !== null &&
        prev["projected burndown"] !== undefined &&
        prev["projected burndown"] > 0 &&
        "projected burndown" in item &&
        item["projected burndown"] !== null &&
        item["projected burndown"] !== undefined &&
        item["projected burndown"] <= 0
      );

      const crosses = crossesViaNull || crossesExplicitly;

      if (crosses) {
        console.log("TaskBacklogChart - Found projected zero at:", item.date, "prev value:",
          "projected burndown" in prev ? prev["projected burndown"] : null,
          "current value:",
          "projected burndown" in item ? item["projected burndown"] : null);
      }

      return crosses;
    });

    // Find where ideal burndown hits zero
    console.log("TaskBacklogChart - Looking for ideal zero point");

    // Log some sample values to understand the data
    const idealValues = chartData
      .filter(item => "ideal burndown" in item && item["ideal burndown"] !== null && item["ideal burndown"] !== undefined)
      .slice(-10);
    console.log("TaskBacklogChart - Last 10 ideal burndown values:",
      idealValues.map(item => ({ date: item.date, value: "ideal burndown" in item ? item["ideal burndown"] : null }))
    );

    const idealZeroPoint = chartData.find((item, index) => {
      if (index === 0) return false;
      const prev = chartData[index - 1];

      // Check if previous had a positive value and current is null (line stopped because it hit zero)
      const crossesViaNull = (
        "ideal burndown" in prev &&
        prev["ideal burndown"] !== null &&
        prev["ideal burndown"] !== undefined &&
        prev["ideal burndown"] > 0 &&
        (!("ideal burndown" in item) || item["ideal burndown"] === null || item["ideal burndown"] === undefined)
      );

      // Check if it explicitly crosses zero (value goes from positive to zero/negative)
      const crossesExplicitly = (
        "ideal burndown" in prev &&
        prev["ideal burndown"] !== null &&
        prev["ideal burndown"] !== undefined &&
        prev["ideal burndown"] > 0 &&
        "ideal burndown" in item &&
        item["ideal burndown"] !== null &&
        item["ideal burndown"] !== undefined &&
        item["ideal burndown"] <= 0
      );

      const crosses = crossesViaNull || crossesExplicitly;

      if (crosses) {
        console.log("TaskBacklogChart - Found ideal zero at:", item.date, "prev value:",
          "ideal burndown" in prev ? prev["ideal burndown"] : null,
          "current value:",
          "ideal burndown" in item ? item["ideal burndown"] : null);
      }

      return crosses;
    });

    console.log("TaskBacklogChart - Projected zero point:", projectedZeroPoint);
    console.log("TaskBacklogChart - Ideal zero point:", idealZeroPoint);

    // Add projected zero intersection label (no vertical line)
    if (projectedZeroPoint) {
      // Find the point right before this one (the last positive value)
      const projectedIndex = chartData.findIndex(item => item === projectedZeroPoint);
      const lastPositivePoint = projectedIndex > 0 ? chartData[projectedIndex - 1] : projectedZeroPoint;

      console.log("TaskBacklogChart - Adding projected reference line at x:", lastPositivePoint.date);
      lines.push({
        x: lastPositivePoint.date,
        label: lastPositivePoint.date,
        color: projectedBurndownColor === "emerald" ? "#10b981" : "#ef4444",
        strokeWidth: 0, // No vertical line
      });
    }

    // Add ideal zero intersection label (no vertical line)
    if (idealZeroPoint) {
      // Find the point right before this one (the last positive value)
      const idealIndex = chartData.findIndex(item => item === idealZeroPoint);
      const lastPositivePoint = idealIndex > 0 ? chartData[idealIndex - 1] : idealZeroPoint;

      console.log("TaskBacklogChart - Adding ideal reference line at x:", lastPositivePoint.date);
      lines.push({
        x: lastPositivePoint.date,
        label: lastPositivePoint.date,
        color: "#71717a",
        strokeWidth: 0, // No vertical line
      });
    }

    console.log("TaskBacklogChart - Total reference lines:", lines.length);
    console.log("TaskBacklogChart - Reference lines:", lines);

    return lines;
  }, [latestDeadline, chartData, projectedBurndownColor]);

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
      referenceLines={referenceLines}
      tooltip={
        "This graph shows the status of how many hours of planned work is left on my to-do list. It refreshes every hour and if it goes down it means I'm completing more tasks than planning, and vice versa.\nI track this because this is single handedly the most useful metric for me to know if I'm moving the needle toward my goals. This is because my planned tasks are essentially my theory of the qucikest steps required to get closer to my goals, and if I can do what I say I will do, that's a good sign."
      }
    />
  );
}

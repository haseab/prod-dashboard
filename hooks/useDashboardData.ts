"use client";

import { weeklyProductiveFlow as weeklyProductiveFlowConstant } from "@/app/constant";
import {
  getNewMetricsData,
  roundToThree,
  simpleMovingAverage,
  sumValues,
} from "@/lib/utils";
import {
  BarData,
  ChartData,
  EfficiencyData,
  MetricData,
  MetricsResponse,
  MonthlyData,
  publicMetrics,
  weekdays,
} from "@/types";
import { task_backlog } from "@prisma/client";
import cuid from "cuid";
import { unstable_noStore } from "next/cache";
import { useCallback, useEffect, useRef, useState } from "react";

const SERVER_ERROR_MESSAGE = "Server error: trying again in 30 seconds...";
const WEEKLY_INTERVAL = 4;

export function useDashboardData() {
  const [showConfetti, setShowConfetti] = useState(false);
  const [flow, setFlow] = useState(0);
  const [error, setError] = useState("");
  const lastFetchTimeRef = useRef(Date.now());
  const [taskBacklogRefreshesLeft, setTaskBacklogRefreshesLeft] = useState(0);

  const [efficiencyData, setEfficiencyData] = useState<EfficiencyData[]>(
    weekdays.map((day) => ({
      date: day,
      productiveTime: null,
      hoursFree: null,
    }))
  );
  const [distractionData, setDistractionData] = useState<BarData[]>(
    weekdays.map((day) => ({ date: day, value: null }))
  );
  const [unplannedData, setUnplannedData] = useState<BarData[]>(
    weekdays.map((day) => ({ date: day, value: null }))
  );
  const [dailyProductiveFlowData, setDailyProductiveFlowData] = useState<
    ChartData[]
  >(
    weekdays.map((day) => ({
      date: day,
      totalFlow: null,
      productiveFlow: null,
    }))
  );
  const [metricsData, setMetricsData] = useState<MetricData[]>(
    publicMetrics.map((metric) => ({
      metric,
      prevScore: 0,
      score: 0,
      percentageOfTarget: 0,
      targetScore: "100",
      color: "blue",
      tooltip: "",
    }))
  );
  const [weeklyProductiveFlowData, setWeeklyProductiveFlowData] = useState<
    MonthlyData[]
  >(weeklyProductiveFlowConstant.map((item) => ({ ...item }))); // Initialized with a copy of the constant
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [currentActivity, setCurrentActivity] = useState("Loading ...");
  const [currentActivityStartTime, setCurrentActivityStartTime] = useState("");
  const [taskBacklogHistory, setTaskBacklogHistory] = useState<
    Pick<task_backlog, "id" | "amount" | "createdAt">[]
  >([]);
  const [neutralActivity, setNeutralActivity] = useState(false);

  const fetchData = useCallback(
    async (errorMessage: string) => {
      const url = `${process.env.NEXT_PUBLIC_SERVER_URL}/api/metrics`;
      try {
        console.log("fetching data from server (custom hook)...");
        console.log("GET ", url);
        unstable_noStore();
        const response = await fetch(url);
        const result = await response.json();

        if (!response.ok) {
          throw new Error(
            result.error || `HTTP error! status: ${response.status}`
          );
        }
        const unprocessedData = result.data as MetricsResponse;

        const {
          unplannedTimeList,
          totalFlowList,
          productiveFlowList,
          n1HUTList,
          nw1HUTList,
          w1HUTList,
          unproductiveList,
          hoursFreeList,
          distractionCountList,
          efficiencyList,
          productiveList,
          flow: newFlow,
          taskBacklog,
          startDate: newStartDate,
          endDate: newEndDate,
          currentActivity: newCurrentActivity,
          currentActivityStartTime: newCurrentActivityStartTime,
          taskBacklogRefreshesLeft: newTbRefreshesLeft,
          taskBacklogHistory: newTaskBacklogHistoryData,
          neutralActivity: newNeutralActivity,
        } = unprocessedData;

        setTaskBacklogRefreshesLeft(newTbRefreshesLeft);
        setTaskBacklogHistory([
          ...newTaskBacklogHistoryData,
          { id: cuid(), amount: taskBacklog, createdAt: new Date() },
        ]);
        setNeutralActivity(newNeutralActivity);
        setFlow(newCurrentActivity === "😴 Sleeping" ? 0 : newFlow);
        setStartDate(newStartDate);
        setEndDate(newEndDate);
        setCurrentActivityStartTime(newCurrentActivityStartTime);
        setCurrentActivity(newCurrentActivity);

        const dataForMetrics = {
          productiveFlow: sumValues(productiveFlowList),
          n1HUT: sumValues(n1HUTList),
          nw1HUT: sumValues(nw1HUTList),
          w1HUT: sumValues(w1HUTList),
          unproductiveTime: sumValues(unproductiveList),
          hoursFree: sumValues(hoursFreeList),
          distraction_count: sumValues(distractionCountList),
          unplannedTime: sumValues(unplannedTimeList),
          productiveTime: sumValues(productiveList),
          efficiency: sumValues(efficiencyList),
          flow: newCurrentActivity === "😴 Sleeping" ? 0 : newFlow,
          startDate: newStartDate,
          endDate: newEndDate,
        };

        setMetricsData((prevMetricsData) =>
          getNewMetricsData({
            data: dataForMetrics,
            metricsData: prevMetricsData,
          })
        );

        setDistractionData((prev) =>
          prev.map((item, index) => ({
            ...item,
            value: Object.values(distractionCountList)[index] || item.value,
          }))
        );
        setUnplannedData((prev) =>
          prev.map((item, index) => ({
            ...item,
            value: Object.values(unplannedTimeList)[index] || item.value,
          }))
        );
        setDailyProductiveFlowData((prev) =>
          prev.map((item, index) => {
            const dateKey = Object.keys(productiveList)[index];
            return {
              ...item,
              date: dateKey ? dateKey.slice(5) : item.date,
              productiveFlow:
                Object.values(productiveFlowList)[index] || item.productiveFlow,
              totalFlow: Object.values(totalFlowList)[index] || item.totalFlow,
            };
          })
        );
        setEfficiencyData((prev) =>
          prev.map((item, index) => {
            const dateKey = Object.keys(productiveList)[index];
            return {
              ...item,
              date: dateKey ? dateKey.slice(5) : item.date,
              productiveTime:
                Object.values(productiveList)[index] || item.productiveTime,
              hoursFree: Object.values(hoursFreeList)[index] || item.hoursFree,
            };
          })
        );

        const currentProductiveFlow = sumValues(productiveFlowList);
        const currentHoursFree = sumValues(hoursFreeList) || 1; // Avoid division by zero

        // Use a fresh copy of the constant for base weekly data
        const baseWeeklyFlow = weeklyProductiveFlowConstant.map((item) => ({
          ...item,
        }));

        const movingAverageWeekly = simpleMovingAverage(
          [
            ...baseWeeklyFlow.map((item) => item.productiveFlow),
            currentProductiveFlow,
          ],
          WEEKLY_INTERVAL
        );
        const movingAveragePercentageWeekly = simpleMovingAverage(
          [
            ...baseWeeklyFlow.map((item) => item.flowPercentage),
            roundToThree(currentProductiveFlow / currentHoursFree),
          ],
          WEEKLY_INTERVAL
        );

        const updatedWeeklyDataWithMA = baseWeeklyFlow.map((item, index) => ({
          ...item,
          movingAverage: movingAverageWeekly[index],
          movingAveragePercentage: movingAveragePercentageWeekly[index],
        }));

        const firstDayOfCurrentWeekData =
          Object.keys(productiveList).length > 0
            ? Object.keys(productiveList)[0]
            : new Date().toISOString().split("T")[0];

        setWeeklyProductiveFlowData(
          [
            ...updatedWeeklyDataWithMA,
            {
              week: baseWeeklyFlow.length, // Or derive dynamically if needed
              date:
                "Week of " +
                new Date(firstDayOfCurrentWeekData).toLocaleDateString(
                  "en-US",
                  { month: "short", day: "numeric" }
                ) +
                " - LIVE",
              productiveFlow: currentProductiveFlow,
              flowPercentage: roundToThree(
                currentProductiveFlow / currentHoursFree
              ),
              movingAverage:
                movingAverageWeekly[movingAverageWeekly.length - 1],
              movingAveragePercentage:
                movingAveragePercentageWeekly[
                  movingAveragePercentageWeekly.length - 1
                ],
            },
          ].slice(WEEKLY_INTERVAL)
        );

        lastFetchTimeRef.current = Date.now();
        setError(""); // Clear error on successful fetch
      } catch (err: any) {
        console.error("Error in fetchData (custom hook):", err);
        setError(errorMessage || err.message || "An unknown error occurred");
      } finally {
        setTimeout(() => {
          setShowConfetti(false);
        }, 5000);
      }
    },
    [] // Dependencies: rely on functional updates for setters. Constants/env vars are stable.
  );

  useEffect(() => {
    fetchData(SERVER_ERROR_MESSAGE);
  }, [fetchData]);

  return {
    showConfetti,
    flow,
    error,
    setError, // Exporting setError for CountdownComponent
    taskBacklogRefreshesLeft,
    efficiencyData,
    distractionData,
    unplannedData,
    dailyProductiveFlowData,
    metricsData,
    weeklyProductiveFlowData,
    startDate,
    endDate,
    currentActivity,
    currentActivityStartTime,
    taskBacklogHistory,
    neutralActivity,
    fetchData, // Exporting fetchData for CountdownComponent's refresh
  };
}

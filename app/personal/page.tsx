"use client";
import { p1HUTDaily, p1HUTWeekly } from "@/app/constant";
import AreaGraph from "@/components/area";
import BarGraph from "@/components/bar";
import { FlowImg } from "@/components/flowicon";
import MetricComponent from "@/components/metric";
import { cn } from "@/lib/utils";
import { Title } from "@tremor/react";
import { useEffect, useRef, useState } from "react";
import RealisticConfettiPreset from "react-canvas-confetti/dist/presets/realistic";
import { sumValues } from "@/lib/utils";
import { getNewMetricsData } from "@/lib/utils";

import { roundToThree, simpleMovingAverage } from "@/lib/utils";
import {
  BarData,
  ChartData,
  DailyData,
  EfficiencyData,
  MetricData,
  MetricNames,
  MetricsResponse,
  MonthlyData,
  TremorColors,
  metrics,
  weekdays,
} from "@/types";

const refreshTime = 30;
const pollingInterval = 1000;

export default function Component() {
  const [showConfetti, setShowConfetti] = useState(false);
  const [flow, setFlow] = useState(0);
  const [timeLeft, setTimeLeft] = useState(refreshTime);
  const [error, setError] = useState(false);
  const timeLeftRef = useRef(0);
  const [efficiencyData, setEfficiencyData] = useState<EfficiencyData[]>(
    weekdays.map((day) => ({
      date: day,
      productiveTime: null,
      hoursFree: null,
    }))
  );
  const [distractionData, setDistractionData] = useState<BarData[]>(
    weekdays.map((day) => ({
      date: day,
      value: null,
    }))
  );

  const [unplannedData, setUnplannedData] = useState<BarData[]>(
    weekdays.map((day) => ({
      date: day,
      value: null,
    }))
  );
  const [dailyProductiveFlowData, setDailyProductiveFlowData] = useState<ChartData[]>(
    weekdays.map((day) => ({
      date: day,
      oneHUT: null,
      p1HUT: null,
    }))
  );

  const [metricsData, setMetricsData] = useState<MetricData[]>(
    metrics.map((metric) => ({
      metric,
      prevScore: 0,
      score: 0,
      percentageOfTarget: 0,
      targetScore: "100",
      color: "blue",
      tooltip: "",
    }))
  );

  const [weeklyProductiveFlowData, setWeeklyProductiveFlowData] = useState<MonthlyData[]>(p1HUTWeekly);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [showOnlyMA, setShowOnlyMA] = useState(false);
  const [showOnlyRaw, setShowOnlyRaw] = useState(false);
  const [currentActivity, setCurrentActivity] = useState("Loading ...");

  const fetchData = async () => {
    await setTimeout(() => {
      setShowConfetti(true);
    }, 2000);

    try {
      console.log("fetching data from server ...");
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/metrics`
      );

      const result = await response.json();
      const unprocessedData = result.data as MetricsResponse;

      const {
        unplannedTimeList,
        oneHUTList,
        p1HUTList,
        n1HUTList,
        nw1HUTList,
        w1HUTList,
        unproductiveList,
        hoursFreeList,
        distractionCountList,
        efficiencyList,
        productiveList,
        flow,
        startDate,
        endDate,
        currentActivity,
      } = unprocessedData;

      setCurrentActivity(currentActivity);
      setFlow(flow);
      setStartDate(startDate);
      setEndDate(endDate);

      const data = {
        p1HUT: sumValues(p1HUTList),
        n1HUT: sumValues(n1HUTList),
        nw1HUT: sumValues(nw1HUTList),
        w1HUT: sumValues(w1HUTList),
        unproductiveTime: sumValues(unproductiveList),
        hoursFree: sumValues(hoursFreeList),
        distraction_count: sumValues(distractionCountList),
        unplannedTime: sumValues(unplannedTimeList),
        productiveTime: sumValues(productiveList),
        efficiency: sumValues(efficiencyList),
        flow: flow,
        startDate: startDate,
        endDate: endDate,
      };

      const newMetricsData = getNewMetricsData({ data, metricsData });

      setMetricsData(newMetricsData);

      const newDistractionData = distractionData.map((item, index) => {
        const distractionCountValue =
          Object.values(distractionCountList)[index];
        return {
          ...item,
          value: distractionCountValue || item["value"],
        };
      });

      setDistractionData(newDistractionData);

      const newUnplannedData = unplannedData.map((item, index) => {
        const unplannedTimeValue = Object.values(unplannedTimeList)[index];
        return {
          ...item,
          value: unplannedTimeValue || item["value"],
        };
      });

      setUnplannedData(newUnplannedData);

      const newDailyProductiveFlowData = dailyProductiveFlowData.map((item, index) => {
        const p1HUTValue = Object.values(p1HUTList)[index];
        const oneHUTValue = Object.values(oneHUTList)[index];
        const date = Object.keys(p1HUTList)[index];
        return {
          ...item,
          date: date.slice(5),
          p1HUT: p1HUTValue || item.p1HUT,
          oneHUT: oneHUTValue || item.oneHUT,
        };
      });

      setDailyProductiveFlowData(newDailyProductiveFlowData);

      const newEfficiencyData = efficiencyData.map((item, index) => {
        const productiveTime = Object.values(productiveList)[index];
        const hoursFree = Object.values(hoursFreeList)[index];
        const date = Object.keys(p1HUTList)[index];
        return {
          ...item,
          date: date.slice(5),
          productiveTime: productiveTime || item.productiveTime,
          hoursFree: hoursFree || item.hoursFree,
        };
      });

      setEfficiencyData(newEfficiencyData);

      const lastWeek = p1HUTWeekly.length - 1;
      const weeklyInterval = 4;

      const movingAverageWeekly = simpleMovingAverage(
        [...p1HUTWeekly.map((item) => item.p1HUT), data.p1HUT],
        weeklyInterval
      );

      const movingAveragePercentageWeekly = simpleMovingAverage(
        [
          ...p1HUTWeekly.map((item) => item.p1HUTPercentage),
          roundToThree(data.p1HUT / data.hoursFree),
        ],
        weeklyInterval
      );

      p1HUTWeekly.forEach((item, index) => {
        item.movingAverage = movingAverageWeekly[index];
        item.movingAveragePercentage = movingAveragePercentageWeekly[index];
      });

      setWeeklyProductiveFlowData(
        [
          ...p1HUTWeekly,
          {
            week: lastWeek + 1,
            date: Object.keys(p1HUTList)[0].slice(5),
            p1HUT: data.p1HUT,
            p1HUTPercentage: roundToThree(data.p1HUT / data.hoursFree),
            movingAverage: movingAverageWeekly[movingAverageWeekly.length - 1],
            movingAveragePercentage:
              movingAveragePercentageWeekly[
                movingAveragePercentageWeekly.length - 1
              ],
          },
        ].slice(weeklyInterval)
      );

    } catch (err: any) {
      console.log("returning error");
      console.log(err);
      setError(true);
    } finally {
      await setTimeout(() => {
        setShowConfetti(false);
      }, 5000);
    }
  };

  useEffect(() => {
    try {
      fetchData();
      const interval = setInterval(() => {
        timeLeftRef.current += 1;
        setTimeLeft(timeLeftRef.current);

        if (timeLeftRef.current === refreshTime - 2) {
          fetchData();
        }
        if (timeLeftRef.current === refreshTime) {
          timeLeftRef.current = 0;
          setTimeLeft(timeLeftRef.current);
        }
      }, pollingInterval);
      setError(false);

      return () => {
        clearInterval(interval);
      };
    } catch (err: any) {
      console.log("returning error!");
      console.log(err);
      setError(true);
    }
  }, []);


  return (
    <div className="flex bg-gray-100 dark:bg-gray-900">
      <div className="flex flex-col flex-1">
        <header className="flex items-center justify-between p-6 border-b dark:border-gray-700">
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200">
            Dashboard
          </h2>
          <div>
            {startDate} to {endDate}
          </div>
        </header>
        <main
          className={cn(
            "flex-1 bg-gray-100 dark:bg-gray-900",
            flow > 0.8 &&
              "dark:bg-gradient-to-t dark:from-green-800 dark:via-gray-900 dark:to-gray-900",
            flow > 1.5 &&
              "dark:bg-gradient-to-t dark:from-purple-800 dark:via-gray-900 dark:to-gray-900",
            flow > 2.5 &&
              "dark:bg-gradient-to-t dark:from-red-800 dark:via-gray-900 dark:to-gray-900"
          )}
        >
          <div className="container mx-auto px-6 py-8">
            {showConfetti && (
              <RealisticConfettiPreset
                width={window.innerWidth}
                // make color of confetti red
                decorateOptions={(options) => {
                  options.colors =
                    flow > 2.5
                      ? ["#DC143C", "#B22222", "#CD5C5C", "#E9967A", "#F08080"]
                      : flow > 1.5
                      ? ["#800080", "#8A2BE2", "#4B0082", "#483D8B", "#6A5ACD"]
                      : flow > 0.8
                      ? ["#008000", "#228B22", "#32CD32", "#3CB371", "#2E8B57"]
                      : ["#0000FF", "#4169E1", "#6495ED", "#4682B4", "#87CEFA"];
                  return options;
                }}
                autorun={{ speed: 1, duration: 500 }}
              ></RealisticConfettiPreset>
              // <img
              //   src="https://pub-7712ec77fabb4a6d996c607b226d98f0.r2.dev/confetti-transparent.gif"
              //   alt="Loading..."
              //   className="gifPosition"
              //   style={{
              //     position: "absolute",
              //     top: "50%",
              //     left: "50%",
              //     zIndex: 100,
              //     transform: "translate(-50%, -50%)",
              //   }}
              // ></img>
            )}
            {flow > 1.5 && (
              <>
                <FlowImg top="16%" left="18%" flow={flow} />
                <FlowImg top="16%" left="35%" flow={flow} />
                <FlowImg top="16%" left="65%" flow={flow} />
                <FlowImg top="16%" left="82%" flow={flow} />
              </>
            )}
            <Title className="grid gap-6 mb-8 text-center">
              Refreshing in {refreshTime - timeLeftRef.current} seconds
            </Title>
            <div className="grid gap-6 mb-8 md:grid-cols-2 xl:grid-cols-5 mt-5">
              {metricsData.map((data, index) => (
                <MetricComponent
                  key={index}
                  metric={data.metric}
                  prevScore={data.prevScore}
                  score={data.score}
                  percentageOfTarget={data.percentageOfTarget}
                  targetScore={data.targetScore}
                  color={data.color}
                />
              ))}
            </div>
            <div className="grid gap-6 lg:grid-cols-4">
              <BarGraph
                barData={unplannedData}
                category="Unplanned Time (h)"
                color={
                  flow > 2.5
                    ? "red"
                    : flow > 1.5
                    ? "fuchsia"
                    : flow > 0.8
                    ? "emerald"
                    : "blue"
                }
              />
              <AreaGraph
                data={dailyProductiveFlowData}
                title={"Prod. Flow vs Total Flow (h)"}
                categories={["p1HUT", "oneHUT"]}
                colors={
                  flow > 2.5
                    ? ["red", "gray"]
                    : flow > 1.5
                    ? ["fuchsia", "slate"]
                    : flow > 0.8
                    ? ["emerald", "slate"]
                    : ["blue", "slate"]
                }
                index={"date"}
              />
              <AreaGraph
                data={efficiencyData}
                title={"Productive vs Free Hours"}
                categories={["productiveTime", "hoursFree"]}
                colors={
                  flow > 2.5
                    ? ["red", "gray"]
                    : flow > 1.5
                    ? ["fuchsia", "slate"]
                    : flow > 0.8
                    ? ["emerald", "slate"]
                    : ["blue", "slate"]
                }
                index={"date"}
              />
              <BarGraph
                barData={distractionData}
                category="# Distractions"
                color={
                  flow > 2.5
                    ? "red"
                    : flow > 1.5
                    ? "fuchsia"
                    : flow > 0.8
                    ? "emerald"
                    : "blue"
                }
              />
            </div>

            <br></br>
            <Title className="grid gap-6 mb-8 text-center">
              {flow < 0.8 &&
                `Need ${roundToThree((0.8 - flow) * 60)} more min until flow`}
            </Title>
            <br></br>
            {/* <AreaGraph
              data={dailyData}
              title={"Daily Productive Flow (h) over past 3 Months"}
              categories={
                showOnlyMA
                  ? ["movingAverage"]
                  : showOnlyRaw
                  ? ["p1HUT"]
                  : ["p1HUT", "movingAverage"]
              }
              colors={
                showOnlyMA
                  ? ["slate"]
                  : flow > 2.5
                  ? ["red", "gray"]
                  : flow > 1.5
                  ? ["fuchsia", "slate"]
                  : flow > 0.8
                  ? ["emerald", "slate"]
                  : ["blue", "slate"]
              }
              index={"date"}
            /> */}
            <AreaGraph
              data={weeklyProductiveFlowData}
              className="h-[400px]"
              title={"Weekly Productive Flow (h) Since 2023"}
              categories={
                showOnlyMA
                  ? ["movingAverage"]
                  : showOnlyRaw
                  ? ["p1HUT"]
                  : ["p1HUT", "movingAverage"]
              }
              colors={
                showOnlyMA
                  ? ["slate"]
                  : flow > 2.5
                  ? ["red", "gray"]
                  : flow > 1.5
                  ? ["fuchsia", "slate"]
                  : flow > 0.8
                  ? ["emerald", "slate"]
                  : ["blue", "slate"]
              }
              index={"date"}
            />
            <AreaGraph
              data={weeklyProductiveFlowData}
              className="h-[400px]"
              title={"Weekly Productive Flow Efficiency (%) Since 2023"}
              categories={
                showOnlyMA
                  ? ["movingAveragePercentage"]
                  : showOnlyRaw
                  ? ["p1HUTPercentage"]
                  : ["p1HUTPercentage", "movingAveragePercentage"]
              }
              colors={
                showOnlyMA
                  ? ["slate"]
                  : flow > 2.5
                  ? ["red", "gray"]
                  : flow > 1.5
                  ? ["fuchsia", "slate"]
                  : flow > 0.8
                  ? ["emerald", "slate"]
                  : ["blue", "slate"]
              }
              index={"date"}
            />
            <div className="flex items-center justify-center space-x-4">
              <button
                className="bg-blue-800 hover:bg-blue-700 mt-4 text-white font-bold py-2 px-4 rounded"
                onClick={() => setShowOnlyMA(!showOnlyMA)}
              >
                {showOnlyMA ? "Show Both" : "Show Only MA"}
              </button>
              <button
                className="bg-blue-800 hover:bg-blue-700 mt-4 text-white font-bold py-2 px-4 rounded"
                onClick={() => setShowOnlyRaw(!showOnlyRaw)}
              >
                {showOnlyRaw ? "Show Both" : "Show Only Raw"}
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

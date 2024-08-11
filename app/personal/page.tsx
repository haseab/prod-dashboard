"use client";
import { weeklyProductiveFlow } from "@/app/constant";
import AreaGraph from "@/components/area";
import BarGraph from "@/components/bar";
import { FlowImg } from "@/components/flowicon";
import MetricComponent from "@/components/metric";
import { cn, getNewMetricsData, sumValues } from "@/lib/utils";
import { Title } from "@tremor/react";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import RealisticConfettiPreset from "react-canvas-confetti/dist/presets/realistic";

import { roundToThree, simpleMovingAverage } from "@/lib/utils";
import {
  BarData,
  ChartData,
  EfficiencyData,
  MetricData,
  MetricsResponse,
  MonthlyData,
  metrics,
  weekdays,
} from "@/types";
import { ArrowLeftIcon, ArrowRightIcon } from "lucide-react";

const refreshTime = 30;
const pollingInterval = 1000;

export default function Component({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const [showConfetti, setShowConfetti] = useState(false);
  const [flow, setFlow] = useState(0);
  const [error, setError] = useState(false);
  const [startDate, setStartDate] = useState(
    (searchParams.startDate as string) || new Date().toISOString().split("T")[0]
  );
  const [endDate, setEndDate] = useState(
    (searchParams.endDate as string) || new Date().toISOString().split("T")[0]
  );
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

  const [weeklyProductiveFlowData, setWeeklyProductiveFlowData] =
    useState<MonthlyData[]>(weeklyProductiveFlow);
  const [showOnlyMA, setShowOnlyMA] = useState(false);
  const [showOnlyRaw, setShowOnlyRaw] = useState(false);
  const [timeLeftState, setTimeLeftState] = useState(0);

  const router = useRouter();

  const fetchData = async (startDate: string, endDate: string) => {
    const url = `${process.env.NEXT_PUBLIC_SERVER_URL}/api/metrics?startDate=${startDate}&endDate=${endDate}`;

    try {
      console.log("fetching data from server ...");
      console.log("GET ", url);

      const response = await fetch(url);
      const result = await response.json();
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
        flow,
        startDate,
        endDate,
      } = unprocessedData;

      setFlow(flow);
      setStartDate(startDate);
      setEndDate(endDate);

      const data = {
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

      const newDailyProductiveFlowData = dailyProductiveFlowData.map(
        (item, index) => {
          const productiveFlowValue = Object.values(productiveFlowList)[index];
          const totalFlowValue = Object.values(totalFlowList)[index];
          const date = Object.keys(productiveFlowList)[index];
          return {
            ...item,
            date: date.slice(5),
            productiveFlow: productiveFlowValue || item.productiveFlow,
            totalFlow: totalFlowValue || item.totalFlow,
          };
        }
      );

      setDailyProductiveFlowData(newDailyProductiveFlowData);

      const newEfficiencyData = efficiencyData.map((item, index) => {
        const productiveTime = Object.values(productiveList)[index];
        const hoursFree = Object.values(hoursFreeList)[index];
        const date = Object.keys(productiveFlowList)[index];
        return {
          ...item,
          date: date.slice(5),
          productiveTime: productiveTime || item.productiveTime,
          hoursFree: hoursFree || item.hoursFree,
        };
      });

      setEfficiencyData(newEfficiencyData);

      const lastWeek = weeklyProductiveFlow.length - 1;
      const weeklyInterval = 4;

      const movingAverageWeekly = simpleMovingAverage(
        [
          ...weeklyProductiveFlow.map((item) => item.productiveFlow),
          data.productiveFlow,
        ],
        weeklyInterval
      );

      const movingAveragePercentageWeekly = simpleMovingAverage(
        [
          ...weeklyProductiveFlow.map((item) => item.flowPercentage),
          roundToThree(data.productiveFlow / data.hoursFree),
        ],
        weeklyInterval
      );

      weeklyProductiveFlow.forEach((item, index) => {
        item.movingAverage = movingAverageWeekly[index];
        item.movingAveragePercentage = movingAveragePercentageWeekly[index];
      });

      setWeeklyProductiveFlowData(
        [
          ...weeklyProductiveFlow,
          {
            week: lastWeek + 1,
            date: Object.keys(productiveFlowList)[0].slice(5),
            productiveFlow: data.productiveFlow,
            flowPercentage: roundToThree(data.productiveFlow / data.hoursFree),
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
    const interval = setInterval(() => {
      timeLeftRef.current += 1; // Update ref
      setTimeLeftState(timeLeftRef.current); // Update state to trigger re-render
      // console.log("Time left: ", refreshTime - timeLeftRef.current);

      if (timeLeftRef.current >= refreshTime) {
        timeLeftRef.current = 0;
        setTimeLeftState(0); // Reset the timer and state
      }
    }, pollingInterval);

    return () => {
      clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    if (timeLeftState === refreshTime || timeLeftState === 0) {
      try {
        fetchData(startDate, endDate);
        setError(false);
      } catch (err) {
        console.error("Returning error!", err);
        setError(true);
      }
    }
  }, [timeLeftState, startDate, endDate]);

  return (
    <div className="flex bg-gray-900">
      <div className="flex flex-col flex-1">
        <header className="flex items-center justify-between p-6 border-b border-gray-700">
          <h2 className="text-2xl font-semibold text-gray-200">Dashboard</h2>
          <div className="flex items-center gap-4">
            <button
              onClick={() => {
                const startDatetime = new Date(startDate);
                const endDatetime = new Date(endDate);

                const newStartDate = new Date(
                  startDatetime.setDate(startDatetime.getDate() - 7)
                )
                  .toISOString()
                  .split("T")[0];
                const endStartDate = new Date(
                  endDatetime.setDate(endDatetime.getDate() - 7)
                )
                  .toISOString()
                  .split("T")[0];
                console.log("start date: ", newStartDate);
                console.log("end date: ", endStartDate);
                setStartDate(newStartDate);
                setEndDate(endStartDate);
                setTimeLeftState(0);
                router.push(
                  `/personal?startDate=${newStartDate}&endDate=${endStartDate}`
                );
              }}
            >
              <ArrowLeftIcon className="h-6 w-6 text-gray-200" />
            </button>
            <div>
              {startDate} to {endDate}
            </div>
            <button
              onClick={() => {
                const startDatetime = new Date(startDate);
                const endDatetime = new Date(endDate);

                const newStartDate = new Date(
                  startDatetime.setDate(startDatetime.getDate() + 7)
                )
                  .toISOString()
                  .split("T")[0];
                const endStartDate = new Date(
                  endDatetime.setDate(endDatetime.getDate() + 7)
                )
                  .toISOString()
                  .split("T")[0];
                console.log("start date: ", newStartDate);
                console.log("end date: ", endStartDate);
                setStartDate(newStartDate);
                setEndDate(endStartDate);
                setTimeLeftState(0);
                router.push(
                  `/personal?startDate=${newStartDate}&endDate=${endStartDate}`
                );
              }}
            >
              <ArrowRightIcon className="h-6 w-6 text-gray-200" />
            </button>
          </div>
        </header>
        <main
          className={cn(
            "flex-1 bg-gray-900",
            flow > 0.8334 &&
              "bg-gradient-to-t from-green-800 via-gray-900 to-gray-900",
            flow > 1.5 &&
              "bg-gradient-to-t from-purple-800 via-gray-900 to-gray-900",
            flow > 2.5 &&
              "bg-gradient-to-t from-red-800 via-gray-900 to-gray-900"
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
                      : flow > 0.8334
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
                    : flow > 0.8334
                    ? "emerald"
                    : "blue"
                }
              />
              <AreaGraph
                data={dailyProductiveFlowData}
                title={"Prod. Flow vs Total Flow (h)"}
                categories={["productiveFlow", "totalFlow"]}
                colors={
                  flow > 2.5
                    ? ["red", "gray"]
                    : flow > 1.5
                    ? ["fuchsia", "slate"]
                    : flow > 0.8334
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
                    : flow > 0.8334
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
                    : flow > 0.8334
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
                  ? ["productiveFlow"]
                  : ["productiveFlow", "movingAverage"]
              }
              colors={
                showOnlyMA
                  ? ["slate"]
                  : flow > 2.5
                  ? ["red", "gray"]
                  : flow > 1.5
                  ? ["fuchsia", "slate"]
                  : flow > 0.8334
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
                  ? ["productiveFlow"]
                  : ["productiveFlow", "movingAverage"]
              }
              colors={
                showOnlyMA
                  ? ["slate"]
                  : flow > 2.5
                  ? ["red", "gray"]
                  : flow > 1.5
                  ? ["fuchsia", "slate"]
                  : flow > 0.8334
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
                  ? ["flowPercentage"]
                  : ["flowPercentage", "movingAveragePercentage"]
              }
              colors={
                showOnlyMA
                  ? ["slate"]
                  : flow > 2.5
                  ? ["red", "gray"]
                  : flow > 1.5
                  ? ["fuchsia", "slate"]
                  : flow > 0.8334
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

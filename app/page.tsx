"use client";

import { p1HUTDaily, p1HUTWeekly } from "@/app/constant";
import AreaGraph from "@/components/area";
import { FlowImg } from "@/components/flowicon";
import { default as MetricComponent } from "@/components/metric";
import PingDot from "@/components/ping-dot";
import { useMobile } from "@/hooks/use-mobile";
import {
  cn,
  formatToCurrentTimezone,
  getNewMetricsData,
  roundToThree,
  simpleMovingAverage,
  sumValues,
} from "@/lib/utils";
import { Card, Title } from "@tremor/react";
import { useEffect, useRef, useState } from "react";
import RealisticConfettiPreset from "react-canvas-confetti/dist/presets/realistic";
import {
  BarData,
  ChartData,
  DailyData,
  EfficiencyData,
  MetricData,
  MetricsResponse,
  MonthlyData,
  publicMetrics,
  weekdays,
} from "../types";

const refreshTime = 30;
const pollingInterval = 1000;
export const revalidate = 0;

export default function Component() {
  const isMobile = useMobile();
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

  const [barData, setBarData] = useState<BarData[]>(
    weekdays.map((day) => ({
      date: day,
      value: null,
    }))
  );
  const [chartData, setChartData] = useState<ChartData[]>(
    weekdays.map((day) => ({
      date: day,
      oneHUT: null,
      p1HUT: null,
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

  const [monthlyData, setMonthlyData] = useState<MonthlyData[]>(p1HUTWeekly);
  const [dailyData, setDailyData] = useState<DailyData[]>();
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

      console.log(newMetricsData);

      const newDistractionData = distractionData.map((item, index) => {
        const distractionCountValue =
          Object.values(distractionCountList)[index];
        return {
          ...item,
          value: distractionCountValue || item["value"],
        };
      });

      setDistractionData(newDistractionData);

      const newBarData = barData.map((item, index) => {
        const unplannedTimeValue = Object.values(unplannedTimeList)[index];
        return {
          ...item,
          value: unplannedTimeValue || item["value"],
        };
      });

      setBarData(newBarData);
      console.log(newBarData);

      const newChartData = chartData.map((item, index) => {
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

      setChartData(newChartData);

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
      const dailyInterval = 7;

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

      setMonthlyData(
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

      const lastDay = p1HUTDaily.length - 1;

      const movingAverageDaily = simpleMovingAverage(
        [...p1HUTDaily.map((item) => item.p1HUT), ...Object.values(p1HUTList)],
        dailyInterval
      );

      p1HUTDaily.forEach((item, index) => {
        item.movingAverage = movingAverageDaily[index];
      });

      let newDailyData: DailyData[] = [];

      Object.keys(p1HUTList).forEach((key, index) => {
        if ((index + 1) % 2 !== 0) {
          return;
        }
        const newObj = {
          day: p1HUTDaily.length,
          date: key.slice(5),
          p1HUT: p1HUTList[key],
          movingAverage:
            movingAverageDaily[
              movingAverageDaily.length - (2 * dailyInterval - index)
            ],
        };
        // Append the new object to `p1HUTDaily`
        newDailyData.push(newObj);
      });

      console.log("moving average daily");
      console.log(movingAverageDaily);
      console.log("p1HUTDaily");
      console.log(p1HUTDaily);

      setDailyData([...p1HUTDaily, ...newDailyData].slice(dailyInterval));
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
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
      {/* <div className="flex flex-col w-64 bg-white dark:bg-gray-800 border-r dark:border-gray-700">
        <div className="flex items-center justify-center h-14 border-b dark:border-gray-700">
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200">
            TiBA
          </h2>
        </div>
        <div className="flex flex-col px-4 py-6">
          <nav>
            <Link
              className="flex items-center py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700 rounded"
              href="#"
            >
              <LayoutDashboardIcon className="w-6 h-6 text-gray-500 dark:text-gray-400" />
              <span className="mx-4 font-medium">Dashboard</span>
            </Link>
            <Link
              className="flex items-center py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700 rounded"
              href="#"
            >
              <ViewIcon className="w-6 h-6 text-gray-500 dark:text-gray-400" />
              <span className="mx-4 font-medium">Reports</span>
            </Link>
            <Link
              className="flex items-center py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700 rounded"
              href="#"
            >
              <UsersIcon className="w-6 h-6 text-gray-500 dark:text-gray-400" />
              <span className="mx-4 font-medium">Users</span>
            </Link>
            <Link
              className="flex items-center py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700 rounded"
              href="#"
            >
              <SettingsIcon className="w-6 h-6 text-gray-500 dark:text-gray-400" />
              <span className="mx-4 font-medium">Settings</span>
            </Link>
          </nav>
        </div>
      </div> */}
      <div className="flex font-sans flex-col flex-1 w-full">
        <div className="flex justify-center items-center">
          <header className="container px-12 flex flex-col xs:flex-row items-center justify-between p-6 pb-0  w-full">
            <h2 className="text-3xl pt-5 sm:pt-0 sm:text-2xl font-mono font-semibold text-gray-800 dark:text-gray-200">
              timetracking.live
            </h2>
            <div className="hidden sm:block text-lg text-center p-5">
              {startDate} to {endDate}
            </div>
          </header>
        </div>
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

            <Title className="grid gap-6 text-center">
              Refreshing in {refreshTime - timeLeftRef.current} seconds
            </Title>
            {error && (
              <span className="grid gap-6 text-center text-red-700">
                Server error: trying again in 30 seconds...
              </span>
            )}
            <div className="grid md:grid-cols-1 lg:grid-cols-5">
              <div className="grid lg:col-span-3 lg:grid-rows-3 p-5 gap-6">
                <div className="flex">
                  <Card className="flex flex-col sm:flex-row">
                    <div className="flex flex-col items-center justify-center mx-10 space-y-2">
                      <img
                        src="https://pbs.twimg.com/profile_images/1750678675798855680/2sqTuFi-_400x400.jpg"
                        alt="flow"
                        className="w-[20vh] h-[20vh] sm:w-[12vh] sm:h-[12vh] rounded-full"
                      ></img>
                      <div>
                        <p>
                          <a
                            href="https://twitter.com/haseab_"
                            className={cn("flex text-blue-700", {
                              "text-green-700": flow > 0.8,
                              "text-purple-700": flow > 1.5,
                              "text-red-700": flow > 2.5,
                            })}
                            target="_blank"
                          >
                            @haseab_
                          </a>
                        </p>
                        {/* <a
                          href="https://tracker.haseab.workers.dev/?button=seeMore&campaign=timetracking.live&project=haseab-personal&redirect=https%3A%2F%2Fhaseab.com%2F"
                          className="text-blue-500"
                          target="_blank"
                        >
                          haseab.com
                        </a> */}
                      </div>
                    </div>
                    <div className="flex items-center justify-center">
                      <div className="border-b w-60 mt-5 sm:border-r border-gray-700 sm:h-32 sm:w-0"></div>
                    </div>
                    <div className="flex flex-1 flex-col items-center justify-center space-y-2 pt-3 sm:p-3">
                      <Title>Right Now I&apos;m:</Title>
                      <div className="flex flex-col sm:flex-row items-center justify-center sm:space-x-5">
                        <div className="flex items-center justify-center text-center">
                          <p
                            className={cn(
                              "flex text-[1.4rem] sm:text-[1.2rem] md:text-[1.75rem] text-blue-500 font-mono",
                              {
                                "text-green-500": flow > 0.8,
                                "text-purple-500": flow > 1.5,
                                "text-red-500": flow > 2.5,
                              }
                            )}
                          >
                            {currentActivity}
                          </p>
                        </div>
                        <div className="flex mt-5 sm:mt-0 sm:ml-5 items-center justify-center h-full">
                          <PingDot
                            color={
                              flow > 2.5
                                ? "red"
                                : flow > 1.5
                                ? "purple"
                                : flow > 0.8
                                ? "green"
                                : "green"
                            }
                          />
                        </div>
                      </div>
                      <p className="order-first pb-2 sm:order-none text-gray-600 text-sm">
                        Local Time:{" "}
                        {formatToCurrentTimezone(
                          new Date(),
                          // "Canada/Eastern"
                          "America/Los_Angeles"
                        )}
                      </p>
                    </div>
                  </Card>
                </div>
                <div className="grid lg:row-span-2">
                  <div className="flex flex-col space-y-5 sm:flex-row sm:space-x-5 sm:space-y-0">
                    <AreaGraph
                      data={chartData}
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
                  </div>
                </div>
              </div>

              <div className="grid gap-6 p-5 xs:grid-cols-2 lg:col-span-2">
                <div className="block sm:hidden text-lg text-center pt-5">
                  <p className="text-2xl">Last 7 Days</p>
                  <p>
                    {startDate} to {endDate}
                  </p>
                </div>
                {metricsData.map((data, index) => (
                  <MetricComponent
                    key={index}
                    metric={data.metric}
                    prevScore={data.prevScore}
                    score={data.score}
                    percentageOfTarget={data.percentageOfTarget}
                    targetScore={data.targetScore}
                    color={data.color}
                    tooltip={data.tooltip}
                  />
                ))}
              </div>
            </div>

            <br></br>

            <div className="p-5 hidden opacity-0 xs:block xs:opacity-100">
              <Title className="grid gap-6 mb-8 text-center">
                {flow < 0.8 &&
                  `${roundToThree(
                    (0.8 - flow) * 60 + 2
                  )} min until task is classified as flow`}
              </Title>
              <br></br>
              <AreaGraph
                data={monthlyData}
                className="h-[40vh]"
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

            <div className="p-5 flex items-center justify-center">
              <button>
                <a
                  href="https://tracker.haseab.workers.dev/?button=seeMore&campaign=timetracking.live&project=haseab-personal&redirect=https%3A%2F%2Fhaseab.com%2F"
                  target="_blank"
                  className={cn(
                    "bg-blue-800 hover:bg-blue-700 mt-4 text-white font-bold py-2 px-4 rounded border-gray-700",
                    {
                      "bg-green-700": flow > 0.8,
                      "bg-purple-700": flow > 1.5,
                      "bg-red-700": flow > 2.5,
                    }
                  )}
                >
                  See more about me
                </a>
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

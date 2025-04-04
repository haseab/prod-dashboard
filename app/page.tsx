"use client";

import { weeklyProductiveFlow } from "@/app/constant";
import ActivityIndicator from "@/components/activity";
import AreaGraph from "@/components/area";
import CountdownComponent from "@/components/countdown";
import MetricComponent from "@/components/metric";
import ParticlesComponent from "@/components/particles";
import PingDot from "@/components/ping-dot";
import TimerComponent from "@/components/timer";
import { WhyITrackTimeDialog } from "@/components/whyitracktime";
import {
  cx,
  getNewMetricsData,
  roundToThree,
  simpleMovingAverage,
  sumValues,
} from "@/lib/utils";
import { task_backlog } from "@prisma/client";
import { Card, Title } from "@tremor/react";
import cuid from "cuid";
import { AnimatePresence, motion, useAnimation } from "framer-motion";
import { unstable_noStore } from "next/cache";
import { useEffect, useRef, useState } from "react";
import {
  BarData,
  ChartData,
  EfficiencyData,
  MetricData,
  MetricsResponse,
  MonthlyData,
  publicMetrics,
  weekdays,
} from "../types";

const refreshTime = 30;
const duration = 1;
const SERVER_ERROR_MESSAGE = "Server error: trying again in 30 seconds...";

export default function Component() {
  const [showConfetti, setShowConfetti] = useState(false);
  const [flow, setFlow] = useState(0);
  const controls = useAnimation();
  const [timeLeft, setTimeLeft] = useState(2);
  const [timeLeftState, setTimeLeftState] = useState(0);
  const [error, setError] = useState("");
  const timeLeftRef = useRef(0);
  const lastFetchTimeRef = useRef(Date.now());
  const [showDialog, setShowDialog] = useState(false);
  const [taskBacklogRefreshesLeft, setTaskBacklogRefreshesLeft] = useState(0);
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

  const [weeklyProductiveFlowData, setWeeklyProductiveFlowData] =
    useState<MonthlyData[]>(weeklyProductiveFlow);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [showOnlyMA, setShowOnlyMA] = useState(false);
  const [showOnlyRaw, setShowOnlyRaw] = useState(false);
  const [currentActivity, setCurrentActivity] = useState("Loading ...");
  const [currentActivityStartTime, setCurrentActivityStartTime] = useState("");
  const [taskBacklogHistory, setTaskBacklogHistory] = useState<
    Pick<task_backlog, "id" | "amount" | "createdAt">[]
  >([]);
  const [neutralActivity, setNeutralActivity] = useState(false);

  const fetchData = async (errorMessage: string) => {
    const url = `${process.env.NEXT_PUBLIC_SERVER_URL}/api/metrics`;

    try {
      console.log("fetching data from server ...");
      console.log("GET ", url);

      unstable_noStore();
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
        taskBacklog,
        startDate,
        endDate,
        currentActivity,
        currentActivityStartTime,
        taskBacklogRefreshesLeft,
        taskBacklogHistory: taskBacklogHistoryData,
        neutralActivity,
      } = unprocessedData;

      setTaskBacklogRefreshesLeft(taskBacklogRefreshesLeft);
      setTaskBacklogHistory([
        ...taskBacklogHistoryData,
        { id: cuid(), amount: taskBacklog, createdAt: new Date() },
      ]);
      setNeutralActivity(neutralActivity);
      setFlow(currentActivity === "😴 Sleeping" ? 0 : flow);
      setStartDate(startDate);
      setEndDate(endDate);
      setCurrentActivityStartTime(currentActivityStartTime);
      setCurrentActivity(currentActivity);

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
        flow: currentActivity === "😴 Sleeping" ? 0 : flow,
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
          const date = Object.keys(productiveList)[index];
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
        const date = Object.keys(productiveList)[index];
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
            date:
              "Week of " +
              new Date(Object.keys(productiveList)[0]).toLocaleDateString(
                "en-US",
                { month: "short", day: "numeric" }
              ) +
              " - LIVE",
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

      lastFetchTimeRef.current = Date.now(); // Update the last fetch time here
    } catch (err: any) {
      console.log("returning error");
      console.log(err);
      setError(errorMessage);
    } finally {
      await setTimeout(() => {
        setShowConfetti(false);
      }, 5000);
    }
  };

  useEffect(() => {
    const transitionSettings = {
      duration: 1, // 1 second duration
      ease: [0.42, 0, 0.58, 1], // Cubic Bezier curve for ease-in-out
    };

    // Determine which background to use based on the flow state
    const determineBackground = () => {
      if (flow > 2.5) {
        return "linear-gradient(to top, #dc2626, #111827, #111827)"; // Red gradient
      } else if (flow > 1.5) {
        return "linear-gradient(to top, #6d28d9, #111827, #111827)"; // Purple gradient
      } else if (flow > 0.8334) {
        return "linear-gradient(to top, #2e7d32, #111827, #111827)"; // Green gradient
      } else if (flow > 0.4167) {
        return "linear-gradient(to top, #0d47a1, #111827, #111827)"; // Blue gradient
      } else {
        return "linear-gradient(to top, #111827, #111827, #111827)"; // Default gradient
      }
    };

    controls.start({
      backgroundImage: determineBackground(),
      transition: transitionSettings,
    });
  }, [flow, controls]);

  useEffect(() => {
    fetchData(SERVER_ERROR_MESSAGE);
  }, []);

  return (
    <div className="flex h-[100dvh] bg-gray-900">
      <div className="h-[100dvh] flex font-sans flex-col flex-1 w-full">
        <ParticlesComponent id="particles" flow={flow} />
        <div className="sm:pt-12 flex justify-center items-center">
          <header className="container px-12 flex flex-col items-center justify-between p-6 pb-0 w-full">
            <h2 className="text-3xl pt-5 sm:pt-0 sm:text-2xl font-mono font-semibold text-gray-200">
              timetracking.live
            </h2>
            <div className="border-b w-60 mt-5 border-gray-700 w-full"></div>
          </header>
        </div>
        <motion.main
          className="h-[100dvh] overflow-auto flex-1"
          animate={controls}
          style={{ width: "100%", height: "100vh" }}
        >
          <div className="container mx-auto px-6 py-2">
            <div className="grid md:grid-cols-1 lg:grid-cols-5 items-center p-2 lg:p-0">
              <Title className="grid col-span-3 w-full gap-6 text-center">
                {/* Refresh in {refreshTime - timeLeftRef.current} seconds */}
                <CountdownComponent
                  refreshTime={refreshTime}
                  setError={setError}
                  fetchData={(errorMessage: string) => {
                    fetchData(errorMessage);
                  }}
                />
              </Title>
              <div className="hidden lg:block text-lg text-gray-100 text-center xs:grid-cols-2 lg:col-span-2">
                <p>Last 7 Days</p>
              </div>
            </div>
            {error && (
              <span className="grid gap-6 text-center text-red-700">
                {error}
              </span>
            )}
            <div className="grid md:grid-cols-1 lg:grid-cols-5">
              <div className="grid lg:col-span-3 lg:grid-rows-3 p-5 gap-6">
                <div className="flex z-10">
                  <Card className="flex flex-col sm:flex-row p-5 opacity-95">
                    <div className="flex flex-col items-center justify-center mx-10 space-y-2">
                      <AnimatePresence mode="wait">
                        <div className="relative w-[20vh] h-[20vh] sm:w-[8rem] sm:h-[8rem] transition-all duration-300">
                          <motion.img
                            key="normal-eyes"
                            src="https://pub-7712ec77fabb4a6d996c607b226d98f0.r2.dev/normal-eyes.jpg"
                            alt="flow"
                            className="w-[20vh] h-[20vh] sm:w-[8rem] sm:h-[8rem] rounded-full absolute"
                            style={{
                              zIndex: 90,
                            }}
                          />
                          {flow > 2.5 ? (
                            <>
                              <motion.img
                                key="blind-smile"
                                src="https://pub-7712ec77fabb4a6d996c607b226d98f0.r2.dev/blind-dp.png"
                                alt="flow"
                                className="w-[20vh] h-[20vh] sm:w-[8rem] sm:h-[8rem] rounded-full absolute"
                                style={{
                                  zIndex: 90,
                                }}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ duration }}
                              />
                              <motion.img
                                key="red-eyes"
                                src="https://pub-7712ec77fabb4a6d996c607b226d98f0.r2.dev/red-eyes.png"
                                alt="flow"
                                className="w-[20vh] h-[20vh] sm:w-[8rem] sm:h-[8rem] rounded-full absolute animate-pulse-custom"
                                style={{
                                  zIndex: 100,
                                }}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration }}
                              />
                              <motion.img
                                src="https://pub-7712ec77fabb4a6d996c607b226d98f0.r2.dev/white-eyes.png"
                                key="white-eyes-1"
                                alt="flow"
                                className="w-[20vh] h-[20vh] sm:w-[8rem] sm:h-[8rem] rounded-full absolute"
                                style={{
                                  zIndex: 100,
                                }}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration }}
                              />
                            </>
                          ) : flow > 1.5 ? (
                            <>
                              <motion.img
                                key="blind-smile"
                                src="https://pub-7712ec77fabb4a6d996c607b226d98f0.r2.dev/blind-dp.png"
                                alt="flow"
                                className="w-[20vh] h-[20vh] sm:w-[8rem] sm:h-[8rem] rounded-full absolute"
                                style={{
                                  zIndex: 100,
                                }}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ duration }}
                              />
                              <motion.img
                                key="smiledp"
                                src="https://pub-7712ec77fabb4a6d996c607b226d98f0.r2.dev/smiledp.png"
                                alt="flow"
                                className="w-[20vh] h-[20vh] sm:w-[8rem] sm:h-[8rem] rounded-full absolute"
                                style={{
                                  zIndex: 90,
                                }}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration }}
                              />
                              <motion.img
                                key="white-eyes-1"
                                src="https://pub-7712ec77fabb4a6d996c607b226d98f0.r2.dev/white-eyes.png"
                                alt="flow"
                                className="w-[20vh] h-[20vh] sm:w-[8rem] sm:h-[8rem] rounded-full absolute animate-pulse-custom"
                                style={{
                                  zIndex: 100,
                                }}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration }}
                              />
                              <motion.img
                                key="white-eyes-2"
                                src="https://pub-7712ec77fabb4a6d996c607b226d98f0.r2.dev/white-eyes.png"
                                alt="flow"
                                className="w-[20vh] h-[20vh] sm:w-[8rem] sm:h-[8rem] rounded-full absolute animate-pulse-custom"
                                style={{
                                  zIndex: 100,
                                }}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration }}
                              />
                            </>
                          ) : flow > 0.4167 ? (
                            <>
                              <motion.img
                                key="smiledp"
                                src="https://pub-7712ec77fabb4a6d996c607b226d98f0.r2.dev/smiledp.png"
                                alt="flow"
                                className="w-[20vh] h-[20vh] sm:w-[8rem] sm:h-[8rem] rounded-full absolute"
                                style={{
                                  zIndex: 100,
                                }}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration }}
                              />
                            </>
                          ) : (
                            <div></div>
                          )}
                        </div>
                      </AnimatePresence>
                      <div>
                        <p>
                          <a
                            href="https://twitter.com/haseab_"
                            className={cx(
                              "flex text-blue-700 transition-colors duration-1000 ease-in-out",
                              {
                                "text-green-500": flow > 0.8334,
                                "text-purple-500": flow > 1.5,
                                "text-red-500": flow > 2.5,
                              }
                            )}
                            target="_blank"
                          >
                            @haseab_
                          </a>
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center justify-center">
                      <div className="border-b w-60 mt-5 sm:border-r border-gray-700 sm:h-32 sm:w-0"></div>
                    </div>
                    <div className="flex flex-1 flex-col items-center justify-center space-y-2 pt-3 sm:p-3">
                      <Title>Right Now I&apos;m:</Title>
                      <div className="flex flex-col w-full sm:w-auto sm:flex-row items-center justify-center sm:space-x-5">
                        <div className="flex flex-col border p-2 w-full sm:p-0 sm:border-none rounded-xl border-gray-700 items-center justify-center text-center">
                          <ActivityIndicator
                            currentActivity={currentActivity}
                            flow={flow}
                          />
                          <TimerComponent
                            flow={flow}
                            currentActivityStartTime={currentActivityStartTime}
                            className={"mt-2 text-xl block sm:hidden flex"}
                          />
                        </div>

                        <div className="flex mt-5 sm:mt-0 sm:ml-5 items-center justify-center h-full">
                          <PingDot
                            color={
                              error && flow > 2.5
                                ? "blue"
                                : error && flow < 2.5
                                ? "red"
                                : flow > 2.5
                                ? "red"
                                : flow > 1.5
                                ? "purple"
                                : flow > 0.8334
                                ? "green"
                                : "green"
                            }
                          />
                        </div>
                      </div>
                      <TimerComponent
                        flow={flow}
                        currentActivityStartTime={currentActivityStartTime}
                        className={"hidden sm:block flex text-2xl"}
                      />
                    </div>
                  </Card>
                </div>
                <div className="grid lg:row-span-2 z-10">
                  <div className="flex flex-col space-y-5 sm:flex-row sm:space-x-5 sm:space-y-0">
                    <AreaGraph
                      data={dailyProductiveFlowData}
                      title={"Productive Flow vs Total Flow"}
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
                      liveCategory="productiveFlow"
                      tooltip={
                        "This graph shows how many of my flow hours were productive. Flow doesn't have to be productive, for instance I could be in a flow state while watching TV.\nI track this because It's a good visual to show how much of my flow time is productive on each day of the week. I ideally want this to be as close to 100% as possible."
                      }
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
                      liveCategory="productiveTime"
                      tooltip={
                        "This graph shows the comparison of productive hours to hours of free time I had. Dividing these two numbers gives the Efficiency (%).\nI track this because it's a good visual to show how much of my free time is productive each day of the week. Allows me to monitor why some days are more productive than others."
                      }
                    />
                  </div>
                </div>
                <div className="block lg:hidden text-lg text-gray-100 text-center pt-5">
                  <p className="text-2xl">Last 7 Days</p>
                  <p>
                    {startDate} to {endDate}
                  </p>
                </div>
              </div>

              <div className="grid gap-6 p-5 xs:grid-cols-2 lg:col-span-2 z-10">
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

            <div className="p-5 space-y-8 hidden opacity-0 xs:block xs:opacity-100">
              <br></br>
              <AreaGraph
                data={taskBacklogHistory.map((item, index) => ({
                  day: item.id,
                  "hours of planned tasks left": item.amount,
                  date:
                    index === taskBacklogHistory.length - 1
                      ? "LIVE"
                      : `${new Date(item.createdAt).toLocaleDateString(
                          "en-US",
                          {
                            month: "short",
                            day: "numeric",
                          }
                        )} ${new Date(item.createdAt).toLocaleTimeString(
                          "en-GB",
                          {
                            hour: "numeric", // This will remove the leading zero
                            minute: "2-digit",
                            hour12: true,
                          }
                        )}`,
                }))}
                className="h-[40vh]"
                title={"Hours of Planned Tasks Left (h)"}
                categories={["hours of planned tasks left"]}
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
                minutesLeft={taskBacklogRefreshesLeft / 4}
                timeUnits="minutes"
                liveCategory="hours of planned tasks left"
                neutralActivity={neutralActivity}
                tooltip={
                  "This graph shows the status of how many hours of planned work is left on my to-do list. It refreshes every hour and if it goes down it means I'm completing more tasks than planning, and vice versa.\nI track this because this is single handedly the most useful metric for me to know if I'm moving the needle toward my goals. This is because my planned tasks are essentially my theory of the qucikest steps required to get closer to my goals, and if I can do what I say I will do, that's a good sign."
                }
              />
              <AreaGraph
                data={weeklyProductiveFlowData}
                className="h-[40vh]"
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
                liveCategory="productiveFlow"
                tooltip={
                  "This graph shows the historical productive flow hours I've had each week since January 2023. The gray graph is a 4 week moving average of the productive flow hours to show the trends.\nI track this because it's a good visual to see how much high quality hours I really am putting in week on week. You can see the progress this year from last year has been incredible."
                }
              />
              <div className="mt-8 flex items-center justify-center space-x-4">
                <button
                  className={cx(
                    " bg-blue-800 w-15 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded",
                    {
                      "bg-green-700  border-green-400 border-2": flow > 0.8334,
                      "bg-purple-700 border-purple-400 border-2": flow > 1.5,
                      "bg-red-700 border-red-400 border-2": flow > 2.5,
                    }
                  )}
                  onClick={() => setShowOnlyMA(!showOnlyMA)}
                >
                  {showOnlyMA ? "Show Both" : "Show Only MA"}
                </button>
                <button
                  className={cx(
                    " bg-blue-800 w-15 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded",
                    {
                      "bg-green-700  border-green-400 border-2": flow > 0.8334,
                      "bg-purple-700 border-purple-400 border-2": flow > 1.5,
                      "bg-red-700 border-red-400 border-2": flow > 2.5,
                    }
                  )}
                  onClick={() => setShowOnlyRaw(!showOnlyRaw)}
                >
                  {showOnlyRaw ? "Show Both" : "Show Only Raw"}
                </button>
              </div>
            </div>

            <WhyITrackTimeDialog flow={flow} />
          </div>
        </motion.main>
      </div>
    </div>
  );
}

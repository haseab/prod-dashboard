"use client";

import { weeklyProductiveFlow } from "@/app/constant";
import ActivityIndicator from "@/components/activity";
import AreaGraph from "@/components/area";
import { FlowImg } from "@/components/flowicon";
import MetricComponent from "@/components/metric";
import PingDot from "@/components/ping-dot";
import {
  cn,
  formatTimeDifference,
  getNewMetricsData,
  roundToThree,
  simpleMovingAverage,
  sumValues,
} from "@/lib/utils";
import { Card, Dialog, Subtitle, Title } from "@tremor/react";
import { motion, useAnimation } from "framer-motion";
import { XIcon } from "lucide-react";
import { unstable_noStore } from "next/cache";
import Link from "next/link";
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
const pollingInterval = 1000;

export default function Component() {
  const [showConfetti, setShowConfetti] = useState(false);
  const [flow, setFlow] = useState(0);
  const controls = useAnimation();
  const [timeLeft, setTimeLeft] = useState(2);
  const [timeLeftState, setTimeLeftState] = useState(0);
  const [error, setError] = useState(false);
  const timeLeftRef = useRef(0);
  const [showDialog, setShowDialog] = useState(false);
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

  const fetchData = async () => {
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
        startDate,
        endDate,
        currentActivity,
        currentActivityStartTime,
      } = unprocessedData;

      setFlow(currentActivity === "😴 Sleeping" ? 0 : flow);
      setStartDate(startDate);
      setEndDate(endDate);
      setCurrentActivity(currentActivity);
      setCurrentActivityStartTime(currentActivityStartTime);

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
            date: Object.keys(productiveList)[0].slice(5),
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
        fetchData();
        setError(false);
      } catch (err) {
        console.error("Returning error!", err);
        setError(true);
      }
    }
  }, [timeLeftState]);

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
      } else {
        return "linear-gradient(to top, #111827, #111827, #111827)"; // Default gradient
      }
    };

    controls.start({
      backgroundImage: determineBackground(),
      transition: transitionSettings,
    });
  }, [flow, controls]);

  return (
    <div className="flex h-[100dvh] bg-gray-900">
      <div className="h-[100dvh] flex font-sans flex-col flex-1 w-full">
        <div className="flex justify-center items-center">
          <header className="container px-12 flex flex-col items-center justify-between p-6 pb-2  w-full">
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
            {/* {showConfetti && (
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
            )} */}
            {flow > 1.5 && (
              <>
                <FlowImg top="16%" left="18%" flow={flow} />
                <FlowImg top="16%" left="35%" flow={flow} />
                <FlowImg top="16%" left="65%" flow={flow} />
                <FlowImg top="16%" left="82%" flow={flow} />
              </>
            )}

            <div className="grid md:grid-cols-1 lg:grid-cols-5 items-center p-2 lg:p-0">
              <Title className="grid col-span-3 w-full gap-6 text-center">
                Refreshing in {refreshTime - timeLeftRef.current} seconds
              </Title>
              <div className="hidden lg:block text-lg text-gray-100 text-center xs:grid-cols-2 lg:col-span-2">
                <p>Last 7 Days</p>
              </div>
            </div>
            {error && (
              <span className="grid gap-6 text-center text-red-700">
                Server error: trying again in 30 seconds...
              </span>
            )}
            <div className="grid md:grid-cols-1 lg:grid-cols-5">
              <div className="grid lg:col-span-3 lg:grid-rows-3 p-5 gap-6">
                <div className="flex">
                  <Card className="flex flex-col sm:flex-row p-5">
                    <div className="flex flex-col items-center justify-center mx-10 space-y-2">
                      <img
                        src="https://pbs.twimg.com/profile_images/1750678675798855680/2sqTuFi-_400x400.jpg"
                        alt="flow"
                        className="w-[20vh] h-[20vh] sm:w-[8rem] sm:h-[8rem] rounded-full"
                      ></img>
                      <div>
                        <p>
                          <a
                            href="https://twitter.com/haseab_"
                            className={cn(
                              "flex text-blue-700 transition-colors duration-1000 ease-in-out",
                              {
                                "text-green-700": flow > 0.8334,
                                "text-purple-700": flow > 1.5,
                                "text-red-700": flow > 2.5,
                              }
                            )}
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
                      <div className="flex flex-col w-full sm:w-auto sm:flex-row items-center justify-center sm:space-x-5">
                        <div className="flex flex-col border p-2 w-full sm:p-0 sm:border-none rounded-xl border-gray-700 items-center justify-center text-center">
                          <ActivityIndicator
                            currentActivity={currentActivity}
                            flow={flow}
                          />
                          <div className="mt-2 text-xl block sm:hidden flex">
                            <p
                              className={cn(
                                "flex text-blue-500 font-mono transition-colors duration-1000 ease-in-out",
                                {
                                  "text-green-500": flow > 0.8334,
                                  "text-purple-500": flow > 1.5,
                                  "text-red-500": flow > 2.5,
                                }
                              )}
                            >
                              {formatTimeDifference(
                                new Date(currentActivityStartTime),
                                new Date()
                              )}
                            </p>
                          </div>
                        </div>

                        <div className="flex mt-5 sm:mt-0 sm:ml-5 items-center justify-center h-full">
                          <PingDot
                            color={
                              flow > 2.5
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
                      <div className="hidden sm:block flex">
                        <p
                          className={cn(
                            "flex text-2xl text-blue-500 font-mono transition-colors duration-1000 ease-in-out",
                            {
                              "text-green-500": flow > 0.8334,
                              "text-purple-500": flow > 1.5,
                              "text-red-500": flow > 2.5,
                            }
                          )}
                        >
                          {formatTimeDifference(
                            new Date(currentActivityStartTime),
                            new Date()
                          )}
                        </p>
                      </div>
                      {/* <p className="order-first pb-2 sm:order-none text-gray-600 text-sm">
                        Local Time:{" "}
                        {formatToCurrentTimezone(
                          new Date(),
                          // "Canada/Eastern"
                          "America/Los_Angeles"
                        )}
                      </p> */}
                      {/* {flow > 2.5 ? (
                        <p className="text-red-500 text-sm text-center">
                          Currently in a flow state for over 2.5 hours
                        </p>
                      ) : flow > 1.5 ? (
                        <p className="text-purple-500 text-sm text-center">
                          Currently in a flow state for over 1.5 hours
                        </p>
                      ) : flow > 0.8334 ? (
                        <p className="text-green-500 text-sm text-center">
                          Currently in a flow state for about 1 hour
                        </p>
                      ) : (
                        <></>
                      )} */}
                    </div>
                  </Card>
                </div>
                <div className="grid lg:row-span-2">
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

              <div className="grid gap-6 p-5 xs:grid-cols-2 lg:col-span-2">
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
              {/* <Title className="grid gap-6 mb-8 text-center">
                {flow < 0.8334 &&
                  `${roundToThree(
                    (0.8334 - flow) * 60
                  )} min until task is classified as flow`}
              </Title> */}
              <br></br>
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
              />
              <div className="mt-8 flex items-center justify-center space-x-4">
                <button
                  className={cn(
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
                  className={cn(
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

            <div className="p-5 flex items-center justify-center">
              <button
                className={cn(
                  " bg-blue-800 w-15 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded",
                  {
                    "bg-green-700  border-green-400 border-2": flow > 0.8334,
                    "bg-purple-700 border-purple-400 border-2": flow > 1.5,
                    "bg-red-700 border-red-400 border-2": flow > 2.5,
                  }
                )}
                onClick={() => {
                  setShowDialog(true);
                }}
              >
                See why I track my time
              </button>
            </div>

            <Dialog
              open={showDialog}
              onClose={() => {
                setShowDialog(false);
              }}
            >
              <Card className="flex max-w-md ">
                <div>
                  <Title>Why I track my time?</Title>
                  <br></br>
                  <Subtitle>
                    <strong>July 16, 2018: </strong>I was playing video games
                    all day and then one day I realized that I wasn&apos;t able
                    to recall anything I did in the last 2 months, I found that
                    extremely unacceptable since I felt like my life was moving
                    extremely fast. I started tracking my time because of that
                  </Subtitle>
                  <br></br>
                  <Subtitle>
                    this constant feedback feels like a sixth sense and reduces
                    the original anxiety I had.
                  </Subtitle>
                  <Subtitle>
                    <br></br>
                    <strong>Today:</strong> time tracking allows me to have
                    calculate my productive flow time, which I&apos;m currently
                    maximizing for, and my unplanned time, which I&apos;m
                    currently minimizing for. Both of these will get me to my
                    goals.
                  </Subtitle>
                  <br></br>
                  <Link
                    href="https://tracker.haseab.workers.dev/?button=seeMore&campaign=timetracking.live&project=haseab-personal&redirect=https%3A%2F%2Fhaseab.com%2F"
                    target="_blank"
                    className={cn(
                      "bg-blue-800 hover:bg-blue-700 mt-4 text-white font-bold py-2 px-4 rounded border-gray-700",
                      {
                        "bg-green-700": flow > 0.8334,
                        "bg-purple-700": flow > 1.5,
                        "bg-red-700": flow > 2.5,
                      }
                    )}
                  >
                    See more about me
                  </Link>
                </div>
                <button
                  className="flex justify-start"
                  onClick={() => {
                    setShowDialog(false);
                  }}
                >
                  <XIcon color={"white"} />
                </button>
              </Card>
            </Dialog>
          </div>
        </motion.main>
      </div>
    </div>
  );
}

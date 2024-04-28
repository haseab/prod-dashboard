"use client";
import {
  DailyData,
  MetricData,
  MetricsResponse,
  MonthlyData,
  TremorColors,
  metrics,
  weekdays,
} from "@/app/constant";
import AreaGraph from "@/components/area";
import BarGraph from "@/components/bar";
import { FlowImg } from "@/components/flowicon";
import MetricComponent from "@/components/metric";
import { cn } from "@/lib/utils";
import { Title } from "@tremor/react";
import { useEffect, useRef, useState } from "react";
import { BarData, ChartData, EfficiencyData, MetricNames } from "./constant";
import { p1HUTDaily, p1HUTWeekly, roundToThree } from "./utils";

const refreshTime = 30;
const pollingInterval = 1000;

const targets = {
  [MetricNames.HOURS_FREE]: "N/A",
  [MetricNames.N1HUT]: "N/A",
  [MetricNames.PRODUCTIVITY]: "70",
  [MetricNames.EFFICIENCY]: "70",
  [MetricNames.P1HUT]: "55",
  [MetricNames.ONE_HUT]: "55",
  [MetricNames.UNPRODUCTIVE]: "2.5",
  [MetricNames.UNPLANNED_TIME]: "16.5",
  [MetricNames.ONE_HUT_EFFICIENCY]: "50",
  [MetricNames.DISTRACTION_COUNT]: "500",
};

function getColorForPercentage(percentage: number, flow: number): TremorColors {
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
}

export default function Component() {
  const [data, setData] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [timeLeft, setTimeLeft] = useState(refreshTime);
  const [flow, setFlow] = useState(0);
  const [prevScore, setPrevScore] = useState(0);
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
    metrics.map((metric) => ({
      metric,
      prevScore: 0,
      score: 0,
      percentageOfTarget: 0,
      targetScore: "100",
      color: "blue",
    }))
  );

  const [monthlyData, setMonthlyData] = useState<MonthlyData[]>(p1HUTWeekly);
  const [dailyData, setDailyData] = useState<DailyData[]>();
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const fetchData = async () => {
    console.log("fetching data ...");
    setIsLoading(true);
    try {
      const response = await fetch("http://localhost:3002/metrics");
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const result = await response.json();
      const data = result.data;
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
      } = data as MetricsResponse;

      setFlow(flow);
      setStartDate(startDate);
      setEndDate(endDate);

      const sumValues = (obj: Record<string, number>) =>
        Object.values(obj).reduce((a, b) => a + b, 0);

      const p1HUT = sumValues(p1HUTList);
      const n1HUT = sumValues(n1HUTList);
      const nw1HUT = sumValues(nw1HUTList);
      const w1HUT = sumValues(w1HUTList);
      const unproductiveTime = sumValues(unproductiveList);
      const hoursFree = sumValues(hoursFreeList);
      const distraction_count = sumValues(distractionCountList);
      const unplannedTime = sumValues(unplannedTimeList);
      const productiveTime = sumValues(productiveList);
      const efficiency = sumValues(efficiencyList);

      console.log(data);

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
        return {
          ...item,
          p1HUT: p1HUTValue || item.p1HUT,
          oneHUT: oneHUTValue || item.oneHUT,
        };
      });

      setChartData(newChartData);

      const newEfficiencyData = efficiencyData.map((item, index) => {
        const productiveTime = Object.values(productiveList)[index];
        const hoursFree = Object.values(hoursFreeList)[index];
        return {
          ...item,
          productiveTime: productiveTime || item.productiveTime,
          hoursFree: hoursFree || item.hoursFree,
        };
      });

      setEfficiencyData(newEfficiencyData);

      const lastWeek = p1HUTWeekly.length - 1;

      setMonthlyData([
        ...p1HUTWeekly,
        {
          week: lastWeek + 1,
          date: Object.keys(p1HUTList)[0].slice(5),
          p1HUT: p1HUT,
          // oneHUT: p1HUT + n1HUT + nw1HUT + w1HUT,
        },
      ]);

      const lastDay = p1HUTDaily.length - 1;

      let newDailyData: DailyData[] = [];

      Object.keys(p1HUTList).forEach((key, index) => {
        // Create a new object with the next `day` index and the `p1HUT` value from `dic`
        const newObj = {
          day: p1HUTDaily.length,
          date: key.slice(5),
          p1HUT: p1HUTList[key],
        };
        // Append the new object to `p1HUTDaily`
        newDailyData.push(newObj);
      });

      setDailyData([...p1HUTDaily, ...newDailyData]);

      const productivePercentage = roundToThree(
        Math.min(
          (productiveTime / parseFloat(targets[MetricNames.PRODUCTIVITY])) *
            100,
          100
        )
      );
      const hoursFreePercentage = roundToThree(
        Math.min(
          (hoursFree / parseFloat(targets[MetricNames.HOURS_FREE])) * 100,
          100
        )
      );
      const efficiencyPercentage = roundToThree(
        Math.min(
          (roundToThree((productiveTime / hoursFree) * 100) /
            parseFloat(targets[MetricNames.EFFICIENCY])) *
            100,
          100
        )
      );
      const unplannedTimePercentage = roundToThree(
        Math.min(
          (parseFloat(targets[MetricNames.UNPLANNED_TIME]) / unplannedTime) *
            100,
          100
        )
      );
      const p1HUTPercentage = roundToThree(
        Math.min((p1HUT / parseFloat(targets[MetricNames.P1HUT])) * 100, 100)
      );
      const n1HUTPercentage = roundToThree(
        Math.min((n1HUT / parseFloat(targets[MetricNames.N1HUT])) * 100, 100)
      );
      const unproductivePercentage = roundToThree(
        Math.min(
          (parseFloat(targets[MetricNames.UNPRODUCTIVE]) / w1HUT) * 100,
          100
        )
      );
      const oneHUTPercentage = roundToThree(
        Math.min(
          ((p1HUT + n1HUT + nw1HUT + w1HUT) /
            parseFloat(targets[MetricNames.ONE_HUT])) *
            100,
          100
        )
      );
      const oneHUTEfficiencyPercentage = roundToThree(
        Math.min(
          (roundToThree((p1HUT / hoursFree) * 100) /
            parseFloat(targets[MetricNames.ONE_HUT_EFFICIENCY])) *
            100,
          100
        )
      );
      const distractionCountPercentage = roundToThree(
        Math.min(
          (parseFloat(targets[MetricNames.DISTRACTION_COUNT]) /
            distraction_count) *
            100,
          100
        )
      );

      const newMetricsData = metricsData.map((data, index) => {
        return {
          metric: data.metric,
          prevScore: data.score,
          score:
            data.metric === "Hours Free (h)"
              ? hoursFree
              : data.metric === "Total Flow Time (h)"
              ? p1HUT + n1HUT + nw1HUT + w1HUT
              : data.metric === "Unplanned Time (h)"
              ? unplannedTime
              : data.metric === "Distraction #"
              ? distraction_count
              : data.metric === "Productive Flow (h)"
              ? p1HUT
              : data.metric === "Neutral Flow (h)"
              ? n1HUT
              : data.metric === "Unproductive Flow (h)"
              ? w1HUT
              : data.metric === "Prod. Flow Efficiency (%)"
              ? roundToThree((p1HUT / hoursFree) * 100)
              : data.metric === "Efficiency (%)"
              ? roundToThree((productiveTime / hoursFree) * 100)
              : roundToThree(productiveTime),
          percentageOfTarget:
            data.metric === "Hours Free (h)"
              ? 100
              : data.metric === "Total Flow Time (h)"
              ? oneHUTPercentage
              : data.metric === "Unplanned Time (h)"
              ? unplannedTimePercentage
              : data.metric === "Distraction #"
              ? distractionCountPercentage
              : data.metric === "Productive Flow (h)"
              ? p1HUTPercentage
              : data.metric === "Neutral Flow (h)"
              ? 100
              : data.metric === "Unproductive Flow (h)"
              ? unproductivePercentage
              : data.metric === "Prod. Flow Efficiency (%)"
              ? oneHUTEfficiencyPercentage
              : data.metric === "Efficiency (%)"
              ? efficiencyPercentage
              : productivePercentage,
          targetScore: targets[data.metric],
          color: getColorForPercentage(
            data.metric === "Hours Free (h)"
              ? -1
              : data.metric === "Total Flow Time (h)"
              ? oneHUTPercentage
              : data.metric === "Unplanned Time (h)"
              ? unplannedTimePercentage
              : data.metric === "Distraction #"
              ? distractionCountPercentage
              : data.metric === "Productive Flow (h)"
              ? p1HUTPercentage
              : data.metric === "Neutral Flow (h)"
              ? 100
              : data.metric === "Unproductive Flow (h)"
              ? unproductivePercentage
              : data.metric === "Prod. Flow Efficiency (%)"
              ? oneHUTEfficiencyPercentage
              : data.metric === "Efficiency (%)"
              ? efficiencyPercentage
              : productivePercentage,
            flow
          ),
        };
      });

      setMetricsData(newMetricsData);
      console.log(newMetricsData);

      setData(result);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData(); // Fetch data immediately on component mount
    const interval = setInterval(() => {
      timeLeftRef.current += 1;
      setTimeLeft(timeLeftRef.current);
      // console.log(`${timeLeftRef.current} second passed`);
      if (timeLeftRef.current === refreshTime - 2) {
        fetchData();
      }
      if (timeLeftRef.current === refreshTime) {
        timeLeftRef.current = 0;
        setTimeLeft(timeLeftRef.current);
      }
    }, pollingInterval); // Set up polling

    return () => {
      clearInterval(interval); // Clear the interval
    };
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
      <div className="flex flex-col flex-1 overflow-hidden">
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
            "flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 dark:bg-gray-900",
            flow > 0.8 &&
              "dark:bg-gradient-to-t dark:from-green-800 dark:via-gray-900 dark:to-gray-900",
            flow > 1.5 &&
              "dark:bg-gradient-to-t dark:from-purple-800 dark:via-gray-900 dark:to-gray-900",
            flow > 2.5 &&
              "dark:bg-gradient-to-t dark:from-red-800 dark:via-gray-900 dark:to-gray-900"
          )}
        >
          <div className="container mx-auto px-6 py-8">
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
                barData={barData}
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
                title={"Productive vs Free Hours (h)"}
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
            <AreaGraph
              data={dailyData}
              title={"Daily Productive Flow (h) over past 3 Months"}
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
              data={monthlyData}
              className="h-[400px]"
              title={"Weekly Productive Flow (h) over past Year"}
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
          </div>
        </main>
      </div>
    </div>
  );
}

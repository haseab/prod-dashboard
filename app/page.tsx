"use client";
import AreaGraph from "@/components/area";
/**
 * v0 by Vercel.
 * @see https://v0.dev/t/hvlLaq4V3o9
 */
import BarGraph from "@/components/bar";
import MetricComponent from "@/components/metric";
import { Title } from "@tremor/react";
import { useEffect, useRef, useState } from "react";
import { BarData, ChartData } from "./constant";
import { roundToThree } from "./utils";

const refreshTime = 30;
const pollingInterval = 1000;

const targets = {
  hours_free: "80.5",
  adhoc_time: "0",
  oneHUT: "50",
  p1HUT: "40",
  n1HUT: "15",
  nw1HUT: "15",
  w1HUT: "2.5",
  distraction_count: "1500",
};

declare interface MetricData {
  metric: string;
  score: number;
  percentageOfTarget: number;
  targetScore: string;
}

declare interface MetricsResponse {
  adhocTimeList: { [key: string]: number };
  oneHUTList: { [key: string]: number };
  p1HUTList: { [key: string]: number };
  n1HUTList: { [key: string]: number };
  nw1HUTList: { [key: string]: number };
  w1HUTList: { [key: string]: number };
  hoursFreeList: { [key: string]: number };
  distractionCountList: { [key: string]: number };
  // efficiencyList: (presumably an array of numbers or a specific object structure)
}

const weekdays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export default function Component() {
  const [data, setData] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [timeLeft, setTimeLeft] = useState(refreshTime);
  const timeLeftRef = useRef(0);
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
    [
      "Hours Free",
      "1HUT Time",
      "Ad Hoc Time",
      "Distraction #",
      "p1HUT Time",
      "n1HUT",
      "nw1HUT",
      "w1HUT",
    ].map((metric) => ({
      metric,
      score: 0,
      percentageOfTarget: 0,
      targetScore: "100",
    }))
  );

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
        adhocTimeList,
        oneHUTList,
        p1HUTList,
        n1HUTList,
        nw1HUTList,
        w1HUTList,
        hoursFreeList,
        distractionCountList,
        // efficiencyList,
      } = data as MetricsResponse;

      const sumValues = (obj: Record<string, number>) =>
        Object.values(obj).reduce((a, b) => a + b, 0);

      const p1HUT = sumValues(p1HUTList);
      const n1HUT = sumValues(n1HUTList);
      const nw1HUT = sumValues(nw1HUTList);
      const w1HUT = sumValues(w1HUTList);
      const hours_free = sumValues(hoursFreeList);
      const distraction_count = sumValues(distractionCountList);
      const adhoc_time = sumValues(adhocTimeList);

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
        const adhocTimeValue = Object.values(adhocTimeList)[index];
        return {
          ...item,
          value: adhocTimeValue || item["value"],
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

      const newMetricsData = [
        {
          metric: "Hours Free",
          score: hours_free,
          percentageOfTarget: roundToThree(
            Math.min((hours_free / parseFloat(targets.hours_free)) * 100, 100)
          ),
          targetScore: targets.hours_free,
        },
        {
          metric: "1HUT Time",
          score: p1HUT + n1HUT + nw1HUT + w1HUT,
          percentageOfTarget: roundToThree(
            Math.min(
              ((p1HUT + n1HUT + nw1HUT + w1HUT) / parseFloat(targets.oneHUT)) *
                100,
              100
            )
          ),
          targetScore: targets.oneHUT,
        },
        {
          metric: "Ad Hoc Time",
          score: adhoc_time,
          percentageOfTarget: roundToThree(
            Math.min(
              ((parseFloat(targets.hours_free) - adhoc_time) /
                parseFloat(targets.hours_free)) *
                100,
              100
            )
          ),
          targetScore: targets.adhoc_time,
        },
        {
          metric: "Distraction #",
          score: distraction_count,
          percentageOfTarget: roundToThree(
            Math.min(
              (distraction_count / parseFloat(targets.distraction_count)) * 100,
              100
            )
          ),
          targetScore: targets.distraction_count,
        },
        {
          metric: "p1HUT Time",
          score: p1HUT,
          percentageOfTarget: roundToThree(
            Math.min((p1HUT / parseFloat(targets.p1HUT)) * 100, 100)
          ),
          targetScore: targets.p1HUT,
        },
        {
          metric: "n1HUT",
          score: n1HUT,
          percentageOfTarget: roundToThree(
            Math.min((n1HUT / parseFloat(targets.n1HUT)) * 100, 100)
          ),
          targetScore: targets.n1HUT,
        },
        {
          metric: "nw1HUT",
          score: nw1HUT,
          percentageOfTarget: roundToThree(
            Math.min((nw1HUT / parseFloat(targets.nw1HUT)) * 100, 100)
          ),
          targetScore: targets.nw1HUT,
        },
        {
          metric: "w1HUT",
          score: w1HUT,
          percentageOfTarget: roundToThree(
            Math.min((w1HUT / parseFloat(targets.w1HUT)) * 100, 100)
          ),
          targetScore: targets.w1HUT,
        },
      ];

      setMetricsData(newMetricsData);

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
        </header>
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 dark:bg-gray-900">
          <div className="container mx-auto px-6 py-8">
            <Title className="grid gap-6 mb-8 text-center">
              Refreshing in {refreshTime - timeLeftRef.current} seconds
            </Title>
            <div className="grid gap-6 mb-8 md:grid-cols-2 xl:grid-cols-4 mt-5">
              {metricsData.map((data, index) => (
                <MetricComponent
                  key={index}
                  metric={data.metric}
                  score={data.score}
                  percentageOfTarget={data.percentageOfTarget}
                  targetScore={data.targetScore}
                />
              ))}
            </div>
            <div className="grid gap-6 lg:grid-cols-3">
              <BarGraph barData={barData} category="Ad Hoc Time" />
              <AreaGraph chartData={chartData} />
              <BarGraph barData={distractionData} category="# Distractions" />
            </div>
            <br></br>
          </div>
        </main>
      </div>
    </div>
  );
}

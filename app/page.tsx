"use client";
import { MetricData, MetricsResponse } from "@/app/constant";
import AreaGraph from "@/components/area";
import BarGraph from "@/components/bar";
import { FlowImg } from "@/components/flowicon";
import MetricComponent from "@/components/metric";
import { cn } from "@/lib/utils";
import { Title } from "@tremor/react";
import { useEffect, useRef, useState } from "react";
import { BarData, ChartData, EfficiencyData } from "./constant";
import { roundToThree } from "./utils";

const refreshTime = 30;
const pollingInterval = 1000;

const targets = {
  hoursFree: "80.5",
  adhocTime: "0",
  oneHUT: "50",
  p1HUT: "40",
  n1HUT: "15",
  nw1HUT: "15",
  w1HUT: "2.5",
  productiveTime: "50",
  oneHUTEfficiency: "45",
  efficiency: "45",
  distraction_count: "1500",
};

function getColorForPercentage(percentage: number) {
  if (percentage >= 95) return "purple";
  if (percentage >= 80 && percentage < 95) return "indigo";
  if (percentage >= 60 && percentage < 80) return "cyan";
  if (percentage >= 40 && percentage < 60) return "yellow";
  if (percentage >= 10 && percentage < 40) return "orange";
  return "red"; // For less than 10%
}

const weekdays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export default function Component() {
  const [data, setData] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [timeLeft, setTimeLeft] = useState(refreshTime);
  const [inFlow, setInFlow] = useState(false);
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
      score: "0",
      percentageOfTarget: 0,
      targetScore: "100",
      color: "blue",
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
        efficiencyList,
        productiveList,
        flow,
      } = data as MetricsResponse;

      setInFlow(flow);

      const sumValues = (obj: Record<string, number>) =>
        Object.values(obj).reduce((a, b) => a + b, 0);

      const p1HUT = sumValues(p1HUTList);
      const n1HUT = sumValues(n1HUTList);
      const nw1HUT = sumValues(nw1HUTList);
      const w1HUT = sumValues(w1HUTList);
      const hoursFree = sumValues(hoursFreeList);
      const distraction_count = sumValues(distractionCountList);
      const adhocTime = sumValues(adhocTimeList);
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
      const productivePercentage = roundToThree(
        Math.min(
          (productiveTime / parseFloat(targets.productiveTime)) * 100,
          100
        )
      );
      const hoursFreePercentage = roundToThree(
        Math.min((hoursFree / parseFloat(targets.hoursFree)) * 100, 100)
      );
      const efficiencyPercentage = roundToThree(
        Math.min(
          (roundToThree((productiveTime / hoursFree) * 100) /
            parseFloat(targets.efficiency)) *
            100,
          100
        )
      );
      const adhocTimePercentage = roundToThree(
        Math.min(
          ((parseFloat(targets.hoursFree) - adhocTime) /
            parseFloat(targets.hoursFree)) *
            100,
          100
        )
      );
      const p1HUTPercentage = roundToThree(
        Math.min((p1HUT / parseFloat(targets.p1HUT)) * 100, 100)
      );
      const n1HUTPercentage = roundToThree(
        Math.min((n1HUT / parseFloat(targets.n1HUT)) * 100, 100)
      );
      const nw1HUTPercentage = roundToThree(
        Math.min((nw1HUT / parseFloat(targets.nw1HUT)) * 100, 100)
      );
      const w1HUTPercentage = roundToThree(
        Math.min((w1HUT / parseFloat(targets.w1HUT)) * 100, 100)
      );
      const oneHUTPercentage = roundToThree(
        Math.min(
          ((p1HUT + n1HUT + nw1HUT + w1HUT) / parseFloat(targets.oneHUT)) * 100,
          100
        )
      );
      const oneHUTEfficiencyPercentage = roundToThree(
        Math.min(
          (roundToThree((p1HUT / hoursFree) * 100) /
            parseFloat(targets.oneHUTEfficiency)) *
            100,
          100
        )
      );
      const distractionCountPercentage = roundToThree(
        Math.min(
          (distraction_count / parseFloat(targets.distraction_count)) * 100,
          100
        )
      );

      const newMetricsData = [
        {
          metric: "Productivity",
          score: roundToThree(productiveTime).toString(),
          percentageOfTarget: productivePercentage,
          targetScore: targets.productiveTime,
          color: getColorForPercentage(productivePercentage),
        },
        {
          metric: "Hours Free",
          score: roundToThree(hoursFree).toString(),
          percentageOfTarget: hoursFreePercentage,
          targetScore: targets.hoursFree,
          color: getColorForPercentage(hoursFreePercentage),
        },
        {
          metric: "Efficiency",
          score:
            roundToThree((productiveTime / hoursFree) * 100).toString() + "%",
          percentageOfTarget: efficiencyPercentage,
          targetScore: targets.efficiency,
          color: getColorForPercentage(efficiencyPercentage),
        },
        {
          metric: "w1HUT",
          score: roundToThree(w1HUT).toString(),
          percentageOfTarget: w1HUTPercentage,
          targetScore: targets.w1HUT,
          color: getColorForPercentage(w1HUTPercentage),
        },
        {
          metric: "Ad Hoc Time",
          score: roundToThree(adhocTime).toString(),
          percentageOfTarget: adhocTimePercentage,
          targetScore: targets.adhocTime,
          color: getColorForPercentage(adhocTimePercentage),
        },
        {
          metric: "p1HUT Time",
          score: roundToThree(p1HUT).toString(),
          percentageOfTarget: p1HUTPercentage,
          targetScore: targets.p1HUT,
          color: getColorForPercentage(p1HUTPercentage),
        },
        {
          metric: "1HUT Time",
          score: roundToThree(p1HUT + n1HUT + nw1HUT + w1HUT).toString(),
          percentageOfTarget: oneHUTPercentage,
          targetScore: targets.oneHUT,
          color: getColorForPercentage(oneHUTPercentage),
        },
        {
          metric: "1HUT Efficiency",
          score: roundToThree((p1HUT / hoursFree) * 100).toString() + "%",
          percentageOfTarget: oneHUTEfficiencyPercentage,
          targetScore: targets.oneHUTEfficiency,
          color: getColorForPercentage(oneHUTEfficiencyPercentage),
        },
        {
          metric: "n1HUT",
          score: roundToThree(n1HUT).toString(),
          percentageOfTarget: n1HUTPercentage,
          targetScore: targets.n1HUT,
          color: getColorForPercentage(n1HUTPercentage),
        },
        {
          metric: "Distraction #",
          score: distraction_count.toString(),
          percentageOfTarget: distractionCountPercentage,
          targetScore: targets.distraction_count,
          color: getColorForPercentage(distractionCountPercentage),
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
        <main
          className={cn(
            "flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 dark:bg-gray-900",
            inFlow &&
              "dark:bg-gradient-to-t dark:from-purple-800 dark:via-gray-900 dark:to-gray-900"
          )}
        >
          <div className="container mx-auto px-6 py-8">
            {inFlow && (
              <>
                <FlowImg top="20%" left="18%" />
                <FlowImg top="16%" left="82%" />
                <FlowImg top="16%" left="35%" />
                <FlowImg top="16%" left="65%" />
                <FlowImg top="16%" left="82%" />
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
                  score={data.score.toString()}
                  percentageOfTarget={data.percentageOfTarget}
                  targetScore={data.targetScore}
                  color={data.color}
                />
              ))}
            </div>
            <div className="grid gap-6 lg:grid-cols-4">
              <BarGraph
                barData={barData}
                category="Ad Hoc Time"
                color={"blue"}
              />
              <AreaGraph
                chartData={chartData}
                title={"p1HUT vs 1HUT"}
                categories={["p1HUT", "oneHUT"]}
                colors={["blue", "gray"]}
              />
              <AreaGraph
                efficiencyData={efficiencyData}
                title={"Productive vs Hours Free"}
                categories={["productiveTime", "hoursFree"]}
                colors={["blue", "gray"]}
              />
              <BarGraph
                barData={distractionData}
                category="# Distractions"
                color={"blue"}
              />
            </div>
            <br></br>
          </div>
        </main>
      </div>
    </div>
  );
}

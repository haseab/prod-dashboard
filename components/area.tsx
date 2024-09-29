"use client";

import { AvailableChartColorsKeys } from "@/app/lib/chart-utils";
import { AreaChart } from "@/components/tremor/AreaChart";
import { roundToTwo } from "@/lib/utils";
import { ChartData, DailyData, EfficiencyData, MonthlyData } from "@/types";
import {
  Card,
  Color,
  Dialog,
  ProgressBar,
  Subtitle,
  Title,
} from "@tremor/react";
import { Info, XIcon } from "lucide-react";
import { useState } from "react";

export default function AreaGraph({
  data = [],
  title,
  categories, // Add a new prop for categories
  colors,
  index,
  className,
  tooltip,
  minutesLeft,
  timeUnits,
  liveCategory,
  neutralActivity,
}: {
  data?:
    | ChartData[]
    | EfficiencyData[]
    | MonthlyData[]
    | DailyData[]
    | Record<any, any>[];
  title: string;
  categories: string[]; // Define the type for categories
  colors: string[];
  index: string;
  className?: string;
  tooltip?: string;
  minutesLeft?: number;
  timeUnits?: string;
  liveCategory?: string;
  neutralActivity?: boolean;
}) {
  const [showDialog, setShowDialog] = useState(false);

  return (
    <div className="flex w-full">
      <Card>
        <div className="flex items-center justify-between space-x-3 ">
          <Title className="text-[1rem] sm:text-lg">{title}</Title>
          {minutesLeft && timeUnits && !neutralActivity ? (
            <div className="flex flex-col items-center space-y-1 mb-2 w-[280px] border rounded-lg border-gray-600 p-2">
              <span>{`Logging next point in ${
                timeUnits === "seconds"
                  ? minutesLeft * 60
                  : roundToTwo(minutesLeft)
              } ${timeUnits}`}</span>
              <ProgressBar
                value={
                  timeUnits === "seconds"
                    ? minutesLeft * 200
                    : minutesLeft / 0.6
                }
                color={colors[0] as Color}
                className="w-full"
              />
            </div>
          ) : (
            <button
              onClick={() => {
                setShowDialog(true);
              }}
            >
              <Info size={15} color={"white"} />
            </button>
          )}
        </div>
        <AreaChart
          className={"h-80 " + className}
          data={data}
          index={index}
          yAxisWidth={30}
          categories={categories}
          colors={colors as AvailableChartColorsKeys[]}
          liveCategory={liveCategory}
          // valueFormatter={valueFormatter}
        />
      </Card>
      <Dialog
        open={showDialog}
        onClose={() => {
          setShowDialog(false);
        }}
      >
        <Card className="flex max-w-md ">
          <div>
            <Title>{title}</Title>
            <Subtitle>{tooltip?.split("\n")[0]}</Subtitle>
            <br></br>
            <Title>Why I track this</Title>
            <Subtitle>{tooltip?.split("\n")[1]}</Subtitle>
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
  );
}

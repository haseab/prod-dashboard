"use client";

import { ChartData, DailyData, EfficiencyData, MonthlyData } from "@/types";
import { AreaChart, Card, Dialog, Subtitle, Title } from "@tremor/react";
import { Info, XIcon } from "lucide-react";
import { useState } from "react";

// const valueFormatter = function (number: number) {
//   return "$ " + new Intl.NumberFormat("us").format(number).toString();
// };

export default function AreaGraph({
  data = [],
  title,
  categories, // Add a new prop for categories
  colors,
  index,
  className,
  tooltip,
}: {
  data?: ChartData[] | EfficiencyData[] | MonthlyData[] | DailyData[];
  title: string;
  categories: string[]; // Define the type for categories
  colors: string[];
  index: string;
  className?: string;
  tooltip?: string;
}) {
  const [showDialog, setShowDialog] = useState(false);

  return (
    <>
      <Card>
        <div className="flex items-center justify-between space-x-3 ">
          <Title className="text-[1rem] sm:text-lg">{title}</Title>
          <button
            onClick={() => {
              setShowDialog(true);
            }}
          >
            <Info size={15} color={"white"} />
          </button>
        </div>
        <AreaChart
          className={"h-80 " + className}
          data={data}
          index={index}
          yAxisWidth={30}
          rotateLabelX={{ angle: 0 }}
          categories={categories}
          colors={colors}
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
            <XIcon />
          </button>
        </Card>
      </Dialog>
    </>
  );
}

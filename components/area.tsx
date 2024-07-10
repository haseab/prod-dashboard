"use client";

import Tooltip from "@/components/tooltip";
import { useMobile } from "@/hooks/use-mobile";
import { ChartData, DailyData, EfficiencyData, MonthlyData } from "@/types";
import { AreaChart, Card, Title } from "@tremor/react";
import { Info } from "lucide-react";

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
  const isMobile = useMobile();
  // const data = chartData.length === 0 ? efficiencyData : chartData;

  return (
    <Card>
      <div className="flex items-center justify-between space-x-3 ">
        <Title>{title}</Title>
        {!isMobile && (
          <Tooltip tooltip={tooltip}>
            <Info size={15} color={"white"} />
          </Tooltip>
        )}
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
  );
}

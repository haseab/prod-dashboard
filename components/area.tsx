"use client";

import { ChartData, DailyData, EfficiencyData, MonthlyData } from "@/types";
import { AreaChart, Card, Title } from "@tremor/react";

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
}: {
  data?: ChartData[] | EfficiencyData[] | MonthlyData[] | DailyData[];
  title: string;
  categories: string[]; // Define the type for categories
  colors: string[];
  index: string;
  className?: string;
}) {
  // const data = chartData.length === 0 ? efficiencyData : chartData;

  return (
    <Card>
      <Title>{title}</Title>
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

"use client";
import { ChartData, EfficiencyData } from "@/app/constant";
import { AreaChart, Card, Title } from "@tremor/react";

// const valueFormatter = function (number: number) {
//   return "$ " + new Intl.NumberFormat("us").format(number).toString();
// };

export default function AreaGraph({
  chartData = [],
  efficiencyData = [],
  categories, // Add a new prop for categories
  colors,
}: {
  chartData?: ChartData[];
  efficiencyData?: EfficiencyData[];
  categories: string[]; // Define the type for categories
  colors: string[];
}) {
  const data = chartData.length === 0 ? efficiencyData : chartData;

  return (
    <Card>
      <Title>1HUT vs Hours Free</Title>
      <AreaChart
        className="h-80 mt-4"
        data={data}
        index="date"
        yAxisWidth={20}
        categories={categories}
        colors={colors}
        // valueFormatter={valueFormatter}
      />
    </Card>
  );
}

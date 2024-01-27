"use client";
import { ChartData } from "@/app/constant";
import { AreaChart, Card, Title } from "@tremor/react";

// const valueFormatter = function (number: number) {
//   return "$ " + new Intl.NumberFormat("us").format(number).toString();
// };

export default function AreaGraph({ chartData }: { chartData: ChartData[] }) {
  return (
    <Card>
      <Title>1HUT vs Hours Free</Title>
      <AreaChart
        className="h-80 mt-4"
        data={chartData}
        index="date"
        yAxisWidth={20}
        categories={["oneHUT", "p1HUT"]}
        colors={["indigo", "cyan"]}
        // valueFormatter={valueFormatter}
      />
    </Card>
  );
}

import { BarData } from "@/app/constant";
import { BarChart, Card, Subtitle, Title } from "@tremor/react";

const BarGraph = ({
  barData,
  category,
}: {
  barData: BarData[];
  category: string;
}) => (
  <Card>
    <Title>{category}</Title>
    <Subtitle></Subtitle>
    <BarChart
      className="mt-6"
      data={barData}
      index="date"
      categories={["value"]}
      colors={["blue"]}
      yAxisWidth={20}
    />
  </Card>
);

export default BarGraph;

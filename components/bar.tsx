import { BarData } from "@/app/constant";
import { BarChart, Card, Subtitle, Title } from "@tremor/react";

const BarGraph = ({
  barData,
  category,
  color,
}: {
  barData: BarData[];
  category: string;
  color: string;
}) => (
  <Card>
    <Title>{category}</Title>
    <Subtitle></Subtitle>
    <BarChart
      className="mt-6"
      data={barData}
      index="date"
      categories={["value"]}
      colors={[color]}
      yAxisWidth={30}
    />
  </Card>
);

export default BarGraph;

import { TremorColors } from "@/app/constant";
import { Card, Flex, Metric, ProgressBar, Text } from "@tremor/react";
import Number from "./number";

// Define the props that the component will accept
const MetricComponent = ({
  metric,
  prevScore,
  score,
  percentageOfTarget,
  targetScore,
  color,
}: {
  metric: string;
  prevScore: string;
  score: string;
  percentageOfTarget: number;
  targetScore: string;
  color: TremorColors;
}) => (
  <Card className="max-w-xs mx-auto">
    <Text>{metric}</Text>
    <Metric>
      <Number num={parseFloat(prevScore)} newNum={parseFloat(score)} />
    </Metric>
    <Flex className="mt-4">
      <Text>{`${percentageOfTarget}% of target`}</Text>
      <Text>{`${targetScore}`}</Text>
    </Flex>
    <ProgressBar value={percentageOfTarget} color={color} className="mt-2" />
  </Card>
);

export default MetricComponent;

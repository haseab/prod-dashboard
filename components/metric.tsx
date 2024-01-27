import { Card, Flex, Metric, ProgressBar, Text } from "@tremor/react";

// Define the props that the component will accept
const MetricComponent = ({
  metric,
  score,
  percentageOfTarget,
  targetScore,
}: {
  metric: string;
  score: number;
  percentageOfTarget: number;
  targetScore: string;
}) => (
  <Card className="max-w-xs mx-auto">
    <Text>{metric}</Text>
    <Metric>{`${score.toLocaleString()}`}</Metric>
    <Flex className="mt-4">
      <Text>{`${percentageOfTarget}% of target`}</Text>
      <Text>{`${targetScore.toLocaleString()}`}</Text>
    </Flex>
    <ProgressBar value={percentageOfTarget} className="mt-2" />
  </Card>
);

export default MetricComponent;

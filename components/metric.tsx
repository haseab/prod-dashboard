import Tooltip from "@/components/tooltip";
import { TremorColors } from "@/types";
import { Card, Flex, Metric, ProgressBar } from "@tremor/react";
import Number from "./number";

// Define the props that the component will accept
const MetricComponent = ({
  metric,
  prevScore,
  score,
  percentageOfTarget,
  targetScore,
  color,
  tooltip,
}: {
  metric: string;
  prevScore: number;
  score: number;
  percentageOfTarget: number;
  targetScore: string;
  tooltip?: string;
  color: TremorColors;
}) => (
  <Card className="max-w-xs mx-auto">
    <Tooltip tooltip={tooltip}>
      <p className="text-sm text-gray-400">{metric}</p>
    </Tooltip>
    <Metric>
      <Number num={prevScore} newNum={score} />
    </Metric>
    <Flex className="mt-4">
      <p className="text-sm text-gray-400">{`${percentageOfTarget}% of target`}</p>
      <p className="text-sm text-gray-400">{`${targetScore}`}</p>
    </Flex>
    <ProgressBar value={percentageOfTarget} color={color} className="mt-2" />
  </Card>
);

export default MetricComponent;

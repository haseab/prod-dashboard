"use client";
import Tooltip from "@/components/tooltip";
import { useMobile } from "@/hooks/use-mobile";
import { TremorColors } from "@/types";
import { Card, Flex, Metric, ProgressBar } from "@tremor/react";
import { Info } from "lucide-react";
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
}) => {
  const isMobile = useMobile();
  return (
    <Card className="max-w-xs mx-auto">
      <div className="flex items-center justify-between space-x-2">
        <div className="text-sm inline text-gray-400 w-full">{metric}</div>
        {!isMobile && (
          <Tooltip tooltip={tooltip}>
            <Info size={15} />
          </Tooltip>
        )}
      </div>
      <Metric>
        <Number num={prevScore} newNum={score} />
      </Metric>
      <Flex className="mt-4">
        <p className="text-sm text-gray-400">{`${Math.floor(
          percentageOfTarget
        )}% of target`}</p>
        <p className="text-sm text-gray-400">{`${targetScore}`}</p>
      </Flex>
      <ProgressBar value={percentageOfTarget} color={color} className="mt-2" />
    </Card>
  );
};

export default MetricComponent;

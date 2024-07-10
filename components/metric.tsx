"use client";
import { TremorColors } from "@/types";
import { Card, Dialog, Flex, Metric, ProgressBar, Title } from "@tremor/react";
import { Info, XIcon } from "lucide-react";
import { useState } from "react";
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
  const [showDialog, setShowDialog] = useState(false);
  return (
    <Card className="max-w-xs mx-auto">
      <div className="flex items-center justify-between space-x-2">
        <div className="text-sm inline text-gray-400 w-full">{metric}</div>
        <button
          onClick={() => {
            setShowDialog(true);
          }}
        >
          <Info size={15} color={"white"} />
        </button>
        <Dialog
          open={showDialog}
          onClose={() => {
            setShowDialog(false);
          }}
        >
          <Card className="flex max-w-md">
            <div>
              <Title>{metric}</Title>
              <div>{tooltip}</div>
            </div>
            <button
              className="flex justify-start"
              onClick={() => {
                setShowDialog(false);
              }}
            >
              <XIcon />
            </button>
          </Card>
        </Dialog>
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

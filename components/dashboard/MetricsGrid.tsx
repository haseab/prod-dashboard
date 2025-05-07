"use client";

import MetricComponent from "@/components/metric";
import { MetricData } from "../../types"; // Adjusted path

interface MetricsGridProps {
  metricsData: MetricData[];
}

export default function MetricsGrid({ metricsData }: MetricsGridProps) {
  return (
    <div className="grid gap-6 p-5 xs:grid-cols-2 lg:col-span-2 z-10">
      {metricsData.map((data, index) => (
        <MetricComponent
          key={index}
          metric={data.metric}
          prevScore={data.prevScore}
          score={data.score}
          percentageOfTarget={data.percentageOfTarget}
          targetScore={data.targetScore}
          color={data.color}
          tooltip={data.tooltip}
        />
      ))}
    </div>
  );
}

"use client";

import AreaGraph from "@/components/area";
import { ChartData, EfficiencyData } from "../../types"; // Adjusted path

interface DualAreaChartsProps {
  flow: number;
  dailyProductiveFlowData: ChartData[];
  efficiencyData: EfficiencyData[];
}

export default function DualAreaCharts({
  flow,
  dailyProductiveFlowData,
  efficiencyData,
}: DualAreaChartsProps) {
  return (
    <div className="flex flex-col space-y-5 sm:flex-row sm:space-x-5 sm:space-y-0">
      <AreaGraph
        data={dailyProductiveFlowData}
        title={"Productive Flow vs Total Flow"}
        categories={["productiveFlow", "totalFlow"]}
        colors={
          flow > 2.5
            ? ["red", "gray"]
            : flow > 1.5
            ? ["fuchsia", "slate"]
            : flow > 0.8334
            ? ["emerald", "slate"]
            : ["blue", "slate"]
        }
        index={"date"}
        liveCategory="productiveFlow"
        tooltip={
          "This graph shows how many of my flow hours were productive. Flow doesn't have to be productive, for instance I could be in a flow state while watching TV.\nI track this because It's a good visual to show how much of my flow time is productive on each day of the week. I ideally want this to be as close to 100% as possible."
        }
      />
      <AreaGraph
        data={efficiencyData}
        title={"Productive vs Free Hours"}
        categories={["productiveTime", "hoursFree"]}
        colors={
          flow > 2.5
            ? ["red", "gray"]
            : flow > 1.5
            ? ["fuchsia", "slate"]
            : flow > 0.8334
            ? ["emerald", "slate"]
            : ["blue", "slate"]
        }
        index={"date"}
        liveCategory="productiveTime"
        tooltip={
          "This graph shows the comparison of productive hours to hours of free time I had. Dividing these two numbers gives the Efficiency (%).\nI track this because it's a good visual to show how much of my free time is productive each day of the week. Allows me to monitor why some days are more productive than others."
        }
      />
    </div>
  );
}

"use client";

import AreaGraph from "@/components/area";
import { cx } from "@/lib/utils";
import { MonthlyData } from "../../types"; // Adjusted path

interface WeeklyProductiveFlowChartProps {
  weeklyProductiveFlowData: MonthlyData[];
  flow: number;
  showOnlyMA: boolean;
  showOnlyRaw: boolean;
  setShowOnlyMA: (value: boolean | ((prev: boolean) => boolean)) => void;
  setShowOnlyRaw: (value: boolean | ((prev: boolean) => boolean)) => void;
}

export default function WeeklyProductiveFlowChart({
  weeklyProductiveFlowData,
  flow,
  showOnlyMA,
  showOnlyRaw,
  setShowOnlyMA,
  setShowOnlyRaw,
}: WeeklyProductiveFlowChartProps) {
  return (
    <>
      <AreaGraph
        data={weeklyProductiveFlowData}
        className="h-[40vh]"
        title={"Weekly Productive Flow (h) Since 2023"}
        categories={
          showOnlyMA
            ? ["movingAverage"]
            : showOnlyRaw
            ? ["productiveFlow"]
            : ["productiveFlow", "movingAverage"]
        }
        colors={
          showOnlyMA
            ? ["slate"]
            : flow > 2.5
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
          "This graph shows the historical productive flow hours I've had each week since January 2023. The gray graph is a 4 week moving average of the productive flow hours to show the trends.\nI track this because it's a good visual to see how much high quality hours I really am putting in week on week. You can see the progress this year from last year has been incredible."
        }
      />
      <div className="mt-8 flex items-center justify-center space-x-4">
        <button
          className={cx(
            " bg-blue-800 w-15 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded",
            {
              "bg-green-700  border-green-400 border-2": flow > 0.8334,
              "bg-purple-700 border-purple-400 border-2": flow > 1.5,
              "bg-red-700 border-red-400 border-2": flow > 2.5,
            }
          )}
          onClick={() => setShowOnlyMA(!showOnlyMA)}
        >
          {showOnlyMA ? "Show Both" : "Show Only MA"}
        </button>
        <button
          className={cx(
            " bg-blue-800 w-15 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded",
            {
              "bg-green-700  border-green-400 border-2": flow > 0.8334,
              "bg-purple-700 border-purple-400 border-2": flow > 1.5,
              "bg-red-700 border-red-400 border-2": flow > 2.5,
            }
          )}
          onClick={() => setShowOnlyRaw(!showOnlyRaw)}
        >
          {showOnlyRaw ? "Show Both" : "Show Only Raw"}
        </button>
      </div>
    </>
  );
}

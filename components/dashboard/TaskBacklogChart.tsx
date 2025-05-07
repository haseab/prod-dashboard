"use client";

import AreaGraph from "@/components/area";
import { task_backlog } from "@prisma/client";

interface TaskBacklogChartProps {
  taskBacklogHistory: Pick<task_backlog, "id" | "amount" | "createdAt">[];
  flow: number;
  showOnlyMA: boolean;
  taskBacklogRefreshesLeft: number;
  neutralActivity: boolean;
}

export default function TaskBacklogChart({
  taskBacklogHistory,
  flow,
  showOnlyMA,
  taskBacklogRefreshesLeft,
  neutralActivity,
}: TaskBacklogChartProps) {
  return (
    <AreaGraph
      data={taskBacklogHistory.map((item, index) => ({
        day: item.id,
        "hours of planned tasks left": item.amount,
        date:
          index === taskBacklogHistory.length - 1
            ? "LIVE"
            : `${new Date(item.createdAt).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
              })} ${new Date(item.createdAt).toLocaleTimeString("en-GB", {
                hour: "numeric",
                minute: "2-digit",
                hour12: true,
              })}`,
      }))}
      className="h-[40vh]"
      title={"Hours of Planned Tasks Left (h)"}
      categories={["hours of planned tasks left"]}
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
      minutesLeft={taskBacklogRefreshesLeft / 4}
      timeUnits="minutes"
      liveCategory="hours of planned tasks left"
      neutralActivity={neutralActivity}
      tooltip={
        "This graph shows the status of how many hours of planned work is left on my to-do list. It refreshes every hour and if it goes down it means I'm completing more tasks than planning, and vice versa.\nI track this because this is single handedly the most useful metric for me to know if I'm moving the needle toward my goals. This is because my planned tasks are essentially my theory of the qucikest steps required to get closer to my goals, and if I can do what I say I will do, that's a good sign."
      }
    />
  );
}

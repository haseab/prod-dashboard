import { setLightColor } from "@/app/lib/light-actions";
import prisma from "@/app/lib/prisma";
import { updateBacklogToDb } from "@/app/lib/server-utils";
import { revalidateCache } from "@/lib/utils";
import { MetricsResponse } from "@/types";
import { unstable_cache } from "next/cache";

let prevTaskBacklogNumber = 0;
let prevFlowColour = "";
let count = 0;
let interval = 240;
let neutral = false;

export const revalidate = 15;

export async function GET(request: Request) {
  try {
    console.log("-----------------------");
    console.log("about to fetch time data");

    const url = new URL(request.url);
    const startDate = url.searchParams.get("startDate");
    const endDate = url.searchParams.get("endDate");

    const { data } = await fetchTimeData({ startDate, endDate });

    const {
      taskBacklog,
      neutralActivity,
      currentActivity,
      taskBacklogDetails,
    } = data as MetricsResponse;
    const currentFlowColour =
      data.flow > 2.5
        ? "red"
        : data.flow > 1.5
        ? "purple"
        : data.flow > 0.8334
        ? "green"
        : data.flow > 0.4167
        ? "blue"
        : "default";

    neutral = neutralActivity;

    console.log("prevTaskBacklogNumber", prevTaskBacklogNumber);
    console.log("taskBacklog", taskBacklog);

    console.log("prevFlowColour", prevFlowColour);
    console.log("currentFlowColour", currentFlowColour);

    let taskBacklogHistory;

    if (
      prevFlowColour &&
      currentFlowColour &&
      prevFlowColour !== currentFlowColour &&
      currentActivity !== "🤝 in a Meeting"
    ) {
      console.log("flow changed, changing lights...");
      setLightColor({
        flow: data.flow,
        deviceId: process.env.FLOOR_LAMP_DEVICE_ID || "",
        model: "H6008",
      });
      setLightColor({
        flow: data.flow,
        deviceId: process.env.TABLE_LAMP_DEVICE_ID || "",
        model: "H6008",
      });
    }

    prevFlowColour = currentFlowColour;

    if (count >= interval) {
      console.log("time to update db");
      await updateBacklogToDb(taskBacklog, taskBacklogDetails);
      // }
      prevTaskBacklogNumber = taskBacklog;
      count = 0;
    }

    taskBacklogHistory = await prisma.task_backlog.findMany({
      // where: {
      //   createdAt: {
      //     gte: new Date(startDate as string),
      //     lte: new Date(endDate as string),
      //   },
      // },
      select: {
        id: true,
        amount: true,
        createdAt: true,
      },
      orderBy: {
        createdAt: "asc",
      },
    });

    console.log("taskBacklogHistory");
    console.log(taskBacklogHistory.slice(taskBacklogHistory.length - 1));

    return new Response(
      JSON.stringify({
        data: {
          ...data,
          taskBacklogHistory,
          taskBacklogRefreshesLeft: interval - count,
        },
      }),
      {
        headers: { "content-type": "application/json" },
      }
    );
  } catch (error) {
    console.log("returning server error");
    console.error(error);
    return new Response("An error occurred", { status: 500 });
  }
}

const fetchTimeData = unstable_cache(
  async ({
    startDate,
    endDate,
  }: {
    startDate: string | null;
    endDate: string | null;
  }) => {
    try {
      let response;

      if (!startDate || !endDate) {
        response = await fetch(`${process.env.SERVER_URL}/metrics`);
      } else {
        response = await fetch(
          `${process.env.SERVER_URL}/metricsdate?startDate=${startDate}&endDate=${endDate}`
        );
      }

      // Check for network errors
      if (!response.ok) {
        throw new Error(`Fetch error: ${response.statusText}`);
      }

      if (!response.ok) {
        throw new Error(`An error occurred: ${response.statusText}`);
      }

      const data = await response.json();

      return data;
    } catch (error) {
      console.error("FetchTimeData error:", error);
      throw error;
    }
  },
  ["time"],
  {
    tags: ["time"],
  }
);

// Function to revalidate the 'time' tag
function startRevalidating() {
  setInterval(async () => {
    try {
      await revalidateCache(["time"]);
      console.log("Revalidated time tag");
      if (!neutral) {
        count++;
        console.log("non neutral, counting up to", count);
      } else {
        console.log("neutral activity detected, not counting");
      }
    } catch (error) {
      console.error("Error revalidating time tag", error);
    }
  }, 15000); // Revalidate every 30 seconds
}

// Start the revalidation process
startRevalidating();

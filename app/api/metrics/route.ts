import prisma from "@/app/lib/prisma";
import {
  sendAlert,
  updateBacklogToDb,
} from "@/app/lib/server-utils";
import { revalidateCache } from "@/lib/utils";
import { MetricsResponse } from "@/types";
import { unstable_cache } from "next/cache";

let prevTaskBacklogNumber = 0;
let prevFlowColour = "";
let count = 0;
let interval = 240;
let neutral = false;

export const revalidate = 15;

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    console.log("-----------------------");
    console.log("about to fetch time data");

    const url = new URL(request.url);
    const startDate = url.searchParams.get("startDate");
    const endDate = url.searchParams.get("endDate");

    const data = await fetchTimeData({ startDate, endDate });

    if (!data) {
      await sendAlert(
        "Data is undefined - Check server logs.",
        "timetracking.live Error",
        0
      );
      return new Response(
        JSON.stringify({
          error: "Data is undefined - Check server logs.",
        }),
        {
          status: 500,
          headers: { "content-type": "application/json" },
        }
      );
    }

    // Check if the response is an error
    if (
      data &&
      typeof data === "object" &&
      "error" in data &&
      "status" in data
    ) {
      console.log("Server returned error:", data);
      await sendAlert(
        `Server error: ${data.error} (status: ${data.status})`,
        "timetracking.live Error",
        0
      );
      return new Response(
        JSON.stringify({
          error: `Server Error: ${data.error}`,
        }),
        {
          status: data.status || 500,
          headers: { "content-type": "application/json" },
        }
      );
    }

    const { taskBacklog, neutralActivity, taskBacklogDetails } =
      data.data as MetricsResponse;
    const currentFlowColour =
      data.data.flow > 2.5
        ? "red"
        : data.data.flow > 1.5
        ? "purple"
        : data.data.flow > 0.8334
        ? "green"
        : data.data.flow > 0.4167
        ? "blue"
        : "default";

    neutral = neutralActivity;

    console.log("prevTaskBacklogNumber", prevTaskBacklogNumber);
    console.log("taskBacklog", taskBacklog);

    console.log("prevFlowColour", prevFlowColour);
    console.log("currentFlowColour", currentFlowColour);

    let taskBacklogHistory;

    // if (
    //   prevFlowColour &&
    //   currentFlowColour &&
    //   prevFlowColour !== currentFlowColour &&
    //   currentActivity !== "🤝 in a Meeting"
    // ) {
    //   console.log("flow changed, changing lights...");
    //   setLightColor({
    //     flow: data.flow,
    //     deviceId: process.env.FLOOR_LAMP_DEVICE_ID || "",
    //     model: "H6008",
    //   });
    //   setLightColor({
    //     flow: data.flow,
    //     deviceId: process.env.TABLE_LAMP_DEVICE_ID || "",
    //     model: "H6008",
    //   });
    // }

    prevFlowColour = currentFlowColour;

    if (count >= interval) {
      console.log("time to update db");
      await updateBacklogToDb(taskBacklog, taskBacklogDetails);
      // }
      prevTaskBacklogNumber = taskBacklog;
      count = 0;
    }

    taskBacklogHistory = await prisma.task_backlog.findMany({
      where: {
        createdAt: {
          gte: new Date("2025-11-17T00:00:00Z"),
        },
      },
      select: {
        id: true,
        amount: true,
        createdAt: true,
        deadline: true,
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
          ...data.data,
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
    await sendAlert(
      `API Error: ${error instanceof Error ? error.message : "Unknown error"}`,
      "timetracking.live Error",
      0
    );
    return new Response(
      JSON.stringify({
        error: "time entries are labeled incorrectly. check server logs",
      }),
      {
        status: 500,
        headers: { "content-type": "application/json" },
      }
    );
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

      console.log("fetchTimeData response:", data);
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

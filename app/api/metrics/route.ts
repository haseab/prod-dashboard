import prisma from "@/app/lib/prisma";
import { updatePileDb } from "@/app/lib/server-utils";
import { revalidateCache } from "@/lib/utils";
import { pile_history } from "@prisma/client";
import { unstable_cache } from "next/cache";

let prevTaskPileNumber = 0;
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

    const data = await fetchTimeData({ startDate, endDate });

    const { taskPile, neutralActivity } = data.data;

    neutral = neutralActivity;

    console.log("prevTaskPileNumber", prevTaskPileNumber);
    console.log("taskPile", taskPile);

    let pileHistory: pile_history[] = [];

    if (count >= interval) {
      // if (taskPile && prevTaskPileNumber !== 0) {
      console.log("time to update db");
      await updatePileDb(taskPile);
      // }
      prevTaskPileNumber = taskPile;
      count = 0;
    }

    pileHistory = await prisma.pile_history.findMany({
      // where: {
      //   createdAt: {
      //     gte: new Date(startDate as string),
      //     lte: new Date(endDate as string),
      //   },
      // },
      orderBy: {
        createdAt: "asc",
      },
    });

    console.log("pileHistory");
    console.log(pileHistory.slice(pileHistory.length - 1));

    return new Response(
      JSON.stringify({
        data: {
          ...data.data,
          pileHistory,
          pileRefreshesLeft: interval - count,
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

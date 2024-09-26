import prisma from "@/app/lib/prisma";
import { updatePileDb } from "@/app/lib/server-utils";
import { revalidateCache } from "@/lib/utils";
import { pile_history } from "@prisma/client";
import { unstable_cache } from "next/cache";

let prevTaskPileNumber = 0;
let count = 0;

export const revalidate = 15;

export async function GET(request: Request) {
  try {
    console.log("about to fetch time data");

    const url = new URL(request.url);
    const startDate = url.searchParams.get("startDate");
    const endDate = url.searchParams.get("endDate");

    const data = await fetchTimeData({ startDate, endDate });

    const { taskPile } = data.data;

    console.log("prevTaskPileNumber", prevTaskPileNumber);
    console.log("taskPile", taskPile);
    console.log("count", count);

    let pileHistory: pile_history[] = [];

    if (
      taskPile &&
      taskPile !== prevTaskPileNumber &&
      prevTaskPileNumber !== 0 &&
      count === 120
    ) {
      await updatePileDb(taskPile);
    }

    pileHistory = await prisma.pile_history.findMany({
      // where: {
      //   createdAt: {
      //     gte: new Date(startDate as string),
      //     lte: new Date(endDate as string),
      //   },
      // },
      orderBy: {
        createdAt: "desc",
      },
    });

    console.log("pileHistory");
    console.log(pileHistory);

    prevTaskPileNumber = taskPile;
    count++;

    return new Response(
      JSON.stringify({
        data: {
          ...data.data,
          pileHistory,
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

      console.log("response", response);

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
    } catch (error) {
      console.error("Error revalidating time tag", error);
    }
  }, 15000); // Revalidate every 30 seconds
}

// Start the revalidation process
startRevalidating();

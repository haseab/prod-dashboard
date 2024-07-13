import { revalidateCache } from "@/lib/utils";
import { unstable_cache } from "next/cache";

export async function GET() {
  try {
    const data = await fetchTimeData();

    console.log("returning data", data);

    return new Response(JSON.stringify(data), {
      headers: { "content-type": "application/json" },
    });
  } catch (error) {
    console.log("returning server error");
    console.error(error);
    return new Response("An error occurred", { status: 500 });
  }
}

const fetchTimeData = unstable_cache(
  async () => {
    try {
      const response = await fetch(`${process.env.SERVER_URL}/metrics`, {
        headers: {
          "cache-control": "no-store",
        },
      });

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

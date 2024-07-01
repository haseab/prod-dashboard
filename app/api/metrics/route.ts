export const revalidate = 25;

export async function GET() {
  console.log("GETTING /metrics");
  try {
    // unstable_noStore();
    const response = await fetch(`${process.env.SERVER_URL}/metrics`);

    if (!response.ok) {
      throw new Error("An error occurred");
    }

    const data = await response.json();

    return new Response(JSON.stringify(data), {
      headers: { "content-type": "application/json" },
    });
  } catch (error) {
    console.log("returning server error");
    console.error(error);
    return new Response("An error occurred", { status: 500 });
  }
}

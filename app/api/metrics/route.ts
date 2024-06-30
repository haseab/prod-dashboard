export async function GET() {
  console.log("GETTING /metrics");
  try {
    const response = await fetch(`${process.env.SERVER_URL}/metrics`, {
      next: { revalidate: 30 },
    });

    const data = await response.json();

    return new Response(JSON.stringify(data), {
      headers: { "content-type": "application/json" },
    });
  } catch (error) {
    console.error(error);
  }
}

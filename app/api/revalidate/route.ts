import { revalidateTag } from "next/cache";
import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  console.log("POST api/revalidate/route.ts");
  try {
    const body = await request.json();
    const { tags } = body;

    for (const tag of tags) {
      revalidateTag(tag);
    }
    return new Response(
      JSON.stringify({ revalidated: true, now: Date.now(), tags })
    );
  } catch (error) {
    if (error instanceof Error) {
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
      });
    } else {
      return new Response(JSON.stringify({ error: "Unknown error" }), {
        status: 500,
      });
    }
  }
}

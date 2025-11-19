import prisma from "@/app/lib/prisma";

export const dynamic = "force-dynamic";

// GET - Retrieve all unacknowledged notifications (any token grants access to all)
export async function GET(
  request: Request,
  { params }: { params: { token: string } }
) {
  try {
    const { token } = params;

    // Verify that the token exists in the database
    const tokenExists = await prisma.notifications.findUnique({
      where: { ackToken: token },
      select: { id: true },
    });

    if (!tokenExists) {
      return new Response(
        JSON.stringify({
          error: "Invalid token",
        }),
        {
          status: 404,
          headers: { "content-type": "application/json" },
        }
      );
    }

    // Token is valid - return ALL unacknowledged notifications
    const notifications = await prisma.notifications.findMany({
      where: {
        acknowledged: false,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return new Response(
      JSON.stringify({
        notifications,
      }),
      {
        headers: { "content-type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error fetching notifications by token:", error);
    return new Response(
      JSON.stringify({
        error: "Failed to fetch notifications",
      }),
      {
        status: 500,
        headers: { "content-type": "application/json" },
      }
    );
  }
}

import prisma from "@/app/lib/prisma";

export const dynamic = "force-dynamic";

const MAX_NOTIFICATIONS = 25;

const notificationSelect = {
  id: true,
  message: true,
  title: true,
  priority: true,
  createdAt: true,
  sendCount: true,
  ackToken: true,
};

// GET - Retrieve a capped list of actionable emergency notifications (any token grants access)
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

    const [notifications, totalUnacknowledged] = await Promise.all([
      prisma.notifications.findMany({
        where: {
          acknowledged: false,
          priority: 2,
        },
        orderBy: {
          createdAt: "desc",
        },
        take: MAX_NOTIFICATIONS,
        select: notificationSelect,
      }),
      prisma.notifications.count({
        where: {
          acknowledged: false,
          priority: 2,
        },
      }),
    ]);

    return new Response(
      JSON.stringify({
        notifications,
        totalUnacknowledged,
        returnedCount: notifications.length,
        maxReturned: MAX_NOTIFICATIONS,
        hasMore: totalUnacknowledged > notifications.length,
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

import prisma from "@/app/lib/prisma";

export const dynamic = "force-dynamic";

// POST - Acknowledge a notification
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { id } = body;

    if (!id) {
      return new Response(JSON.stringify({ error: "Notification ID is required" }), {
        status: 400,
        headers: { "content-type": "application/json" },
      });
    }

    const notification = await prisma.notifications.update({
      where: { id },
      data: {
        acknowledged: true,
        acknowledgedAt: new Date(),
      },
    });

    console.log(`Notification ${id} acknowledged at ${new Date().toISOString()}`);

    return new Response(
      JSON.stringify({
        success: true,
        notification,
      }),
      {
        headers: { "content-type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error acknowledging notification:", error);
    return new Response(
      JSON.stringify({
        error: "Failed to acknowledge notification",
      }),
      {
        status: 500,
        headers: { "content-type": "application/json" },
      }
    );
  }
}

// POST - Acknowledge ALL unacknowledged notifications
export async function PUT() {
  try {
    const result = await prisma.notifications.updateMany({
      where: {
        acknowledged: false,
      },
      data: {
        acknowledged: true,
        acknowledgedAt: new Date(),
      },
    });

    console.log(`Acknowledged ${result.count} notifications at ${new Date().toISOString()}`);

    return new Response(
      JSON.stringify({
        success: true,
        count: result.count,
      }),
      {
        headers: { "content-type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error acknowledging all notifications:", error);
    return new Response(
      JSON.stringify({
        error: "Failed to acknowledge notifications",
      }),
      {
        status: 500,
        headers: { "content-type": "application/json" },
      }
    );
  }
}

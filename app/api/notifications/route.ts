import prisma from "@/app/lib/prisma";
import { sendAlert } from "@/app/lib/server-utils";

export const dynamic = "force-dynamic";

// POST - Create a new alert notification
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { message, title, priority, metadata } = body;

    if (!message) {
      return new Response(
        JSON.stringify({ error: "Message is required" }),
        { status: 400, headers: { "content-type": "application/json" } }
      );
    }

    const notification = await sendAlert(
      message,
      title || "timetracking.live Alert",
      priority || 0,
      metadata
    );

    return new Response(
      JSON.stringify({
        success: true,
        notification,
      }),
      {
        status: 201,
        headers: { "content-type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error creating notification:", error);
    return new Response(
      JSON.stringify({
        error: "Failed to create notification",
      }),
      {
        status: 500,
        headers: { "content-type": "application/json" },
      }
    );
  }
}

// GET - Retrieve all unacknowledged notifications
export async function GET() {
  try {
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
    console.error("Error fetching notifications:", error);
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

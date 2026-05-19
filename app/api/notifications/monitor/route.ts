import prisma from "@/app/lib/prisma";
import {
  sendPushoverNotification,
  sendPushoverCall,
} from "@/app/lib/server-utils";

export const dynamic = "force-dynamic";

const RETRY_INTERVAL_MS = 60000; // 1 minute between retries
const ESCALATION_TIME_MS = 300000; // 5 minutes before escalating to call
const MAX_NOTIFICATIONS_PER_RUN = 25;

// This endpoint should be called periodically (e.g., every minute via cron)
export async function GET() {
  try {
    console.log(`⏰ Cloudflare cron triggered at ${new Date().toISOString()}`);

    // Only priority 2 notifications are actionable here. Pulling every
    // unacknowledged row caused shared pooler egress to scale with old backlog.
    const emergencyNotifications = await prisma.notifications.findMany({
      where: {
        acknowledged: false,
        priority: 2,
      },
      orderBy: {
        createdAt: "asc",
      },
      take: MAX_NOTIFICATIONS_PER_RUN,
      select: {
        id: true,
        message: true,
        title: true,
        priority: true,
        createdAt: true,
        lastSentAt: true,
        sendCount: true,
        escalatedToCall: true,
        ackToken: true,
      },
    });

    console.log(
      `🔍 Found ${emergencyNotifications.length} actionable emergency notifications`
    );

    const now = new Date();
    const results = [];

    for (const notification of emergencyNotifications) {
      const timeSinceCreation = now.getTime() - notification.createdAt.getTime();
      const timeSinceLastSent = now.getTime() - notification.lastSentAt.getTime();

      console.log(`📋 Processing notification ${notification.id}:`, {
        timeSinceCreation: Math.floor(timeSinceCreation / 1000) + "s",
        timeSinceLastSent: Math.floor(timeSinceLastSent / 1000) + "s",
        sendCount: notification.sendCount,
        escalatedToCall: notification.escalatedToCall,
      });

      // Generate acknowledgment URL
      const baseUrl = process.env.NEXT_PUBLIC_SERVER_URL?.replace('/api', '') || "http://localhost:3003";
      const ackUrl = `${baseUrl}/ack/${notification.ackToken}`;

      // Check if we should escalate to emergency call
      if (
        timeSinceCreation >= ESCALATION_TIME_MS &&
        !notification.escalatedToCall
      ) {
        console.log(
          `🚨 ESCALATING notification ${notification.id} to emergency call!`
        );

        const success = await sendPushoverCall(
          `URGENT: ${notification.message}\n\n[Unacknowledged for ${Math.floor(timeSinceCreation / 60000)} minutes]`,
          `🚨 ${notification.title}`,
          ackUrl,
          "Acknowledge Alert"
        );

        if (success) {
          await prisma.notifications.update({
            where: { id: notification.id },
            data: {
              escalatedToCall: true,
              lastSentAt: now,
              sendCount: notification.sendCount + 1,
            },
          });

          results.push({
            id: notification.id,
            action: "escalated_to_call",
            success: true,
          });
        }
      }
      // Check if we should send a retry notification
      else if (timeSinceLastSent >= RETRY_INTERVAL_MS) {
        console.log(`🔔 Resending priority 2 notification ${notification.id}`);

        const success = await sendPushoverNotification(
          `${notification.message}\n\n[Reminder ${notification.sendCount + 1}]`,
          notification.title,
          1, // Use high priority (1), not emergency (2)
          "persistent",
          ackUrl,
          "Acknowledge Alert"
        );

        if (success) {
          await prisma.notifications.update({
            where: { id: notification.id },
            data: {
              lastSentAt: now,
              sendCount: notification.sendCount + 1,
            },
          });

          results.push({
            id: notification.id,
            action: "resent",
            sendCount: notification.sendCount + 1,
          });
        }
      } else {
        results.push({
          id: notification.id,
          action: "no_action_needed",
          nextActionIn: Math.floor(
            (RETRY_INTERVAL_MS - timeSinceLastSent) / 1000
          ) + "s",
        });
      }
    }

    console.log(
      `✅ Monitor complete - processed ${emergencyNotifications.length} emergency notifications`
    );

    return new Response(
      JSON.stringify({
        success: true,
        processedCount: emergencyNotifications.length,
        maxPerRun: MAX_NOTIFICATIONS_PER_RUN,
        results,
      }),
      {
        headers: { "content-type": "application/json" },
      }
    );
  } catch (error) {
    console.error("❌ Error monitoring notifications:", error);
    return new Response(
      JSON.stringify({
        error: "Failed to monitor notifications",
      }),
      {
        status: 500,
        headers: { "content-type": "application/json" },
      }
    );
  }
}

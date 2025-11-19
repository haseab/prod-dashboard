import prisma from "./prisma";

export const updateBacklogToDb = async (
  taskBacklog: number,
  taskBacklogDetails: Record<string, string | number>[]
) => {
  console.log(
    "ABOUT TO UPDATE THE DB! WITH THE FOLLOWING TASK BACKLOG NUMBER: ",
    taskBacklog
  );
  return await prisma.task_backlog.create({
    data: {
      amount: taskBacklog,
      details: taskBacklogDetails,
      createdAt: new Date(),
    },
  });
};

export const sendPushoverNotification = async (
  message: string,
  title: string = "timetracking.live Error",
  priority: number = 0,
  sound: string = "falling",
  url?: string,
  urlTitle?: string
) => {
  try {
    console.log("Attempting to send Pushover notification...");
    console.log("Token exists:", !!process.env.CAL_PUSHOVER_TOKEN);
    console.log("User exists:", !!process.env.CAL_PUSHOVER_USER);

    if (!process.env.CAL_PUSHOVER_TOKEN || !process.env.CAL_PUSHOVER_USER) {
      console.error("Missing Pushover environment variables");
      return false;
    }

    const pushoverData: Record<string, string> = {
      token: process.env.CAL_PUSHOVER_TOKEN!,
      user: process.env.CAL_PUSHOVER_USER!,
      message: message,
      title: title,
      priority: priority.toString(),
      sound: sound,
    };

    // Add URL if provided
    if (url) {
      pushoverData.url = url;
      if (urlTitle) {
        pushoverData.url_title = urlTitle;
      }
    }

    // For emergency priority (2), require acknowledgment
    if (priority === 2) {
      pushoverData.retry = "30"; // Retry every 30 seconds
      pushoverData.expire = "300"; // Stop after 5 minutes
    }

    console.log("Sending Pushover data:", {
      message,
      title,
      priority,
      sound,
      url,
    });

    const response = await fetch("https://api.pushover.net/1/messages.json", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams(pushoverData),
    });

    const responseText = await response.text();
    console.log("Pushover response status:", response.status);
    console.log("Pushover response body:", responseText);

    if (!response.ok) {
      console.error(
        "Failed to send Pushover notification:",
        response.statusText,
        responseText
      );
      return false;
    } else {
      console.log("Pushover notification sent successfully");
      return true;
    }
  } catch (error) {
    console.error("Error sending Pushover notification:", error);
    return false;
  }
};

export const sendPushoverCall = async (
  message: string,
  title: string,
  url?: string,
  urlTitle?: string
) => {
  try {
    if (!process.env.CAL_PUSHOVER_TOKEN || !process.env.CAL_PUSHOVER_USER) {
      console.error("Missing Pushover environment variables");
      return false;
    }

    console.log("ESCALATING TO CALL - Sending emergency priority notification");

    const pushoverData: Record<string, string> = {
      token: process.env.CAL_PUSHOVER_TOKEN!,
      user: process.env.CAL_PUSHOVER_USER!,
      message: message,
      title: title,
      priority: "2", // Emergency - requires acknowledgment
      retry: "30", // Retry every 30 seconds
      expire: "300", // Stop after 5 minutes
      sound: "siren",
    };

    if (url) {
      pushoverData.url = url;
      if (urlTitle) {
        pushoverData.url_title = urlTitle;
      }
    }

    const response = await fetch("https://api.pushover.net/1/messages.json", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams(pushoverData),
    });

    const responseData = await response.json();
    console.log("Pushover CALL response:", responseData);

    return response.ok;
  } catch (error) {
    console.error("Error sending Pushover call:", error);
    return false;
  }
};

export const sendAlert = async (
  message: string,
  title: string = "timetracking.live Alert",
  priority: 0 | 1 | 2 = 0,
  metadata?: Record<string, any>
) => {
  try {
    // Create notification record in database (ackToken is auto-generated)
    const notification = await prisma.notifications.create({
      data: {
        message,
        title,
        priority,
        metadata: metadata || {},
        sendCount: 1,
      },
    });

    // Generate acknowledgment URL with the token
    const baseUrl = process.env.NEXT_PUBLIC_SERVER_URL?.replace('/api', '') || "http://localhost:3003";
    const ackUrl = `${baseUrl}/ack/${notification.ackToken}`;

    // Determine sound based on priority
    const sound = priority === 1 ? "cosmic" : priority === 0 ? "bike" : "falling";

    // Send initial Pushover notification with acknowledgment URL
    await sendPushoverNotification(
      message,
      title,
      priority,
      sound,
      ackUrl,
      "Acknowledge Alert"
    );

    console.log(`Alert created with priority ${priority} and acknowledgment URL: ${ackUrl}`);

    return notification;
  } catch (error) {
    console.error("Error creating alert:", error);
    // Fallback to basic notification if DB fails
    await sendPushoverNotification(message, title);
    return null;
  }
};

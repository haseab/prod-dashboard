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

export const sendPushoverNotification = async (message: string, title: string = "timetracking.live Error") => {
  try {
    const pushoverData = {
      token: process.env.CAL_PUSHOVER_TOKEN,
      user: process.env.CAL_PUSHOVER_USER,
      message: message,
      title: title,
      sound: "bike"
    };

    const response = await fetch("https://api.pushover.net/1/messages.json", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(pushoverData),
    });

    if (!response.ok) {
      console.error("Failed to send Pushover notification:", response.statusText);
    } else {
      console.log("Pushover notification sent successfully");
    }
  } catch (error) {
    console.error("Error sending Pushover notification:", error);
  }
};

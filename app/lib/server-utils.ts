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

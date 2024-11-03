import prisma from "./prisma";

export const updateBacklogToDb = async (num: number) => {
  console.log(
    "ABOUT TO UPDATE THE DB! WITH THE FOLLOWING TASK BACKLOG NUMBER: ",
    num
  );
  return await prisma.task_backlog.create({
    data: {
      amount: num,
      createdAt: new Date(),
    },
  });
};

import prisma from "./prisma";

export const updatePileDb = async (num: number) => {
  console.log("ABOUT TO UPDATE THE DB! WITH THE FOLLOWING PILE NUMBER: ", num);
  return await prisma.pile_history.create({
    data: {
      amount: num,
      createdAt: new Date(),
    },
  });
};

import prisma from "@/app/lib/prisma";

const main = async () => {
  // const random = Math.random() * 100;
  const random = 50;

  console.log(
    "ABOUT TO UPDATE THE DB! WITH THE FOLLOWING PILE NUMBER: ",
    random
  );

  try {
    await prisma.pile_history.create({
      data: {
        amount: random,
        createdAt: new Date(),
      },
    });

    console.log("Record successfully created");
  } catch (e) {
    console.error("Error occurred during database operation:", e);
  } finally {
    await prisma.$disconnect(); // Disconnect after operation
  }
};

main();

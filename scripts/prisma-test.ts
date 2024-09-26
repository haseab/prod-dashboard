import prisma from "@/app/lib/prisma";

const main = async () => {
  console.log(
    "ABOUT TO UPDATE THE DB! WITH THE FOLLOWING PILE NUMBER: ",
    65.75
  );

  try {
    await prisma.pile_history.create({
      data: {
        amount: 65.75,
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

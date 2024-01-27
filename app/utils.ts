export const roundToThree = (num: number) => {
  return Math.round(num * 10000 + Number.EPSILON) / 10000;
};

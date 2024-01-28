import { animated, useSpring } from "react-spring";

export default function Number({
  num,
  newNum,
}: {
  num: number;
  newNum: number;
}) {
  const { number } = useSpring({
    number: newNum,
    delay: 200,
    from: { number: num },
    config: { mass: 1, tension: 20, friction: 10, duration: 1000 },
  });
  return <animated.div>{number.to((num) => num.toFixed(3))}</animated.div>;
}

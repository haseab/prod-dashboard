"use client";

import { animated, useSpring } from "react-spring";

export default function Number({
  num,
  newNum,
  setLoading,
}: {
  num: number;
  newNum: number;
  setLoading: (loading: boolean) => void;
}) {
  const { number } = useSpring({
    number: newNum,
    delay: 200,
    from: { number: num },
    config: { mass: 1, tension: 20, friction: 10, duration: 5000 },
    onStart: () => {
      setLoading(true);
    },
    onRest: () => {
      setLoading(false);
    },
  });
  return (
    <>
      <animated.div>{number.to((num) => num.toFixed(3))}</animated.div>
    </>
  );
}

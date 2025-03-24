"use client";

import { cx, formatTimeDifference } from "@/lib/utils";
import { useEffect, useState } from "react";

const TimerComponent = ({
  flow,
  currentActivityStartTime,
}: {
  flow: number;
  currentActivityStartTime: string;
}) => {
  const [timeLeft, setTimeLeft] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft((prevTime) => prevTime + 1);
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  return (
    <div className="mt-2 text-xl block sm:hidden flex">
      <p
        className={cx(
          "flex text-blue-500 font-mono transition-colors duration-1000 ease-in-out",
          {
            "text-green-500": flow > 0.8334,
            "text-purple-500": flow > 1.5,
            "text-red-500": flow > 2.5,
          }
        )}
      >
        {formatTimeDifference(new Date(currentActivityStartTime), new Date())}
      </p>
    </div>
  );
};

export default TimerComponent;

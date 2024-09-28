import { cx } from "class-variance-authority";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

function ActivityIndicator({
  currentActivity,
  flow,
}: {
  currentActivity: string;
  flow: number;
}) {
  // State to trigger re-animation
  const [key, setKey] = useState(0);

  // Increment key to re-trigger animation whenever currentActivity changes
  useEffect(() => {
    setKey((prevKey) => prevKey + 1);
  }, [currentActivity]);

  // Define class names conditionally based on flow value
  const classNames = `flex text-[1.4rem] sm:text-[1.2rem] md:text-[1.75rem] transition-colors duration-1000 ease-in-out font-mono ${
    flow > 2.5
      ? "text-red-500"
      : flow > 1.5
      ? "text-purple-500"
      : flow > 0.8334
      ? "text-green-500"
      : "text-blue-500"
  }`;

  return (
    <div
      className={cx(
        "flex text-[1.4rem] sm:text-[1.2rem] md:text-[1.75rem] transition-colors duration-1000 ease-in-out text-blue-500 font-mono",
        {
          "text-green-500": flow > 0.8334,
          "text-purple-500": flow > 1.5,
          "text-red-500": flow > 2.5,
        }
      )}
    >
      <motion.p
        key={key} // Key change triggers re-animation
        initial={{ scale: 0 }} // Initial scale
        animate={{ scale: [0, 1] }} // Animate scale
        className={classNames}
      >
        {currentActivity}
      </motion.p>
    </div>
  );
}

export default ActivityIndicator;

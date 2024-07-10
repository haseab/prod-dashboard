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
    <motion.p
      key={key} // Key change triggers re-animation
      initial={{ scale: 1 }} // Initial scale
      animate={{ scale: [1, 1.1, 1] }} // Animate scale
      className={classNames}
    >
      {currentActivity}
    </motion.p>
  );
}

export default ActivityIndicator;
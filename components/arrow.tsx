import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

const fadeInOutVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

export const Arrow = ({
  up,
  isVisible,
}: {
  up: boolean;
  isVisible: boolean;
}) => {
  return (
    <div>
      <motion.div
        initial="hidden"
        animate={isVisible ? "visible" : "hidden"}
        variants={fadeInOutVariants}
        transition={{ duration: 0.5 }} // duration of fade
        className={cn(
          "text-2xl text-green-500",
          { "rotate-180 text-red-500": !up } // rotate the arrow if it's not up
        )}
      >
        ▲
      </motion.div>
    </div>
  );
};

export default Arrow;

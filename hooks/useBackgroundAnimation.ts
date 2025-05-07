"use client";

import { AnimationControls } from "framer-motion";
import { useEffect } from "react";

const transitionSettings = {
  duration: 1,
  ease: [0.42, 0, 0.58, 1], // Cubic bezier for ease-in-out
};

export function useBackgroundAnimation(
  controls: AnimationControls,
  flow: number
) {
  useEffect(() => {
    const determineBackground = () => {
      if (flow > 2.5) {
        return "linear-gradient(to top, #dc2626, #111827, #111827)"; // Red gradient
      } else if (flow > 1.5) {
        return "linear-gradient(to top, #6d28d9, #111827, #111827)"; // Purple gradient
      } else if (flow > 0.8334) {
        return "linear-gradient(to top, #2e7d32, #111827, #111827)"; // Green gradient
      } else if (flow > 0.4167) {
        return "linear-gradient(to top, #0d47a1, #111827, #111827)"; // Blue gradient
      } else {
        return "linear-gradient(to top, #111827, #111827, #111827)"; // Default gradient
      }
    };

    controls.start({
      backgroundImage: determineBackground(),
      transition: transitionSettings,
    });
  }, [flow, controls]);
}

"use client";

import { useEffect, useRef, useState } from "react";

const TimerComponent = ({
  refreshTime,
  setError,
  setTimeLeftState,
}: {
  refreshTime: number;
  setError: (error: string) => void;
  setTimeLeftState: (timeLeftState: number) => void;
}) => {
  const [localTimeLeftState, setLocalTimeLeftState] = useState(0);
  const lastFetchTimeRef = useRef(Date.now());
  const timeLeftRef = useRef(0);
  const pollingInterval = 1000;
  const staleDataInterval = 30000; // 30 seconds
  const STALE_DATA_ERROR_MESSAGE = "Data is outdated, please refresh the page.";

  useEffect(() => {
    const interval = setInterval(() => {
      timeLeftRef.current += 1; // Update ref
      setLocalTimeLeftState(timeLeftRef.current); // Update state to trigger re-render

      if (timeLeftRef.current >= refreshTime) {
        timeLeftRef.current = 0;
        setTimeLeftState(0); // Reset the timer and state
      }

      // Check if the data is stale
      if (Date.now() - lastFetchTimeRef.current > staleDataInterval) {
        setError(STALE_DATA_ERROR_MESSAGE);
      }
    }, pollingInterval);

    return () => {
      clearInterval(interval);
    };
  }, []);

  return <div>Refreshing in {refreshTime - timeLeftRef.current} seconds</div>;
};

export default TimerComponent;

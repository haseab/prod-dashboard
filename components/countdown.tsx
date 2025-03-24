"use client";

import { useEffect, useRef, useState } from "react";

const CountdownComponent = ({
  refreshTime,
  setError,
  fetchData,
}: {
  refreshTime: number;
  setError: (error: string) => void;
  fetchData: (errorMessage: string) => void;
}) => {
  const [localTimeLeftState, setLocalTimeLeftState] = useState(0);
  const lastFetchTimeRef = useRef(Date.now());
  const pollingInterval = 1000;
  const staleDataInterval = 30000; // 30 seconds
  const STALE_DATA_ERROR_MESSAGE = "Data is outdated, please refresh the page.";
  const SERVER_ERROR_MESSAGE = "Server error: trying again in 30 seconds...";

  useEffect(() => {
    const interval = setInterval(() => {
      setLocalTimeLeftState((prev) => {
        const next = prev + 1;

        if (next === refreshTime || next === 0) {
          setError("");
          fetchData(SERVER_ERROR_MESSAGE);
        }
        // Reset countdown after hitting refresh time
        return next >= refreshTime ? 0 : next;
      });
    }, pollingInterval);

    return () => {
      clearInterval(interval);
    };
  }, [refreshTime, setError]);

  return <span>Refreshing in {refreshTime - localTimeLeftState} seconds</span>;
};

export default CountdownComponent;

"use client";

import { useEffect, useRef, useState } from "react";

const CountdownComponent = ({
  refreshTime,
  setError,
}: {
  refreshTime: number;
  setError: (error: string) => void;
}) => {
  const [localTimeLeftState, setLocalTimeLeftState] = useState(0);
  const lastFetchTimeRef = useRef(Date.now());
  const pollingInterval = 1000;
  const staleDataInterval = 300000; // 5 minutes
  const STALE_DATA_ERROR_MESSAGE = "Data is outdated, please refresh the page.";

  useEffect(() => {
    const interval = setInterval(() => {
      setLocalTimeLeftState((prev) => {
        const next = prev + 1;

        // Handle stale data error
        if (Date.now() - lastFetchTimeRef.current > staleDataInterval) {
          setError(STALE_DATA_ERROR_MESSAGE);
        }

        // Reset countdown after hitting refresh time
        return next >= refreshTime ? 0 : next;
      });
    }, pollingInterval);

    return () => {
      clearInterval(interval);
    };
  }, [refreshTime, setError]);

  return <div>Refreshing in {refreshTime - localTimeLeftState} seconds</div>;
};

export default CountdownComponent;

import zIndex from "@mui/material/styles/zIndex";
import { FC, ReactNode, useEffect, useRef, useState } from "react";

interface Props {
  children: ReactNode;
  tooltip?: string;
}

const ToolTip: FC<Props> = ({ children, tooltip }) => {
  const tooltipRef = useRef<HTMLSpanElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [tooltipStyle, setTooltipStyle] = useState({
    left: "0px",
    transform: "translateX(0)",
    zIndex: 1000,
  });

  const handleMouseEnter = (clientX: number) => {
    if (tooltipRef.current && containerRef.current) {
      const { left, right } = containerRef.current.getBoundingClientRect();
      const tooltipWidth = tooltipRef.current.offsetWidth;
      let tooltipLeft = clientX - left;

      // Check for overflow
      if (tooltipLeft + tooltipWidth > right - left) {
        tooltipLeft = right - left - tooltipWidth;
      }

      setTooltipStyle({
        left: `${tooltipLeft}px`,
        transform: "translateX(-50%)",
        zIndex: 1000,
      });
    }
  };

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      handleMouseEnter(event.clientX);
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener("mousemove", handleMouseMove);
    }

    return () => {
      if (container) {
        container.removeEventListener("mousemove", handleMouseMove);
      }
    };
  }, []);

  return (
    <div ref={containerRef} className="group relative inline-block">
      {children}
      {tooltip && (
        <span
          ref={tooltipRef}
          style={tooltipStyle}
          className="p-5 invisible z-1000
           rounded-xl group-hover:visible opacity-0 group-hover:opacity-100 transition bg-blue-900 text-white p-1 rounded absolute top-full mt-2 whitespace-normal w-64"
        >
          {tooltip}
        </span>
      )}
    </div>
  );
};

export default ToolTip;

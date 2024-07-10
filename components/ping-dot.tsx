import { cn } from "@/lib/utils";

export default function PingDot({
  className,
  color = "green",
  size = 5,
}: {
  className?: string;
  color?: string;
  size?: number;
}) {
  return (
    <span
      className={cn(`relative mx-1 inline-flex h-${size} w-${size}`, className)}
    >
      <span
        className={cn(
          "absolute inline-flex h-full w-full animate-ping rounded-full transition-colors duration-1000 ease-in-out opacity-75",
          color === "green" && "bg-green-400",
          color === "red" && "bg-red-400",
          color === "blue" && "bg-blue-400",
          color === "purple" && "bg-purple-400"
        )}
      ></span>
      <span
        className={cn(
          `relative inline-flex h-${size} w-${size} rounded-full transition-colors duration-1000 ease-in-out`,
          color === "green" && "bg-green-500",
          color === "red" && "bg-red-500",
          color === "blue" && "bg-blue-500",
          color === "purple" && "bg-purple-500"
        )}
      ></span>
    </span>
  );
}

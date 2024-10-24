import { cx } from "class-variance-authority";

export const FlowImg = ({
  top,
  left,
  flow,
  className,
  style,
}: {
  top?: string;
  left?: string;
  flow: number;
  className?: string;
  style?: React.CSSProperties;
}) => {
  return (
    <img
      src={
        flow > 2.5
          ? "https://pub-7712ec77fabb4a6d996c607b226d98f0.r2.dev/flame.gif"
          : "https://pub-7712ec77fabb4a6d996c607b226d98f0.r2.dev/output-onlinegiftools.gif"
      }
      alt="Animated GIF"
      style={{ ...style }}
      className={cx("gifPosition", className)}
      // style={{
      //   position: "absolute",
      //   top: top ? top : "50%",
      //   left: left ? left : "50%",
      //   width: `${flow > 2.5 ? 8 : 10}%`,
      //   transform: "translate(-50%, -50%)",
      // }}
    ></img>
  );
};

export const FlowImg = ({
  top,
  left,
  flow,
}: {
  top: string;
  left: string;
  flow: number;
}) => {
  return (
    <img
      src={
        flow > 2.5
          ? "https://pub-7712ec77fabb4a6d996c607b226d98f0.r2.dev/flame.gif"
          : "https://pub-7712ec77fabb4a6d996c607b226d98f0.r2.dev/output-onlinegiftools.gif"
      }
      alt="Animated GIF"
      className="gifPosition"
      style={{
        position: "absolute",
        top: top,
        left: left,
        width: `${flow > 2.5 ? 8 : 10}%`,
        transform: "translate(-50%, -50%)",
      }}
    ></img>
  );
};

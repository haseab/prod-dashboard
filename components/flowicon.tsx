export const FlowImg = ({ top, left }: { top: string; left: string }) => {
  return (
    <img
      src="https://pub-7712ec77fabb4a6d996c607b226d98f0.r2.dev/output-onlinegiftools.gif"
      alt="Animated GIF"
      className="gifPosition"
      style={{
        position: "absolute",
        top: top,
        left: left,
        width: "10%",
        transform: "translate(-50%, -50%)",
      }}
    ></img>
  );
};

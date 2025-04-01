import {
  type Container,
  type ISourceOptions,
  MoveDirection,
  OutMode,
} from "@tsparticles/engine";
import Particles, { initParticlesEngine } from "@tsparticles/react";
import React, { useEffect, useMemo, useState } from "react";
// import { loadAll } from "@tsparticles/all"; // if you are going to use `loadAll`, install the "@tsparticles/all" package too.
// import { loadFull } from "tsparticles"; // if you are going to use `loadFull`, install the "tsparticles" package too.
import { loadSlim } from "@tsparticles/slim"; // if you are going to use `loadSlim`, install the "@tsparticles/slim" package too.
// import { loadBasic } from "@tsparticles/basic"; // if you are going to use `loadBasic`, install the "@tsparticles/basic" package too.

const ParticlesComponent = (props: any) => {
  const [init, setInit] = useState(false);
  const [engine, setEngine] = useState<any>(null);

  // this should be run only once per application lifetime
  useEffect(() => {
    let isMounted = true;

    initParticlesEngine(async (engine) => {
      // you can initiate the tsParticles instance (engine) here, adding custom shapes or presets
      // this loads the tsparticles package bundle, it's the easiest method for getting everything ready
      // starting from v2 you can add only the features you need reducing the bundle size
      //await loadAll(engine);
      //await loadFull(engine);
      await loadSlim(engine);
      //await loadBasic(engine);
      if (isMounted) {
        setEngine(engine);
      }
    }).then(() => {
      if (isMounted) {
        setInit(true);
      }
    });

    return () => {
      isMounted = false;
      // Clean up particles engine
      if (engine) {
        engine.destroy();
      }
    };
  }, []);

  const particlesLoaded = async (container?: Container): Promise<void> => {
    console.log("Particles container loaded", container);
  };

  const options: ISourceOptions = useMemo(
    () => ({
      background: {
        color: {
          value: "transparent", // Keep transparent background
        },
      },
      fpsLimit: 60,
      particles: {
        color: {
          value:
            props.flow > 2.5
              ? ["#ff4500", "#ffa500", "#ff6347"]
              : props.flow > 1.5
              ? ["#6A0DAD", "#B57EDC", "#F1E9FF"]
              : props.flow > 0.8334
              ? ["#008000", "#32CD32", "#90EE90"]
              : ["#0000FF", "#1E90FF", "#ADD8E6"], // Color palette for particles
        },
        links: {
          enable: false, // Disable links
        },
        move: {
          direction: MoveDirection.none, // No specific direction, particles will just move randomly
          enable: true,
          outModes: {
            default: OutMode.bounce, // Keep particles inside the canvas by bouncing them off edges
          },
          random: true, // Randomize movement for natural fire-like behavior
          speed: {
            min: 2 ** props.flow, // Slow speed for a more relaxed effect
            max: 2.5 ** props.flow, // Fast speed for a more dynamic effect
          }, // Increased speed for faster motion
          straight: false, // No straight movement, natural random motion
        },
        number: {
          density: {
            enable: true,
            area: 800, // Keep density at default
          },
          value: 75, // More particles for a denser effect
        },
        opacity: {
          value: { min: 0.1, max: 1 }, // High opacity to keep particles bright
          animation: {
            enable: false, // Disable opacity animation to keep particles constant
          },
        },
        shape: {
          type: "circle", // Circular shape
        },
        size: {
          value: { min: 2, max: (2 * props.flow) / 2 }, // Vary particle size
          animation: {
            enable: false, // Disable size animation to maintain particle size
          },
        },
        life: {
          duration: {
            sync: true,
            value: Infinity, // Keep particles alive indefinitely
          },
        },
        detectRetina: true, // Retina display optimization
      },
      detectRetina: true,
    }),
    [props.flow]
  );

  if (init) {
    return (
      <Particles
        id="tsparticles"
        particlesLoaded={particlesLoaded}
        options={options}
        {...props}
      />
    );
  }

  return <></>;
};

export default React.memo(ParticlesComponent, (prevProps, nextProps) => {
  // console.log("prev flow", prevProps.flow, "next flow", nextProps.flow);
  // Only re-render if flow changes by at least 0.1
  return Math.abs(nextProps.flow - prevProps.flow) < 0.1;
});

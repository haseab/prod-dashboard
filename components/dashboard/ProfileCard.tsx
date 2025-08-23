"use client";

import ActivityIndicator from "@/components/activity";
import PingDot from "@/components/ping-dot";
import TimerComponent from "@/components/timer";
import { cx } from "@/lib/utils";
import { Card, Title } from "@tremor/react";
import { AnimatePresence, motion } from "framer-motion";

interface ProfileCardProps {
  flow: number;
  currentActivity: string;
  currentActivityStartTime: string;
  error: string;
}

const duration = 1;

export default function ProfileCard({
  flow,
  currentActivity,
  currentActivityStartTime,
  error,
}: ProfileCardProps) {
  return (
    <Card className="flex flex-col sm:flex-row p-5 opacity-95">
      <div className="flex flex-col items-center justify-center mx-10 space-y-2">
        <AnimatePresence mode="wait">
          <div className="relative w-[20vh] h-[20vh] sm:w-[8rem] sm:h-[8rem] transition-all duration-300">
            <motion.img
              key="normal-eyes"
              // src="https://pbs.twimg.com/profile_images/1857647057214791680/6ZlE8DmL_400x400.png"
              src="https://pub-7712ec77fabb4a6d996c607b226d98f0.r2.dev/dp2025.png"
              alt="flow"
              className="w-[20vh] h-[20vh] sm:w-[8rem] sm:h-[8rem] rounded-full absolute"
              style={{
                zIndex: 90,
              }}
            />
            {flow > 2.5 ? (
              <>
                <motion.img
                  key="normal-eyes"
                  // src="https://pbs.twimg.com/profile_images/1857647057214791680/6ZlE8DmL_400x400.png"
                  src="https://pub-7712ec77fabb4a6d996c607b226d98f0.r2.dev/dp2025.png"
                  alt="flow"
                  className="w-[20vh] h-[20vh] sm:w-[8rem] sm:h-[8rem] rounded-full absolute"
                  style={{
                    zIndex: 90,
                  }}
                />
                {/* <motion.img
                  key="blind-smile"
                  src="https://pub-7712ec77fabb4a6d996c607b226d98f0.r2.dev/blind-dp.png"
                  alt="flow"
                  className="w-[20vh] h-[20vh] sm:w-[8rem] sm:h-[8rem] rounded-full absolute"
                  style={{
                    zIndex: 90,
                  }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration }}
                />
                <motion.img
                  key="red-eyes"
                  src="https://pub-7712ec77fabb4a6d996c607b226d98f0.r2.dev/red-eyes.png"
                  alt="flow"
                  className="w-[20vh] h-[20vh] sm:w-[8rem] sm:h-[8rem] rounded-full absolute animate-pulse-custom"
                  style={{
                    zIndex: 100,
                  }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration }}
                />
                <motion.img
                  src="https://pub-7712ec77fabb4a6d996c607b226d98f0.r2.dev/white-eyes.png"
                  key="white-eyes-1"
                  alt="flow"
                  className="w-[20vh] h-[20vh] sm:w-[8rem] sm:h-[8rem] rounded-full absolute"
                  style={{
                    zIndex: 100,
                  }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration }}
                /> */}
              </>
            ) : flow > 1.5 ? (
              <>
                <motion.img
                  key="normal-eyes"
                  // src="https://pbs.twimg.com/profile_images/1857647057214791680/6ZlE8DmL_400x400.png"
                  src="https://pub-7712ec77fabb4a6d996c607b226d98f0.r2.dev/dp2025.png"
                  alt="flow"
                  className="w-[20vh] h-[20vh] sm:w-[8rem] sm:h-[8rem] rounded-full absolute"
                  style={{
                    zIndex: 90,
                  }}
                />
                {/* <motion.img
                  key="blind-smile"
                  src="https://pub-7712ec77fabb4a6d996c607b226d98f0.r2.dev/blind-dp.png"
                  alt="flow"
                  className="w-[20vh] h-[20vh] sm:w-[8rem] sm:h-[8rem] rounded-full absolute"
                  style={{
                    zIndex: 100,
                  }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration }}
                />
                <motion.img
                  key="smiledp"
                  src="https://pub-7712ec77fabb4a6d996c607b226d98f0.r2.dev/smiledp.png"
                  alt="flow"
                  className="w-[20vh] h-[20vh] sm:w-[8rem] sm:h-[8rem] rounded-full absolute"
                  style={{
                    zIndex: 90,
                  }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration }}
                />
                <motion.img
                  key="white-eyes-1"
                  src="https://pub-7712ec77fabb4a6d996c607b226d98f0.r2.dev/white-eyes.png"
                  alt="flow"
                  className="w-[20vh] h-[20vh] sm:w-[8rem] sm:h-[8rem] rounded-full absolute animate-pulse-custom"
                  style={{
                    zIndex: 100,
                  }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration }}
                />
                <motion.img
                  key="white-eyes-2"
                  src="https://pub-7712ec77fabb4a6d996c607b226d98f0.r2.dev/white-eyes.png"
                  alt="flow"
                  className="w-[20vh] h-[20vh] sm:w-[8rem] sm:h-[8rem] rounded-full absolute animate-pulse-custom"
                  style={{
                    zIndex: 100,
                  }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration }}
                /> */}
              </>
            ) : flow > 0.4167 ? (
              <>
                {/* <motion.img
                  key="smiledp"
                  src="https://pbs.twimg.com/profile_images/1857647057214791680/6ZlE8DmL_400x400.png"
                  alt="flow"
                  className="w-[20vh] h-[20vh] sm:w-[8rem] sm:h-[8rem] rounded-full absolute"
                  style={{
                    zIndex: 100,
                  }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration }}
                /> */}
                <motion.img
                  key="normal-eyes"
                  // src="https://pbs.twimg.com/profile_images/1857647057214791680/6ZlE8DmL_400x400.png"
                  src="https://pub-7712ec77fabb4a6d996c607b226d98f0.r2.dev/dp2025.png"
                  alt="flow"
                  className="w-[20vh] h-[20vh] sm:w-[8rem] sm:h-[8rem] rounded-full absolute"
                  style={{
                    zIndex: 90,
                  }}
                />
              </>
            ) : (
              <div></div>
            )}
          </div>
        </AnimatePresence>
        <div>
          <p>
            <a
              href="https://twitter.com/haseab_"
              className={cx(
                "flex text-blue-700 transition-colors duration-1000 ease-in-out",
                {
                  "text-green-500": flow > 0.8334,
                  "text-purple-500": flow > 1.5,
                  "text-red-500": flow > 2.5,
                }
              )}
              target="_blank"
            >
              @haseab_
            </a>
          </p>
        </div>
      </div>
      <div className="flex items-center justify-center">
        <div className="border-b w-60 mt-5 sm:border-r border-gray-700 sm:h-32 sm:w-0"></div>
      </div>
      <div className="flex flex-1 flex-col items-center justify-center space-y-2 pt-3 sm:p-3">
        <Title>Right Now I&apos;m:</Title>
        <div className="flex flex-col w-full sm:w-auto sm:flex-row items-center justify-center sm:space-x-5">
          <div className="flex flex-col border p-2 w-full sm:p-0 sm:border-none rounded-xl border-gray-700 items-center justify-center text-center">
            <ActivityIndicator currentActivity={currentActivity} flow={flow} />
            <TimerComponent
              flow={flow}
              currentActivityStartTime={currentActivityStartTime}
              className={"mt-2 text-xl block sm:hidden flex"}
            />
          </div>

          <div className="flex mt-5 sm:mt-0 sm:ml-5 items-center justify-center h-full">
            <PingDot
              color={
                error && flow > 2.5
                  ? "blue"
                  : error && flow < 2.5
                  ? "red"
                  : flow > 2.5
                  ? "red"
                  : flow > 1.5
                  ? "purple"
                  : flow > 0.8334
                  ? "green"
                  : "green"
              }
            />
          </div>
        </div>
        <TimerComponent
          flow={flow}
          currentActivityStartTime={currentActivityStartTime}
          className={"hidden sm:block text-2xl"}
        />
      </div>
    </Card>
  );
}

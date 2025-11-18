"use client";

import CountdownComponent from "@/components/countdown";
import DualAreaCharts from "@/components/dashboard/DualAreaCharts";
import MetricsGrid from "@/components/dashboard/MetricsGrid";
import ProfileCard from "@/components/dashboard/ProfileCard";
import TaskBacklogChart from "@/components/dashboard/TaskBacklogChart";
import WeeklyProductiveFlowChart from "@/components/dashboard/WeeklyProductiveFlowChart";
import ParticlesComponent from "@/components/particles";
import { WhyITrackTimeDialog } from "@/components/whyitracktime";
import { useBackgroundAnimation } from "@/hooks/useBackgroundAnimation";
import { useDashboardData } from "@/hooks/useDashboardData";
import { Title } from "@tremor/react";
import { motion, useAnimation } from "framer-motion";
import { useState } from "react";

const refreshTime = 30;

export default function Component() {
  const {
    showConfetti,
    flow,
    error,
    setError,
    taskBacklogRefreshesLeft,
    efficiencyData,
    dailyProductiveFlowData,
    metricsData,
    weeklyProductiveFlowData,
    startDate,
    endDate,
    currentActivity,
    currentActivityStartTime,
    taskBacklogHistory,
    neutralActivity,
    dailyIdealBurndown,
    fetchData,
  } = useDashboardData();

  const controls = useAnimation();
  const [showDialog, setShowDialog] = useState(false);
  const [showOnlyMA, setShowOnlyMA] = useState(false);
  const [showOnlyRaw, setShowOnlyRaw] = useState(false);

  useBackgroundAnimation(controls, flow);

  return (
    <div className="flex h-[100dvh] bg-gray-900">
      <div className="h-[100dvh] flex font-sans flex-col flex-1 w-full">
        <ParticlesComponent id="particles" flow={flow} />
        <div className="sm:pt-12 flex justify-center items-center">
          <header className="container px-12 flex flex-col items-center justify-between p-6 pb-0 w-full">
            <h2 className="text-3xl pt-5 sm:pt-0 sm:text-2xl font-mono font-semibold text-gray-200">
              timetracking.live
            </h2>
            <div className="border-b w-60 mt-5 border-gray-700 w-full"></div>
          </header>
        </div>
        <motion.main
          className="h-[100dvh] overflow-auto flex-1"
          animate={controls}
          style={{ width: "100%", height: "100vh" }}
        >
          <div className="container mx-auto px-6 py-2">
            <br></br>
            <div className="grid md:grid-cols-1 lg:grid-cols-5 items-center p-2 lg:p-0">
              <Title className="grid col-span-3 w-full gap-6 text-center">
                <CountdownComponent
                  refreshTime={refreshTime}
                  setError={setError}
                  fetchData={fetchData}
                />
              </Title>
              <div className="hidden lg:block text-lg text-gray-100 text-center xs:grid-cols-2 lg:col-span-2">
                <p>Last 7 Days</p>
              </div>
            </div>
            {error && (
              <span className="grid gap-6 text-center text-red-700">
                {error}
              </span>
            )}
            <div className="grid md:grid-cols-1 lg:grid-cols-5">
              <div className="grid lg:col-span-3 lg:grid-rows-3 p-5 gap-6">
                <div className="flex z-10">
                  <ProfileCard
                    flow={flow}
                    currentActivity={currentActivity}
                    currentActivityStartTime={currentActivityStartTime}
                    error={error}
                  />
                </div>
                <div className="grid lg:row-span-2 z-10">
                  <DualAreaCharts
                    flow={flow}
                    dailyProductiveFlowData={dailyProductiveFlowData}
                    efficiencyData={efficiencyData}
                  />
                </div>
                <div className="block lg:hidden text-lg text-gray-100 text-center pt-5">
                  <p className="text-2xl">Last 7 Days</p>
                  <p>
                    {startDate} to {endDate}
                  </p>
                </div>
              </div>

              <MetricsGrid metricsData={metricsData} />
            </div>

            <div className="p-5 space-y-8 hidden opacity-0 xs:block xs:opacity-100">
              <TaskBacklogChart
                taskBacklogHistory={taskBacklogHistory}
                flow={flow}
                showOnlyMA={showOnlyMA}
                taskBacklogRefreshesLeft={taskBacklogRefreshesLeft}
                neutralActivity={neutralActivity}
                dailyIdealBurndown={dailyIdealBurndown}
              />
              <WeeklyProductiveFlowChart
                weeklyProductiveFlowData={weeklyProductiveFlowData}
                flow={flow}
                showOnlyMA={showOnlyMA}
                showOnlyRaw={showOnlyRaw}
                setShowOnlyMA={setShowOnlyMA}
                setShowOnlyRaw={setShowOnlyRaw}
              />
            </div>

            <WhyITrackTimeDialog flow={flow} />
          </div>
        </motion.main>
      </div>
    </div>
  );
}

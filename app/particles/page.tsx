"use client";

import ParticlesComponent from "@/components/particles";

export const ParticlesPage = (props: any) => {
  return (
    <>
      <div className="w-full h-screen flex items-center justify-center">
        <div className="text-3xl">yo</div>
      </div>
      <ParticlesComponent id="particles" />
    </>
  );
};

export default ParticlesPage;

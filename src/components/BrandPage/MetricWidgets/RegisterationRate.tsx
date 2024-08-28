"use client";

import { getTotalRegisteredWorkersRate } from "@/actions/brand-data-getters";
import { useKnoStore } from "@/store/zustand";
import { useEffect, useState } from "react";

const RegisterationRate = () => {
  const [totalRegisteredWorkersRate, setTotalRegisteredWorkersRate] =
    useState(0);
  const [displayedRate, setDisplayedRate] = useState(0);
  const { startDate, endDate } = useKnoStore((state) => ({
    startDate: state.startDate,
    endDate: state.endDate,
  }));

  useEffect(() => {
    const fetchTotalRegisteredWorkers = async () => {
      const total = await getTotalRegisteredWorkersRate(startDate, endDate);
      setTotalRegisteredWorkersRate(total);
    };

    fetchTotalRegisteredWorkers();
  }, [startDate, endDate]);

  useEffect(() => {
    let animationFrameId: number;
    const animateRate = () => {
      setDisplayedRate((prev) => {
        if (prev < totalRegisteredWorkersRate) {
          return prev + 1;
        } else {
          cancelAnimationFrame(animationFrameId);
          return prev;
        }
      });
      animationFrameId = requestAnimationFrame(animateRate);
    };

    animateRate();

    return () => cancelAnimationFrame(animationFrameId);
  }, [totalRegisteredWorkersRate]);

  // Assuming the totalRegisteredWorkers is a percentage value
  const barWidth = `${displayedRate}%`;

  return (
    <div className="h-full w-full border-black/[0.1] border-[1px] rounded-sm flex flex-col p-3 px-4 justify-center">
      <div className="flex items-center justify-between">
        <span className="text-sm text-gray-400 mb-2">
          Employee registration rate
        </span>

        <span className="text-sm text-gray-400 mb-2">{displayedRate}%</span>
      </div>
      <div
        id="bar-container"
        className="w-full h-2 overflow-hidden rounded-full bg-[#EEEEEE]"
      >
        <div
          id="bar"
          className="bg-[#FFB200] rounded-full h-full transition-all duration-500"
          style={{ width: barWidth }}
        ></div>
      </div>
    </div>
  );
};

export default RegisterationRate;

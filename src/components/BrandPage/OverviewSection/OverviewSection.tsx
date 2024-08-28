"use client";

import { TabsContent } from "@/components/ui/tabs";
import { useKnoStore } from "@/store/zustand";
import AnnualAssessment from "./AnnualAssessment";
import GrievanceStatus from "./GrievanceStatus";
import LearningRate from "./LearningRate";

const OverviewSection = () => {
  const { startDate, endDate } = useKnoStore((state) => ({
    startDate: state.startDate,
    endDate: state.endDate,
  }));

  return (
    <TabsContent className="w-full" value="overview">
      <div className="w-full h-[450px] flex gap-2 mt-10">
        <AnnualAssessment startDate={startDate} endDate={endDate} />
        <GrievanceStatus startDate={startDate} endDate={endDate} />
        <LearningRate startDate={startDate} endDate={endDate} />
      </div>
    </TabsContent>
  );
};

export default OverviewSection;

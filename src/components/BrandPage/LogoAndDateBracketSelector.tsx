"use client";

import { useKnoStore } from "@/store/zustand";
import BrandLogo from "./BrandLogo";
import { DateBracketSelector } from "./DateBracketSelector";

const LogoAndDateBracketSelector = () => {
  const { startDate, endDate, setStartDate, setEndDate } = useKnoStore(
    (state) => ({
      startDate: state.startDate,
      endDate: state.endDate,
      setStartDate: state.setStartDate,
      setEndDate: state.setEndDate,
    })
  );

  return (
    <div className="flex items-center justify-between py-4">
      <BrandLogo />

      <DateBracketSelector
        startDate={startDate}
        endDate={endDate}
        setStartDate={setStartDate}
        setEndDate={setEndDate}
      />
    </div>
  );
};

export default LogoAndDateBracketSelector;

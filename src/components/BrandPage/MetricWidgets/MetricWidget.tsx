"use client";

import { MetricType } from "@/actions/brand-data-getters";
import { useEffect, useState } from "react";

interface MetricWidgetProps {
  startDate: Date;
  endDate: Date;
  fetchData: (
    startDate: Date,
    endDate: Date,
    value: MetricType
  ) => Promise<number>;
  label: string;
  value: MetricType;
}

const MetricWidget: React.FC<MetricWidgetProps> = ({
  startDate,
  endDate,
  fetchData,
  label,
  value,
}) => {
  const [metricValue, setMetricValue] = useState(0);

  useEffect(() => {
    const fetchMetricValue = async () => {
      const total = await fetchData(startDate, endDate, value);
      setMetricValue(total);
    };

    fetchMetricValue();
  }, [startDate, endDate, fetchData]);

  return (
    <div className="h-full w-full border-black/[0.1] border-[1px] rounded-sm flex flex-col p-3 px-4 justify-center">
      <div className="flex items-center justify-between">
        <span className="text-sm text-gray-400">{label}</span>
      </div>
      <h1 className="text-xl font-semibold">{metricValue}</h1>
    </div>
  );
};

export default MetricWidget;

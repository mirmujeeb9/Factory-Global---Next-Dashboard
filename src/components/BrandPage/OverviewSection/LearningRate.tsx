import {
  WorkersLearningRateResult,
  getWorkersLearningRate,
} from "@/actions/brand-data-getters";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { useEffect, useState } from "react";
import Bar from "./Bar";

const LearningRate = ({
  startDate,
  endDate,
}: {
  startDate: Date;
  endDate: Date;
}) => {
  const [learningRate, setLearningRate] =
    useState<WorkersLearningRateResult | null>(null);

  useEffect(() => {
    const getData = async () => {
      const workersLearningRate = await getWorkersLearningRate(
        startDate,
        endDate
      );

      setLearningRate(workersLearningRate);
    };

    getData();
  }, []);

  return (
    <div className="w-1/2 h-full border-gray-200 border-[1px] rounded-sm">
      {learningRate ? (
        <div className="p-4 h-full">
          <h1 className="font-semibold">Worker&apos;s Learning Rate</h1>
          {/* First Section */}
          <section
            id="top-level-metrics"
            className="flex items-center justify-between py-5 border-b-[1px] mb-4 h-[20%]"
          >
            <div className="flex flex-col ">
              <span className="text-sm text-gray-500">Hot Topic</span>
              <h1 className="text-[22px] font-semibold">
                {learningRate.hotTopic}
              </h1>
            </div>
          </section>

          {/* Second Section */}
          <section className="h-[75%]" id="metrics-breakdown">
            <ul className="flex flex-col w-full h-full pb-5">
              <li className="w-full flex items-center justify-between text-sm mb-2">
                <span>Topic</span>
                <span>Completion rate (%)</span>
              </li>

              <ScrollArea className=" h-full">
                <div className="flex flex-col gap-1 ">
                  {learningRate.topics
                    .sort((a, b) => b.completionRate - a.completionRate)
                    .map((eachTopic, index) => (
                      <li
                        key={index}
                        className="flex text-sm w-full items-center justify-between p-[1px] hover:bg-gray-100 rounded-sm"
                      >
                        <span className="text-gray-500 w-[60%]">
                          {eachTopic.topic}
                        </span>

                        <div className="flex items-center justify-between gap-2 w-[40%]">
                          <div className="w-[80px]">
                            <Bar barWidth={eachTopic.completionRate} />
                          </div>
                          <span className="text-gray-500 text-xs">
                            {eachTopic.completionRate}
                          </span>
                        </div>
                      </li>
                    ))}
                </div>
              </ScrollArea>
            </ul>
          </section>
        </div>
      ) : (
        <LearningRateSkeleton />
      )}
    </div>
  );
};

export default LearningRate;

const LearningRateSkeleton = () => {
  return (
    <div className="p-4 h-full animate-pulse">
      <h1 className="font-semibold">
        <Skeleton className="h-6 w-1/3" />
      </h1>
      <section
        id="top-level-metrics"
        className="flex items-center justify-between py-5 border-b-[1px] mb-4 h-[20%]"
      >
        <div className="flex w-full h-full flex-col">
          <span className="text-sm text-gray-500">
            <Skeleton className="h-4 w-1/2" />
          </span>
          <h1 className="text-[22px] font-semibold">
            <Skeleton className="h-8 w-1/3 mt-2" />
          </h1>
        </div>
      </section>
      <section className="h-[75%]" id="metrics-breakdown">
        <ul className="flex flex-col w-full h-full pb-5">
          <div className="flex flex-col gap-1">
            {Array.from({ length: 10 }).map((_, index) => (
              <li
                key={index}
                className="flex text-sm w-full items-center justify-between p-[1px] hover:bg-gray-100 rounded-sm"
              >
                <span className="text-gray-500 w-[60%]">
                  <Skeleton className="h-4 w-full" />
                </span>
                <div className="flex items-center justify-between gap-2">
                  <div className="w-[80px]">
                    <Skeleton className="h-4 w-full" />
                  </div>
                  <span className="text-gray-500 text-xs">
                    <Skeleton className="h-4 w-full" />
                  </span>
                </div>
              </li>
            ))}
          </div>
        </ul>
      </section>
    </div>
  );
};

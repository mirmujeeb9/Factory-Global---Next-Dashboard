import {
  AnnualAssessmentResult,
  getAnnualAssessment,
} from "@/actions/brand-data-getters";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { useEffect, useState } from "react";
import Bar from "./Bar";

const AnnualAssessment = ({
  startDate,
  endDate,
}: {
  startDate: Date;
  endDate: Date;
}) => {
  const [assessment, setAssessment] = useState<AnnualAssessmentResult | null>(
    null
  );

  useEffect(() => {
    const getData = async () => {
      const annualAssessment = await getAnnualAssessment(startDate, endDate);

      setAssessment(annualAssessment);
    };

    getData();
  }, []);

  return (
    <div className="w-1/2 h-full border-gray-200 border-[1px] rounded-sm">
      {assessment ? (
        <div className="p-4 h-full">
          <h1 className="font-semibold">Annual assessment</h1>

          {/* First Section */}
          <section
            id="top-level-metrics"
            className="flex items-center justify-between py-5 border-b-[1px] mb-4 h-[20%]"
          >
            <div className="flex flex-col ">
              <span className="text-sm text-gray-500">Total answers</span>
              <h1 className="text-2xl font-semibold">
                {assessment.totalAnswers}
              </h1>
            </div>
            <div className="flex flex-col items-end justify-center">
              <span className="text-sm text-gray-500">Total answers</span>
              <h1 className="text-2xl font-semibold">
                {assessment.averageScore}

                <span className="text-sm font-normal pb-2 text-gray-400">
                  /100
                </span>
              </h1>
            </div>
          </section>

          {/* Second Section */}
          <section className="h-[75%]" id="metrics-breakdown">
            <ul className="flex flex-col w-full h-full pb-5">
              <li className="w-full flex items-center justify-between text-sm mb-2">
                <span>Topic</span>
                <span>Score</span>
              </li>

              <ScrollArea className="h-full">
                <div className="flex flex-col gap-1">
                  {assessment.scores
                    .sort((a, b) => b.value - a.value)
                    .map((eachScore, index) => (
                      <li
                        key={index}
                        className="flex text-sm w-full items-center justify-between p-[1px] hover:bg-gray-100 rounded-sm"
                      >
                        <span className="text-gray-500 w-[60%]">
                          {eachScore.topic}
                        </span>

                        <div className="flex items-center gap-2 w-[40%]">
                          <Bar barWidth={eachScore.value} />
                          <span className="text-gray-500 text-xs">
                            {eachScore.value}
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
        <SkeletonStructure />
      )}
    </div>
  );
};

const SkeletonStructure = () => (
  <div className="p-4 h-full">
    <h1 className="font-semibold">
      <Skeleton className="h-6 w-1/3" />
    </h1>

    {/* First Section */}
    <section
      id="top-level-metrics"
      className="flex items-center w-full justify-between py-5 border-b-[1px] mb-4 h-[20%]"
    >
      <div className="w-full h-full flex flex-col ">
        <span className="text-sm text-gray-500">
          <Skeleton className=" h-4 w-1/4 mb-1" />
        </span>
        <h1 className="text-2xl font-semibold">
          <Skeleton className="h-8 w-1/2" />
        </h1>
      </div>
      <div className="h-full w-full flex flex-col items-end justify-center">
        <span className="text-sm text-gray-500">
          <Skeleton className="h-4 w-1/4" />
        </span>
        <h1 className="text-2xl font-semibold">
          <Skeleton className="h-8 w-1/2" />
        </h1>
      </div>
    </section>

    {/* Second Section */}
    <section className="h-[75%]" id="metrics-breakdown">
      <ul className="flex flex-col w-full h-full pb-5">
        <ScrollArea className="h-full">
          <div className="flex flex-col gap-1 w-full">
            {Array.from({ length: 5 }).map((_, index) => (
              <li
                key={index}
                className="flex text-sm w-full items-center justify-between p-[1px] hover:bg-gray-100 rounded-sm "
              >
                <span className="text-gray-500 w-[60%]">
                  <Skeleton className="h-4 w-full" />
                </span>

                <div className="flex items-center gap-2 w-20">
                  <Skeleton className="h-4 w-3/4" />
                  <span className="text-gray-500 text-xs">
                    <Skeleton className="h-4 w-1/4" />
                  </span>
                </div>
              </li>
            ))}
          </div>
        </ScrollArea>
      </ul>
    </section>
  </div>
);

export default AnnualAssessment;

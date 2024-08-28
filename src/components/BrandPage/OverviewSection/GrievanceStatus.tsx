import {
  GrievanceStatusResult,
  getGrievanceStatus,
} from "@/actions/brand-data-getters";
import { Skeleton } from "@/components/ui/skeleton";
import { ScrollArea } from "@radix-ui/react-scroll-area";
import { useEffect, useState } from "react";

const GrievanceStatus = ({
  startDate,
  endDate,
}: {
  startDate: Date;
  endDate: Date;
}) => {
  const [grievanceStatus, setGrievanceStatus] =
    useState<GrievanceStatusResult | null>(null);

  useEffect(() => {
    const getData = async () => {
      const grievanceStatusData = await getGrievanceStatus(startDate, endDate);

      setGrievanceStatus(grievanceStatusData);
    };

    getData();
  }, []);

  return (
    <div className="w-[80%] h-full border-gray-200 border-[1px] rounded-sm">
      {grievanceStatus ? (
        <div className="p-4 h-full">
          <h1 className="font-semibold">Grievance Status</h1>
          <section
            id="top-level-metrics"
            className="flex items-center py-[14px] border-b-[1px] mb-4"
          >
            {/* Total */}
            <div className="flex flex-col w-1/2">
              <span className="text-sm text-gray-500">Total grievances</span>
              <h1 className="text-2xl font-semibold">
                {grievanceStatus.totalGrievances}
              </h1>
            </div>

            <div className="flex items-center justify-between w-[75%]">
              {/* Response Rate */}
              <div className="flex flex-col items-start justify-center">
                <span className="text-sm text-gray-500">Response rate</span>
                <h1 className="text-2xl font-semibold">
                  {grievanceStatus.responseRate}

                  <span className="text-sm font-normal pb-2 text-gray-400">
                    /100
                  </span>
                </h1>
              </div>

              {/* Resolution Rate */}
              <div className="flex flex-col">
                <span className="text-sm text-gray-500">Resolution rate</span>
                <h1 className="text-2xl font-semibold">
                  {grievanceStatus.resolutionRate}

                  <span className="text-sm font-normal pb-2 text-gray-400">
                    /100
                  </span>
                </h1>
              </div>
            </div>
          </section>
          <section className="flex w-full h-[68%]" id="metrics-breakdown">
            <ul className="flex flex-col w-full h-full">
              <li className="w-full flex items-center justify-between text-sm mb-2">
                <span className="w-[50%]">Topic</span>
                <span className="w-[25%]">Responded</span>
                <span className="w-[25%]">Resolved</span>
                <span className="w-[25%]">Unresolved</span>
              </li>

              <ScrollArea className="">
                <div className="flex flex-col gap-1 h-full">
                  {grievanceStatus.topics
                    .sort((a, b) => b.resolved - a.resolved)
                    .map((eachCategory, index) => (
                      <li
                        key={index}
                        className="flex text-sm w-full items-center justify-between p-[1px] hover:bg-gray-100 rounded-sm"
                      >
                        <span className="text-gray-500 w-[50%]">
                          {eachCategory.topic}
                        </span>
                        <span className="text-gray-500 w-[25%]">
                          {eachCategory.responded}
                        </span>
                        <span className="text-gray-500 w-[25%]">
                          {eachCategory.resolved}
                        </span>
                        <span className="text-gray-500 w-[25%]">
                          {eachCategory.unresolved}
                        </span>
                      </li>
                    ))}
                </div>
              </ScrollArea>
            </ul>
          </section>
        </div>
      ) : (
        <GrievanceSkeleton />
      )}
    </div>
  );
};

export default GrievanceStatus;

const GrievanceSkeleton = () => {
  return (
    <div className="p-4 h-full animate-pulse">
      <h1 className="font-semibold">
        <Skeleton className="h-6 w-1/3" />
      </h1>
      <section
        id="top-level-metrics"
        className="flex items-center py-[14px] border-b-[1px] mb-4"
      >
        <div className="flex flex-col w-1/2">
          <span className="text-sm text-gray-500">
            <Skeleton className="h-4 w-1/2" />
          </span>
          <h1 className="text-2xl font-semibold">
            <Skeleton className="h-8 w-1/3 mt-2" />
          </h1>
        </div>

        <div className="flex items-center justify-between w-[75%]">
          <div className="flex flex-col items-start justify-center">
            <span className="text-sm text-gray-500">
              <Skeleton className="h-4 w-1/2" />
            </span>
            <h1 className="text-2xl font-semibold">
              <Skeleton className="h-8 w-1/3" />
              <span className="text-sm font-normal pb-2 text-gray-400">
                <Skeleton className="h-4 w-1/4" />
              </span>
            </h1>
          </div>

          <div className="flex flex-col">
            <span className="text-sm text-gray-500">
              <Skeleton className="h-4 w-1/2" />
            </span>
            <h1 className="text-2xl font-semibold">
              <Skeleton className="h-8 w-1/3" />
              <span className="text-sm font-normal pb-2 text-gray-400">
                <Skeleton className="h-4 w-1/4" />
              </span>
            </h1>
          </div>
        </div>
      </section>
      <section className="flex w-full h-[68%]" id="metrics-breakdown">
        <ul className="flex flex-col w-full h-full">
          <li className="w-full flex items-center justify-between text-sm mb-2 gap-2">
            <span className="w-[50%]">
              <Skeleton className="h-4 w-full" />
            </span>
            <span className="w-[25%]">
              <Skeleton className="h-4 w-full" />
            </span>
            <span className="w-[25%]">
              <Skeleton className="h-4 w-full" />
            </span>
            <span className="w-[25%]">
              <Skeleton className="h-4 w-full" />
            </span>
          </li>

          <ScrollArea className="">
            <div className="flex flex-col gap-1 h-full">
              {Array.from({ length: 10 }).map((_, index) => (
                <li
                  key={index}
                  className="flex text-sm w-full items-center justify-between p-[1px] hover:bg-gray-100 rounded-sm gap-2"
                >
                  <span className="text-gray-500 w-[50%]">
                    <Skeleton className="h-4 w-full" />
                  </span>
                  <span className="text-gray-500 w-[25%]">
                    <Skeleton className="h-4 w-full" />
                  </span>
                  <span className="text-gray-500 w-[25%]">
                    <Skeleton className="h-4 w-full" />
                  </span>
                  <span className="text-gray-500 w-[25%]">
                    <Skeleton className="h-4 w-full" />
                  </span>
                </li>
              ))}
            </div>
          </ScrollArea>
        </ul>
      </section>
    </div>
  );
};

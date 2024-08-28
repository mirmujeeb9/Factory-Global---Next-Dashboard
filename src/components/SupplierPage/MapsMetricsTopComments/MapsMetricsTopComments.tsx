"use client";

import MapChart from "@/components/SupplierPage/MapsMetricsTopComments/MapChart";
import { Card } from "@/components/ui/card";
import { useKnoStore } from "@/store/zustand";
import { usePathname } from "next/navigation";
import TopComments from "./TopComments";

const MapsMetricsTopComments = () => {
  const pathname = usePathname();
  const supplierSlug = pathname.substring(pathname.lastIndexOf("/") + 1);

  const { startDate, endDate } = useKnoStore((state) => ({
    startDate: state.supplierStartDate,
    endDate: state.supplierEndDate,
  }));

  return (
    <div className="flex h-[400px] w-full gap-2">
      <div className="h-full w-[400px]">
        <MapChart />
      </div>
      <div className="h-full flex-1 flex flex-col gap-2">
        <Card className="h-[30%] w-full flex">
          {/* First Metric */}
          <div className="h-full w-full rounded-sm flex flex-col p-3 px-4 justify-center">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-400">
                {"Recommendation score"}
              </span>
            </div>
            <h1 className="text-3xl font-semibold">{27}%</h1>
          </div>

          {/* Second Metric */}
          <div className="h-full w-full rounded-sm flex flex-col p-3 px-4 justify-center">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-400">{"Total Employees"}</span>
            </div>
            <h1 className="text-3xl font-semibold">160</h1>
          </div>

          {/* Third Metric Set */}
          <div className="h-full w-full rounded-sm flex flex-col p-3 px-4 justify-center">
            <table className="w-full text-sm font-medium">
              <tbody>
                <tr>
                  <td className="pr-4 text-gray-400">Joined</td>
                  <td>15th July, 2018</td>
                </tr>
                <tr>
                  <td className="pr-4 text-gray-400">Location</td>
                  <td>China</td>
                </tr>
                <tr>
                  <td className="pr-4 text-gray-400">ID</td>
                  <td>324324234</td>
                </tr>
              </tbody>
            </table>
          </div>
        </Card>

        <TopComments />
      </div>
    </div>
  );
};

export default MapsMetricsTopComments;

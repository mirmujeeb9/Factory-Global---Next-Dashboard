import MapChart from "./MapChart";
import TotalRecommendationScore from "./TotalRecommendationScore";
import TotalSuppliers from "./TotalSuppliers";
import WorkersOverTimeChart from "./WorkersOverTimeChart";

const MapsAndChart = () => {
  return (
    <div className="w-full max-h-[400px] h-[400px] grid grid-cols-2 gap-2">
      <MapChart />
      <div className="flex flex-col col-span-1 row-span-1 gap-2 h-full w-full">
        <div className="h-[25%] flex items-center justify-center gap-2">
          <TotalSuppliers />
          <TotalRecommendationScore />
        </div>

        <div className="w-full h-full">
          <WorkersOverTimeChart />
        </div>
      </div>
    </div>
  );
};

export default MapsAndChart;

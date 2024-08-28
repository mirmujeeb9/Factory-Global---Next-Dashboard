import { getTotalMetric } from "@/actions/brand-data-getters";
import MetricWidget from "./MetricWidgets/MetricWidget";
import RegisterationRate from "./MetricWidgets/RegisterationRate";

const MetricWidgets = () => {
  return (
    <div className="h-[80px] w-full flex gap-2">
      <RegisterationRate />

      <div className="h-full w-full flex gap-2">
        <MetricWidget
          startDate={new Date()}
          endDate={new Date()}
          label="Total grievances"
          value="grievances"
          fetchData={getTotalMetric}
        />
        <MetricWidget
          startDate={new Date()}
          endDate={new Date()}
          label="Comments"
          value="comments"
          fetchData={getTotalMetric}
        />
        <MetricWidget
          startDate={new Date()}
          endDate={new Date()}
          label="Photos"
          value="photos"
          fetchData={getTotalMetric}
        />
      </div>
    </div>
  );
};

export default MetricWidgets;

import { ArrowUpRight } from "lucide-react";
import { ScrollArea, ScrollBar } from "../ui/scroll-area";
import ValueRing from "./ValueRing";

const AnnualAssessmentScoresBreakdown = () => {
  return (
    <div className="flex w-full my-10 flex-col gap-5">
      <div className="flex items-center justify-between w-full">
        <h1 className="text-lg font-semibold">Annual assessment scores</h1>
      </div>

      <ScrollArea className="w-full whitespace-nowrap rounded-md border border-gray-200">
        <div className="flex w-max">
          {[
            { title: "Safety", value: Math.floor(Math.random() * 101) },
            { title: "Health", value: Math.floor(Math.random() * 101) },
            { title: "Environment", value: Math.floor(Math.random() * 101) },
            { title: "Quality", value: Math.floor(Math.random() * 101) },
            { title: "Training", value: Math.floor(Math.random() * 101) },
            { title: "Compliance", value: Math.floor(Math.random() * 101) },
            { title: "Efficiency", value: Math.floor(Math.random() * 101) },
            { title: "Productivity", value: Math.floor(Math.random() * 101) },
            { title: "Innovation", value: Math.floor(Math.random() * 101) },
            { title: "Sustainability", value: Math.floor(Math.random() * 101) },
            { title: "Ethics", value: Math.floor(Math.random() * 101) },
            { title: "Community", value: Math.floor(Math.random() * 101) },
            { title: "Engagement", value: Math.floor(Math.random() * 101) },
            { title: "Diversity", value: Math.floor(Math.random() * 101) },
            { title: "Leadership", value: Math.floor(Math.random() * 101) },
          ].map((item, index) => (
            <div
              key={index}
              className="w-[220px] flex items-center justify-center relative h-[280px] group border-r-gray-200 border-r bg-gray-50/[0.0] hover:bg-gray-50/[1.0] duration-50 cursor-pointer"
            >
              <ArrowUpRight
                size={16}
                className="absolute top-4 right-4 duration-200 text-gray-400 opacity-0 group-hover:opacity-100"
              />

              <h1 className="absolute text-sm font-semibold top-3 left-3">
                {item.title}
              </h1>

              <ValueRing value={item.value} />
            </div>
          ))}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </div>
  );
};

export default AnnualAssessmentScoresBreakdown;

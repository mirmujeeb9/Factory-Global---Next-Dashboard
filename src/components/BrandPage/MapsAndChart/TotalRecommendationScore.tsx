import { getTotalRecommendationScore } from "@/actions/brand-data-getters";

const TotalRecommendationScore = async () => {
  const recommendationScore = await getTotalRecommendationScore();

  return (
    <div className="h-full w-1/2 border-black/[0.1] border-[1px] rounded-sm flex flex-col p-3 justify-center">
      <span className="text-sm text-gray-400">Recommendation score</span>
      <h1 className="font-semibold text-4xl">{recommendationScore}%</h1>
    </div>
  );
};

export default TotalRecommendationScore;

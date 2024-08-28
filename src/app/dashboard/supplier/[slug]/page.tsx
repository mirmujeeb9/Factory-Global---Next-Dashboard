import AnnualAssessmentScoresBreakdown from "@/components/SupplierPage/AnnualAssessmentScoresBreakdown";
import CompletionRatesBreakdown from "@/components/SupplierPage/CompletionRatesBreakdown";
import Grievances from "@/components/SupplierPage/Grievances";
import HeadingAndDateSpanSelector from "@/components/SupplierPage/HeadingAndDateSpanSelector";
import MapsMetricsTopComments from "@/components/SupplierPage/MapsMetricsTopComments/MapsMetricsTopComments";
import WorkerComments from "@/components/SupplierPage/WorkerComments";

export default function Page({ params }: { params: { slug: string } }) {
  return (
    <main className="flex flex-col max-w-7xl w-full py-10 pt-2 gap-y-2">
      {/* Heading and date span selector */}
      <HeadingAndDateSpanSelector />

      {/* Maps and Metrics and Top Comments */}
      <MapsMetricsTopComments />

      {/* How many workers completed each topic? */}
      <CompletionRatesBreakdown />

      {/* Annual Assessment Scores */}
      <AnnualAssessmentScoresBreakdown />

      {/* Grievneces Table */}
      <Grievances />

      {/* Worker Comments */}
      <WorkerComments />
    </main>
  );
}

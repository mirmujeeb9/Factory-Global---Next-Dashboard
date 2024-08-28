import LogoAndDateBracketSelector from "@/components/BrandPage/LogoAndDateBracketSelector";
import MapsAndChart from "@/components/BrandPage/MapsAndChart/MapsAndChart";
import MetricWidgets from "@/components/BrandPage/MetricWidgets";
import OverviewAndSupplierTabs from "@/components/BrandPage/OverviewAndSupplierTabs";
import DashboardTabs from "@/components/DashboardTabs";
import { auth, clerkClient } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function Layout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { slug: string };
}) {
  const { userId, orgId, has, protect, orgSlug } = auth();

  protect();

  if (
    (
      await clerkClient?.organizations.getOrganization({
        organizationId: orgId as string,
      })
    )?.publicMetadata?.type === "supplier"
  ) {
    console.log("This is supplier.");
    redirect("/dashboard/supplier");
  }

  return (
    <main className="flex flex-col max-w-7xl w-full py-10 pt-2 gap-y-2">
      {/* Logo and date-span picker */}
      <LogoAndDateBracketSelector />

      {/* Maps and Metrics */}
      <MapsAndChart />

      {/* Metrics */}
      <MetricWidgets />

      <DashboardTabs>
        <div className="flex items-center justify-between w-full">
          <OverviewAndSupplierTabs />
        </div>

        <section>{children}</section>
      </DashboardTabs>

      {/* {children} */}
    </main>
  );
}

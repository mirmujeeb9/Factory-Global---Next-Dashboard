import TestBanner from "@/components/TestBanner";
import { auth, clerkClient } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

const page = async ({ params }: { params: { slug: string } }) => {
  const { orgId, orgSlug } = auth();

  // If supplier id not in search params:
  // - Retrieve active organization
  // - Check if it's a supplier
  // - Route to the supplier's dashboard with the correct orgSlug
  const organization = await clerkClient?.organizations.getOrganization({
    organizationId: orgId as string,
  });

  if (
    organization?.publicMetadata?.type === "supplier" &&
    orgSlug !== params.slug
  ) {
    redirect(`/dashboard/supplier/${orgSlug}`);
  }

  return <TestBanner val="Suppliers Dashboard" />;
};

export default page;

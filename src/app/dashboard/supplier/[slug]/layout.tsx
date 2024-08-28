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
  const isSupplier =
    (
      await clerkClient?.organizations.getOrganization({
        organizationId: orgId as string,
      })
    )?.publicMetadata?.type === "supplier";

  protect();

  // Check three things (For security check: make sure suppliers cannot access other supplier's pages)
  // - If I'm a supplier
  // - And my slug doens't match the incoming slug
  // - Peform a redirect to the slug of the supplier.
  if (isSupplier && orgSlug !== params.slug) {
    redirect(`/dashboard/supplier/${orgSlug}`);
  }

  return <>{children}</>;
}

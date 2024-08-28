import { auth, clerkClient } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { userId, orgId, has, protect } = auth();

  protect();

  const orgs_membership = await clerkClient.users.getOrganizationMembershipList(
    { userId: userId as string }
  );

  // For users that are employees or admins of the active organization, redirect them to the dashboard.
  if (orgs_membership.totalCount > 0 && orgId) {
    if (has({ role: "org:admin" }) || has({ role: "org:employee" })) {
      redirect("/dashboard");
    }
  }

  return <>{children}</>;
}

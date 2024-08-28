import { auth, clerkClient } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function Home() {
  const { has, userId, orgId } = auth();

  const orgs_membership = await clerkClient.users.getOrganizationMembershipList(
    {
      userId: userId as string,
    }
  );

  console.log("Orgs Membership: ", orgs_membership);

  // For users that are employees or admins of the active organization, redirect them to the dashboard.
  if (orgs_membership.totalCount > 0 && orgId) {
    if (has({ role: "org:admin" }) || has({ role: "org:employee" })) {
      redirect("/dashboard");
    }
  } else {
    redirect("/join");
  }
}

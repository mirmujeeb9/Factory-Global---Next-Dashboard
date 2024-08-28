import NavBar from "@/components/NavBar/NavBar";
import { auth, clerkClient } from "@clerk/nextjs/server";
import { Loader } from "lucide-react";
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

  // If the current user is a member of a number of organizations and currently doesn't have an active organizations, then show a loading state.
  if (orgs_membership.totalCount > 0 && !orgId) {
    return (
      <div className="w-screen h-screen flex flex-col items-center justify-center">
        <Loader className="animate-spin" />
      </div>
    );
  }

  

  // If the current user has an active organization and he's the admin and has the permissions, then show the dashboard.
  if (orgs_membership.totalCount > 0 && orgId) {
    // The user can either be admin | employee
    if (has({ role: "org:admin" }) || has({ role: "org:employee" })) {
      return (
        <div>
          <NavBar />
          <div className="flex flex-col w-screen h-full items-center">
            {children}
          </div>
        </div>
      );
    }
  }

  redirect("/join");
}

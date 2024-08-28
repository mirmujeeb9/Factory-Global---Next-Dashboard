import { auth, clerkClient } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

const page = async () => {
  const { orgId } = auth();

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

  redirect("/dashboard/overview");
};

export default page;

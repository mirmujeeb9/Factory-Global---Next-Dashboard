"use client";

import { useAuth, useOrganizationList } from "@clerk/nextjs";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";

export function SyncActiveOrganization() {
  const { setActive, isLoaded } = useOrganizationList();

  // Get the organization ID from the session
  const { orgId } = useAuth();

  // Get the organization ID from the URL
  const urlOrgId = useSearchParams().get("orgId");

  useEffect(() => {
    if (!isLoaded) return;

    // If the org ID in the URL is not the same as the org ID in the session (the active organization), set the active organization to be the org ID from the URL
    if (urlOrgId && urlOrgId !== orgId) {
      console.log("Setting active org");
      void setActive({ organization: urlOrgId }).then(() => {
        window.location.reload();
      });
    }
  }, [orgId, isLoaded, setActive, urlOrgId]);

  return null;
}

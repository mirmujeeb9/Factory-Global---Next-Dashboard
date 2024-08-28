"use client";

import { Organization } from "@clerk/backend";
import { useAuth, useOrganizationList } from "@clerk/nextjs";
import { UserOrganizationInvitationResource } from "@clerk/types";
import Link from "next/link";
import { redirect } from "next/navigation";
import { useState } from "react";
import { Button } from "../../../ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../../ui/dialog";

const ClickToJoinDialog = ({
  isOpen,
  setIsOpen,
  selectedSupplier,
  selectedInvitation,
}: {
  isOpen: boolean;
  setIsOpen: (arg1: boolean) => void;
  selectedSupplier: Organization | undefined;
  selectedInvitation: UserOrganizationInvitationResource;
}) => {
  const { userId } = useAuth();
  const { setActive, isLoaded } = useOrganizationList();
  const [isRedirecting, setIsRedirecting] = useState(false);

  return (
    <Dialog open={isOpen} onOpenChange={() => setIsOpen(!isOpen)}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Join supplier</DialogTitle>
          {selectedSupplier && (
            <div className="py-4 text-sm">
              <ul>
                <li className="flex items-center justify-between">
                  <span className="font-semibold">Brand</span>
                  <span className="text-gray-500">{selectedSupplier.name}</span>
                </li>
                <li className="flex items-center justify-between">
                  <span className="font-semibold">Website</span>
                  <Link href={selectedSupplier?.publicMetadata?.website || "/"}>
                    <span className="text-gray-500 underline">
                      {selectedSupplier?.publicMetadata?.website as string}
                    </span>
                  </Link>
                </li>
              </ul>
            </div>
          )}
          <DialogDescription className="mt-4">
            Once you click join, you&apos;ll be redirected to Kno Global
            suppliers dashboard.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter>
          {selectedSupplier && (
            <>
              <Button
                onClick={async () => {
                  if (isLoaded) {
                    setIsRedirecting(true);
                    await selectedInvitation.accept();

                    void setActive({
                      organization:
                        selectedInvitation.publicOrganizationData.id,
                    });

                    setTimeout(() => {
                      redirect("/dashboard");
                    }, 1000);
                  }
                }}
                type="submit"
                role="link"
                disabled={isRedirecting}
              >
                {isRedirecting ? "Redirecting..." : "Accept"}
              </Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ClickToJoinDialog;

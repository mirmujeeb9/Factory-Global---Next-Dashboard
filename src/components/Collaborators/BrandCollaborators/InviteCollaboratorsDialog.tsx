"use client";

import { OrganizationInvitationResource } from "@clerk/types";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../../ui/dialog";

import { useOrganization } from "@clerk/nextjs";
import { useState } from "react";
import ActiveMembers from "./ActiveMembers";
import InviteByEmail from "./InviteByEmail";
import InvitedMembers from "./InvitedMembers";

const InviteCollaborators: React.FC<{
  isInviteCollabsOpen: boolean;
  setIsInviteCollabsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}> = ({ isInviteCollabsOpen, setIsInviteCollabsOpen }) => {
  const { organization, isLoaded } = useOrganization();
  const [invitedEmails, setInvitedEmails] = useState<
    OrganizationInvitationResource[]
  >([]);

  const getInvites = async () => {
    console.log("Firing get invites.");

    if (isLoaded) {
      await new Promise((resolve) => setTimeout(resolve, 500)); // 0.5 second delay

      const invites = await organization?.getInvitations();
      const nonRevoked = invites?.data.filter(
        (each) => each.status != "revoked"
      );

      console.log("Invites: ", invites);

      setInvitedEmails(nonRevoked as OrganizationInvitationResource[]);
    }
  };

  return (
    <Dialog
      open={isInviteCollabsOpen}
      onOpenChange={() => setIsInviteCollabsOpen(!isInviteCollabsOpen)}
    >
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Invite collaborators</DialogTitle>
          <DialogDescription>Invite employees and admins.</DialogDescription>
        </DialogHeader>

        {/* Email invite input with invite button */}
        <InviteByEmail getInvites={getInvites} />

        {/* List of Active Members */}
        <ActiveMembers />

        {/* List of Invited Members */}
        <InvitedMembers invitedEmails={invitedEmails} getInvites={getInvites} />
      </DialogContent>
    </Dialog>
  );
};

export default InviteCollaborators;

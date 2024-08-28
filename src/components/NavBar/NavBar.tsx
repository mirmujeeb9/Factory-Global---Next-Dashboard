"use client";

import { Protect } from "@clerk/nextjs";
import { UserRoundPlus } from "lucide-react";
import { useState } from "react";
import InviteCollaborators from "../Collaborators/BrandCollaborators/InviteCollaboratorsDialog";
import { Button } from "../ui/button";
import Logo from "./Logo";
import MainMenu from "./MainMenu/MainMenu";

const NavBar = () => {
  const [isInviteCollabsOpen, setIsInviteCollabsOpen] = useState(false);

  return (
    <div className="w-full h-14 px-5 flex items-center justify-between border-b-black/[0.1] border-b-[1px]">
      <Logo />

      <div className="flex items-center gap-4">
        {/* Protect for org:admin: <Button | InviteCollaborators> */}
        <Protect role="org:admin">
          <Button
            onClick={() => setIsInviteCollabsOpen(!isInviteCollabsOpen)}
            variant={"outline"}
            className="h-8 gap-2"
          >
            <UserRoundPlus size={14} />
            Collaborators
          </Button>
          <InviteCollaborators
            isInviteCollabsOpen={isInviteCollabsOpen}
            setIsInviteCollabsOpen={setIsInviteCollabsOpen}
          />
        </Protect>

        {/* Main Menu Dropdown */}
        <MainMenu />
      </div>
    </div>
  );
};

export default NavBar;

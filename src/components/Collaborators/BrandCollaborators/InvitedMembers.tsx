import { useOrganization } from "@clerk/nextjs";
import { OrganizationInvitationResource } from "@clerk/types";
import { Trash2 } from "lucide-react";
import { useEffect } from "react";
import { Button } from "../../ui/button";

const InvitedMembers = ({
  invitedEmails,
  getInvites,
}: {
  invitedEmails: OrganizationInvitationResource[];
  getInvites: () => void;
}) => {
  const { isLoaded, organization } = useOrganization();

  useEffect(() => {
    getInvites();
  }, [isLoaded]);

  return (
    <>
      {invitedEmails.filter((invite) => invite.status === "pending").length >
        0 && (
        <>
          <div className="flex flex-col">
            <div className="w-full border-b-black/[0.05] border-b-[1px] my-5"></div>
            <h1 className="font-semibold mb-2">Invitations pending</h1>
          </div>

          <div className="grid gap-4">
            {invitedEmails
              .filter((invite) => invite.status === "pending")
              .map((invite, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 border rounded-lg shadow-sm"
                >
                  <div className="flex flex-col">
                    <p>{invite.emailAddress}</p>
                    <p className="text-gray-400 text-[13px]">
                      {invite.status === "pending" && "Pending"}
                      {invite.status === "accepted" && "Accepted"}
                    </p>
                  </div>

                  <div className="flex gap-1">
                    <Button
                      className="w-8 h-8"
                      variant={"destructive"}
                      size={"icon"}
                      onClick={async () => {
                        await invite.revoke();
                      }}
                    >
                      <Trash2 size={14} />
                    </Button>
                  </div>
                </div>
              ))}
          </div>
        </>
      )}
    </>
  );
};

export default InvitedMembers;

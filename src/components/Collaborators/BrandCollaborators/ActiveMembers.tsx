import { useAuth, useOrganization } from "@clerk/nextjs";
import { OrganizationMembershipResource } from "@clerk/types";
import { useEffect, useState } from "react";

const ActiveMembers = () => {
  const [activeMembers, setActiveMembers] = useState<
    OrganizationMembershipResource[]
  >([]);
  const { organization, isLoaded } = useOrganization();
  const { userId } = useAuth();

  const getActiveMembers = async () => {
    if (isLoaded) {
      const members = (await organization?.getMemberships())?.data.filter(
        (eachMember) => eachMember.publicUserData.userId !== userId
      );

      console.log("Members: ", members);

      setActiveMembers(members as OrganizationMembershipResource[]);
    }
  };

  useEffect(() => {
    getActiveMembers();
  }, [isLoaded]);

  return (
    <>
      {" "}
      {activeMembers.length > 0 && (
        <>
          <div className="flex flex-col">
            <div className="w-full border-b-black/[0.05] border-b-[1px] my-5"></div>
            <h1 className="font-semibold mb-2">Active collaborators</h1>
          </div>

          <div className="grid gap-y-4">
            {activeMembers.map((members, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 border rounded-lg shadow-sm"
              >
                <div className="flex  items-center justify-between w-full">
                  <p className="text-[14px]">
                    {members.publicUserData.identifier}
                  </p>
                  <p className="text-gray-400 text-[14px]">{"Accepted"}</p>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </>
  );
};

export default ActiveMembers;

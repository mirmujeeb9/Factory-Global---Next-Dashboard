"use client";

import {
  getAllSupplierOrganizations,
  getSingleOrganization,
} from "@/actions/actions";
import SearchBar from "@/components/JoinOrganizationsComponents/SearchBar";
import SupplierCard from "@/components/JoinOrganizationsComponents/Supplier/SupplierCard";
import { Card } from "@/components/ui/card";
import { Organization } from "@clerk/backend";
import { loadStripe } from "@stripe/stripe-js";
import { toast } from "sonner";

import { useEffect, useState } from "react";

export type SupplierPublicMetadata = {
  name?: string;
  verified?: boolean;
  description?: string;
  website?: string;
  adminEmail?: string;
  type?: string;
};

export type SupplierType = Organization & {
  publicMetadata: SupplierPublicMetadata;
};
export type InvitationSupplierType = UserOrganizationInvitationResource & {
  publicMetadata: SupplierPublicMetadata;
};

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY as string
);

import CreateSupplier from "@/components/JoinOrganizationsComponents/Supplier/CreateSupplier";
import ClickToJoinDialog from "@/components/JoinOrganizationsComponents/Supplier/Dialogs/ClickToJoinDialog";
import ClickToRequestJoiningDialog from "@/components/JoinOrganizationsComponents/Supplier/Dialogs/ClickToRequestJoiningDialog";
import ClickToVerifyDialog from "@/components/JoinOrganizationsComponents/Supplier/Dialogs/ClickToVerifyDialog";
import InvitationSupplierCard from "@/components/JoinOrganizationsComponents/Supplier/InvitationSupplierCard";
import SupplierCards from "@/components/Skeletons/SupplierCards";
import { useClerk, useOrganizationList } from "@clerk/nextjs";
import { UserOrganizationInvitationResource } from "@clerk/types";

export default function Page() {
  const [searchTerm, setSearchTerm] = useState("");
  const [suppliers, setSuppliers] = useState<SupplierType[]>([]);
  const [loading, setLoading] = useState(true);

  const [isInviteDialogOpen, setIsInviteDialogOpen] = useState(false);
  const [isSupplierDialogOpen, setIsSupplierDialogOpen] = useState(false);
  const [isRequestToJoin, setIsRequestToJoin] = useState(false);

  const [selectedSupplier, setSelectedSupplier] = useState<SupplierType>();
  const [selectedInviteSupplier, setSelectedInviteSupplier] =
    useState<Organization>();
  const [selectedInvitation, setSelectedInvitation] =
    useState<UserOrganizationInvitationResource>();

  const [userInvitationOrgs, setUserInvitationOrgs] = useState<
    { invite: UserOrganizationInvitationResource; org: Organization }[]
  >([]);

  const { userInvitations } = useOrganizationList({
    userInvitations: true,
    userMemberships: true,
  });

  const { user } = useClerk();

  useEffect(() => {
    const getInviteOrgs = async () => {
      const orgs = await Promise.all(
        userInvitations?.data?.map(async (invite) => {
          const org = await getSingleOrganization(
            invite.publicOrganizationData.id
          );
          return { invite, org };
        }) || []
      );

      setUserInvitationOrgs(orgs);
    };

    getInviteOrgs();
  }, [userInvitations.count]);

  const filteredSuppliers = suppliers.filter((supplier) => {
    return supplier.name.toLowerCase().includes(searchTerm.toLowerCase());
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      const query = new URLSearchParams(window.location.search);

      query.forEach((value, key) => {
        console.log(`${key}: ${value}`);
      });

      if (query.get("success") === "true") {
        toast.success(
          `${query.get("supplierName")} has been verified as a supplier.`
        );
      }
    }, 1000); // Delay of 1 second

    return () => clearTimeout(timer); // Cleanup the timer on component unmount
  }, []);

  const getAllSuppliers = () => {
    getAllSupplierOrganizations({ limit: 500 }).then((res: SupplierType[]) => {
      setSuppliers(res);
      setLoading(false);
    });
  };

  useEffect(() => {
    getAllSuppliers();
  }, []);

  useEffect(() => {
    // Check to see if this is a redirect back from Checkout
    const query = new URLSearchParams(window.location.search);
    if (query.get("success")) {
      console.log("Order placed! You will receive an email confirmation.");
      toast.success("Order placed! You will receive an email confirmation."); // Show success toast
    }

    if (query.get("canceled")) {
      console.log(
        "Order canceled -- continue to shop around and checkout when you’re ready."
      );
    }
  }, []);

  return (
    <div className="container mx-auto py-8 ">
      <div className="w-full flex items-center justify-center py-10">
        <h1 className="w-fit text-xl font-medium">Select your supplier</h1>
      </div>
      <div className="flex justify-between items-center mb-6 ">
        <CreateSupplier
          getAllSuppliers={getAllSuppliers}
          suppliers_count={suppliers.length}
        />
        <SearchBar
          placeholder="Search suppliers..."
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
        />
      </div>

      {loading ? (
        <SupplierCards />
      ) : (
        <div className="flex flex-col gap-10">
          <div className="">
            <h1 className="text-xl font-semibold mb-4">Suppliers</h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
              {filteredSuppliers.length === 0 ? (
                <div className="text-center text-black/[0.5] h-[200px] border-black/[0.1] border-[1px] rounded-md mt-10 w-full flex items-center justify-center col-span-full">
                  No suppliers available. Please create a new supplier.
                </div>
              ) : (
                <>
                  {userInvitationOrgs
                    .sort((a, b) => a.org.name.localeCompare(b.org.name))
                    .map((supplier) => (
                      <Card
                        onClick={() => {
                          setSelectedInviteSupplier(supplier.org);
                          setSelectedInvitation(supplier.invite);

                          setIsInviteDialogOpen(true);
                        }}
                        key={supplier.org.id}
                        className="relative hover:cursor-pointer border-[1px] border-orange-500/[0.5] hover:border-orange-500 bg-gradient-to-br from-orange-300/[0.1] to-orange-300/[0.05] group w-full h-[200px] hover:shadow-md flex items-center justify-center overflow-hidden rounded-lg"
                      >
                        <InvitationSupplierCard
                          supplier={supplier.org as SupplierType}
                        />
                      </Card>
                    ))}

                  {filteredSuppliers
                    .filter(
                      (supplier) =>
                        !userInvitationOrgs.some(
                          (invitedSupplier) =>
                            invitedSupplier.org.id === supplier.id
                        )
                    )
                    .sort((a, b) => a.name.localeCompare(b.name))
                    .sort(
                      (a, b) =>
                        (b.publicMetadata.verified ? 1 : 0) -
                        (a.publicMetadata.verified ? 1 : 0)
                    )
                    .map((supplier) => (
                      <Card
                        onClick={() => {
                          // If the user is a part of no organization and the organization is unverified -> Open the supplier dialog to process payment
                          if (!supplier.publicMetadata.verified) {
                            setSelectedSupplier(supplier);
                            setIsSupplierDialogOpen(true);
                          }
                          // If the user is a part of no organization and the organization is verified -> Open the request to join dialog.

                          if (supplier.publicMetadata.verified) {
                            setSelectedSupplier(supplier);
                            setIsRequestToJoin(true);
                          }
                        }}
                        key={supplier.id}
                        className="relative hover:cursor-pointer group w-full h-[200px] hover:shadow-md flex items-center justify-center overflow-hidden rounded-lg"
                      >
                        <SupplierCard supplier={supplier} />
                      </Card>
                    ))}
                </>
              )}

              <ClickToVerifyDialog
                isOpen={isSupplierDialogOpen}
                setIsOpen={setIsSupplierDialogOpen}
                selectedSupplier={selectedSupplier}
              />

              <ClickToRequestJoiningDialog
                isOpen={isRequestToJoin}
                setIsOpen={setIsRequestToJoin}
                selectedSupplier={selectedSupplier}
              />

              <ClickToJoinDialog
                isOpen={isInviteDialogOpen}
                setIsOpen={setIsInviteDialogOpen}
                selectedSupplier={selectedInviteSupplier}
                selectedInvitation={
                  selectedInvitation as UserOrganizationInvitationResource
                }
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

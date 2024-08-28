"use client";

import {
  getAllBrandOrganizations,
  getSingleOrganization,
} from "@/actions/actions";
import BrandCard from "@/components/JoinOrganizationsComponents/Brand/BrandCard";
import CreateBrand from "@/components/JoinOrganizationsComponents/Brand/CreateBrand";
import SearchBar from "@/components/JoinOrganizationsComponents/SearchBar";
import { Card } from "@/components/ui/card";
import { Organization } from "@clerk/backend";
import { loadStripe } from "@stripe/stripe-js";
import { toast } from "sonner";

import { useEffect, useState } from "react";

export type BrandPublicMetadata = {
  name?: string;
  verified?: boolean;
  description?: string;
  website?: string;
  adminEmail?: string;
  brandFetch?: BrandFetchBrandSchema;
  type?: string;
};

export type BrandType = Organization & { publicMetadata: BrandPublicMetadata };
export type InvitationBrandType = UserOrganizationInvitationResource & {
  publicMetadata: BrandPublicMetadata;
};

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY as string
);

import ClickToJoinDialog from "@/components/JoinOrganizationsComponents/Brand/Dialogs/ClickToJoinDialog";
import ClickToRequestJoiningDialog from "@/components/JoinOrganizationsComponents/Brand/Dialogs/ClickToRequestJoiningDialog";
import ClickToVerifyDialog from "@/components/JoinOrganizationsComponents/Brand/Dialogs/ClickToVerifyDialog";
import InvitationBrandCard from "@/components/JoinOrganizationsComponents/Brand/InvitationBrandCard";
import BrandCards from "@/components/Skeletons/BrandCards";
import { BrandFetchBrandSchema } from "@/lib/types";
import { useClerk, useOrganizationList } from "@clerk/nextjs";
import { UserOrganizationInvitationResource } from "@clerk/types";

export default function Page() {
  const [searchTerm, setSearchTerm] = useState("");
  const [brands, setBrands] = useState<BrandType[]>([]);
  const [loading, setLoading] = useState(true);

  const [isInviteDialogOpen, setIsInviteDialogOpen] = useState(false);
  const [isBrandDialogOpen, setIsBrandDialogOpen] = useState(false);
  const [isRequestToJoin, setIsRequestToJoin] = useState(false);

  const [selectedBrand, setSelectedBrand] = useState<BrandType>();
  const [selectedInviteBrand, setSelectedInviteBrand] =
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

  const filteredBrands = brands.filter((brand) => {
    return brand.name.toLowerCase().includes(searchTerm.toLowerCase());
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      const query = new URLSearchParams(window.location.search);

      query.forEach((value, key) => {
        console.log(`${key}: ${value}`);
      });

      if (query.get("success") === "true") {
        toast.success(
          `${query.get("brandName")} has been verified as a brand.`
        );
      }
    }, 1000); // Delay of 1 second

    return () => clearTimeout(timer); // Cleanup the timer on component unmount
  }, []);

  const getAllBrands = () => {
    getAllBrandOrganizations({ limit: 500 }).then((res: BrandType[]) => {
      setBrands(res);
      setLoading(false);
    });
  };

  useEffect(() => {
    getAllBrands();
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
        <h1 className="w-fit text-xl font-medium">Select your brand</h1>
      </div>
      <div className="flex justify-between items-center mb-6 ">
        <CreateBrand getAllBrands={getAllBrands} brands_count={brands.length} />
        <SearchBar
          placeholder="Search brands..."
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
        />
      </div>

      {loading ? (
        <BrandCards />
      ) : (
        <div className="flex flex-col gap-10">
          <div className="">
            <h1 className="text-xl font-semibold mb-4">Brands</h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
              {filteredBrands.length === 0 ? (
                <div className="text-center text-black/[0.5] h-[200px] border-black/[0.1] border-[1px] rounded-md mt-10 w-full flex items-center justify-center col-span-full">
                  No brands available. Please create a new brand.
                </div>
              ) : (
                <>
                  {userInvitationOrgs
                    .sort((a, b) => a.org.name.localeCompare(b.org.name))
                    .map((brand) => (
                      <Card
                        onClick={() => {
                          setSelectedInviteBrand(brand.org);
                          setSelectedInvitation(brand.invite);

                          setIsInviteDialogOpen(true);
                        }}
                        key={brand.org.id}
                        className="relative hover:cursor-pointer border-[1px] border-orange-500/[0.5] hover:border-orange-500 bg-gradient-to-br from-orange-300/[0.1] to-orange-300/[0.05] group w-full h-[200px] hover:shadow-md flex items-center justify-center overflow-hidden rounded-lg"
                      >
                        <InvitationBrandCard brand={brand.org as BrandType} />
                      </Card>
                    ))}

                  {filteredBrands
                    .filter(
                      (brand) =>
                        !userInvitationOrgs.some(
                          (invitedBrand) => invitedBrand.org.id === brand.id
                        )
                    )
                    .sort((a, b) => a.name.localeCompare(b.name))
                    .sort(
                      (a, b) =>
                        (b.publicMetadata.verified ? 1 : 0) -
                        (a.publicMetadata.verified ? 1 : 0)
                    )
                    .map((brand) => (
                      <Card
                        onClick={() => {
                          // If the user is a part of no organization and the organization is unverified -> Open the brand dialog to process payment
                          if (!brand.publicMetadata.verified) {
                            setSelectedBrand(brand);
                            setIsBrandDialogOpen(true);
                          }
                          // If the user is a part of no organization and the organization is verified -> Open the request to join dialog.

                          if (brand.publicMetadata.verified) {
                            setSelectedBrand(brand);
                            setIsRequestToJoin(true);
                          }
                        }}
                        key={brand.id}
                        className="relative hover:cursor-pointer group w-full h-[200px] hover:shadow-md flex items-center justify-center overflow-hidden rounded-lg"
                      >
                        <BrandCard brand={brand} />
                      </Card>
                    ))}
                </>
              )}

              <ClickToVerifyDialog
                isOpen={isBrandDialogOpen}
                setIsOpen={setIsBrandDialogOpen}
                selectedBrand={selectedBrand}
              />

              <ClickToRequestJoiningDialog
                isOpen={isRequestToJoin}
                setIsOpen={setIsRequestToJoin}
                selectedBrand={selectedBrand}
              />

              <ClickToJoinDialog
                isOpen={isInviteDialogOpen}
                setIsOpen={setIsInviteDialogOpen}
                selectedBrand={selectedInviteBrand}
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

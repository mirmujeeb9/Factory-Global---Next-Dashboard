"use server";
import { BrandType } from "@/app/join/brand/page";
import { SupplierType } from "@/app/join/supplier/page";
import {
  CreateParams,
  DetailedBrand,
  GetOrganizationListParams,
} from "@/lib/types";
import { auth, clerkClient } from "@clerk/nextjs/server";

export async function createBrand(params: CreateParams) {
  // Sanitize the input parameters by replacing '&' with 'and' in name and slug
  const sanitizedParams = {
    ...params,
    name: params.name.replace(/&/g, "and"),
    slug: params.slug?.replace(/&/g, "and"),
    createdBy: auth().userId as string, // Add the userId of the creator
  };

  console.log(sanitizedParams); // Log the sanitized parameters for debugging

  // Create a new organization with the sanitized parameters
  await clerkClient.organizations.createOrganization(
    sanitizedParams
  );
}

export async function createSupplier(params: CreateParams) {
  await clerkClient.organizations.createOrganization({
    ...params,
    createdBy: auth().userId as string,
  });
}

export async function getAllBrandOrganizations(
  params: GetOrganizationListParams
) {
  let orgs = (await clerkClient.organizations.getOrganizationList())
    .data as BrandType[];
  const { userId } = auth();

  orgs = orgs.filter((eachBrand) => {
    if (eachBrand.publicMetadata.verified) return true;
    if (!eachBrand.publicMetadata.verified && eachBrand.createdBy === userId)
      return true;

    return false;
  });

  orgs = orgs.filter((eachOrg) => eachOrg.publicMetadata.type === "brand");
  orgs = JSON.parse(JSON.stringify(orgs));

  return orgs;
}

export async function getAllSupplierOrganizations(
  params: GetOrganizationListParams
) {
  let orgs = (await clerkClient.organizations.getOrganizationList())
    .data as SupplierType[];
  const { userId } = auth();

  orgs = orgs.filter((eachBrand) => {
    if (eachBrand.publicMetadata.verified) return true;
    if (!eachBrand.publicMetadata.verified && eachBrand.createdBy === userId)
      return true;

    return false;
  });

  orgs = orgs.filter((eachOrg) => eachOrg.publicMetadata.type === "supplier");
  orgs = JSON.parse(JSON.stringify(orgs));

  return orgs;
}

export async function getSingleOrganization(orgId: string) {
  let org = await clerkClient.organizations.getOrganization({
    organizationId: orgId,
  });

  org = JSON.parse(JSON.stringify(org));

  return org;
}

export const fetchBrand = async (brandId: string) => {
  try {
    const response = await fetch(
      `https://api.brandfetch.io/v2/brands/${brandId}`,
      {
        method: "GET",
        headers: {
          Referer: "https://example.com/searchIntegrationPage",
          Authorization: `Bearer ${process.env.BRAND_FETCH_TOKEN}`,
          accept: "application/json",
        },
      }
    );
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const data: DetailedBrand = await response.json();

    return data as DetailedBrand;
  } catch (error) {
    console.error("Failed to fetch brands:", error);
  }
};

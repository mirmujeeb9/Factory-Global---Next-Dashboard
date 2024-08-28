import { auth, clerkClient } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

/**
 * GET /api/verification_handler
 *
 * This route is triggered after a successful payment for organization verification.
 * It performs the following actions:
 * 1. Extracts query parameters from the request URL.
 * 2. Logs the organizationId, userId, and organizationName for debugging purposes.
 * 3. Verifies the organization based on the provided information.
 * 4. Redirects the user to the success page upon successful verification.
 *
 * @param {Request} request - The incoming request object.
 * @returns {NextResponse} - A redirect response to the success page.
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  const success = searchParams.get("success");
  const userId_from_params = searchParams.get("userId");
  const type = searchParams.get("type");

  let organizationId, organizationName;

  console.log(type);

  if (type === "brand") {
    organizationId = searchParams.get("brandId");
    organizationName = searchParams.get("brandName");
  } else if (type === "supplier") {
    organizationId = searchParams.get("supplierId");
    organizationName = searchParams.get("supplierName");
  } else {
    console.error("Invalid type in query parameters");
    return NextResponse.json(
      { message: "Invalid type in query parameters", ok: false },
      { status: 400 }
    );
  }

  const { userId } = auth();
  const user = await clerkClient.users.getUser(userId as string);

  const old_org = await clerkClient.organizations.getOrganization({
    organizationId: organizationId as string,
  });

  const publicMetadata: {
    website: unknown;
    description: unknown;
    verified: boolean;
    adminEmail: string | undefined;
    type: unknown;
    brandFetch?: unknown;
  } = {
    website: old_org.publicMetadata?.website,
    description: old_org.publicMetadata?.description,
    verified: true,
    adminEmail: user.primaryEmailAddress?.emailAddress,
    type: old_org?.publicMetadata?.type,
  };

  if (type === "brand") {
    publicMetadata.brandFetch = old_org?.publicMetadata?.brandFetch;
  }

  const updated_org = await clerkClient.organizations.updateOrganization(
    organizationId as string,
    { publicMetadata }
  );

  const url = new URL(request.url);
  const baseUrl = `${url.protocol}//${url.host}`;

  console.log(`New URL: ${baseUrl}/dashboard?orgId=${organizationId}`);

  // Check if the userId matches the current user. Redirect them to the main dashboard.
  if (userId == userId_from_params) {
    await clerkClient;
    // Authorize the user and redirect to the main page.
    return NextResponse.redirect(
      `${baseUrl}/dashboard?orgId=${organizationId}`,
      {
        status: 307,
      }
    );
  }

  // Remove the 'success' param from searchParams
  searchParams.delete("success");

  // After failing to verify the organization, redirect to failed page with search params.
  return NextResponse.redirect(
    `${baseUrl}/join/${type}?failed=true&orgId=${organizationId}&${searchParams}`,
    {
      status: 307,
    }
  );
}

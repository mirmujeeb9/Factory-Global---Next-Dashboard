import { auth, clerkClient } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

/**
 * GET /api/verify_supplier_purchase
 *
 * This route is triggered after a successful payment for a supplier purchase.
 * It performs the following actions:
 * 1. Extracts query parameters from the request URL.
 * 2. Verifies the user and supplier information.
 * 3. Updates the user's metadata to include the newly purchased supplier.
 * 4. Redirects the user to the dashboard with a success or failure message.
 *
 * @param {Request} request - The incoming request object.
 * @returns {NextResponse} - A redirect response to the dashboard.
 */
export async function GET(request: Request) {
  // Get the handlers
  const { searchParams } = new URL(request.url);
  const { userId } = auth();

  // Extract data
  const success = searchParams.get("success") === "true";
  const userId_from_params = searchParams.get("userId");
  const supplierId = searchParams.get("supplierId");

  // Get private data
  const old_private_metadata = (
    await clerkClient.users.getUser(userId_from_params as string)
  ).privateMetadata;

  // Get baseUrl
  const url = new URL(request.url);
  const baseUrl = `${url.protocol}//${url.host}`;

  if (userId == userId_from_params && success === true) {
    // Ensure purchased_suppliers exists and is an array
    const purchased_suppliers = Array.isArray(
      old_private_metadata.purchased_suppliers
    )
      ? old_private_metadata.purchased_suppliers
      : [];

    // Update the user metadata with the supplierId that has just been purchased.
    await clerkClient.users.updateUserMetadata(userId_from_params as string, {
      privateMetadata: {
        purchased_suppliers: [...purchased_suppliers, supplierId],
      },
    });

    // Authorize the user and redirect to the main page.
    return NextResponse.redirect(
      `${baseUrl}/dashboard/overview/suppliers?successfully_purchased_supplier=true`,
      {
        status: 307,
      }
    );
  }

  // Remove the 'success' param from searchParams
  searchParams.delete("success");

  // After failing to verify the organization, redirect to failed page with search params.
  return NextResponse.redirect(
    `${baseUrl}/dashboard?successfully_purchased_supplier=false`,
    {
      status: 307,
    }
  );
}

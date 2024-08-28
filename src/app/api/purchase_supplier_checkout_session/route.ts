import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

export async function POST(req: NextRequest) {
  try {
    // Create Checkout Sessions from body params.
    const formData = await req.formData();
    const userId = formData.get("userId");

    if (!userId) {
      console.error("Missing userId in form data");
      throw new Error("Invalid form data: Missing userId");
    }

    let id, successUrl, cancelUrl, priceId, supplierId, currentOrganization;

    if (
      formData.has("userId") &&
      formData.has("currentOrganization") &&
      formData.has("supplierId")
    ) {
      supplierId = formData.get("supplierId");
      currentOrganization = formData.get("currentOrganization");
      priceId = "price_1PcSKaHzXhBwvhTHhRX2TqYh";

      successUrl = `${req.headers.get(
        "origin"
      )}/api/verify_supplier_purchase/?success=true&userId=${userId}&supplierId=${supplierId}`;
      cancelUrl = `${req.headers.get("origin")}/dashboard?canceled=true`;
    } else {
      console.error(
        "Missing userId or brandId or supplierId information in form data"
      );
      throw new Error(
        "Invalid form data: Missing user or supplier information"
      );
    }
    console.log("Form data processed:", { successUrl, cancelUrl });

    const session: Stripe.Checkout.Session =
      await stripe.checkout.sessions.create({
        line_items: [
          {
            // Provide the exact Price ID (for example, pr_1234) of the product you want to sell
            price: priceId,
            quantity: 1,
          },
        ],
        metadata: {
          userId,
          supplierId,
          currentOrganization,
        },
        mode: "payment",
        success_url: successUrl,
        cancel_url: cancelUrl,
      });

    console.log("Successfully created checkout session:", session.id);
    return NextResponse.redirect(session.url as string, 303);
  } catch (err) {
    console.error("Error creating checkout session:", err);
    return NextResponse.json(
      { message: "something went wrong", ok: false },
      { status: 500 }
    );
  }
}

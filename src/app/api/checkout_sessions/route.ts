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

    let id, name, successUrl, cancelUrl, priceId, type;

    if (formData.has("brandId") && formData.has("brandName")) {
      id = formData.get("brandId");
      name = formData.get("brandName");
      priceId = "price_1PaH6LHzXhBwvhTHJcsekuAE";
      type = "brand";

      successUrl = `${req.headers.get(
        "origin"
      )}/api/verification_handler/?success=true&brandId=${id}&brandName=${name}&userId=${userId}&type=${type}`;
      cancelUrl = `${req.headers.get(
        "origin"
      )}/join/brand/?canceled=true&type=${type}`;
    } else if (formData.has("supplierId") && formData.has("supplierName")) {
      id = formData.get("supplierId");
      name = formData.get("supplierName");
      priceId = "price_1Pc2E5HzXhBwvhTH3Lb1VFIW";
      type = "supplier";

      successUrl = `${req.headers.get(
        "origin"
      )}/api/verification_handler/?success=true&supplierId=${id}&supplierName=${name}&userId=${userId}&type=${type}`;
      cancelUrl = `${req.headers.get(
        "origin"
      )}/join/supplier/?canceled=true&type=${type}`;
    } else {
      console.error("Missing brand or supplier information in form data");
      throw new Error(
        "Invalid form data: Missing brand or supplier information"
      );
    }
    console.log("Form data processed:", { id, name, successUrl, cancelUrl });

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
          id,
          name,
          userId,
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

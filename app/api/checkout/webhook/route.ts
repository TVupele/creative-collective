import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { markOrderPaidByReference } from "@/lib/order-fulfillment";

// Paystack webhook — this is the source of truth for marking an order paid.
// The confirmation page also verifies on return for immediate UI feedback,
// but this endpoint is what you can rely on even if the buyer closes their
// browser before being redirected back.
export async function POST(req: NextRequest) {
  const secret = process.env.PAYSTACK_SECRET_KEY;
  if (!secret) {
    console.error("PAYSTACK_SECRET_KEY not set — cannot verify webhook signature.");
    return NextResponse.json({ error: "Not configured." }, { status: 500 });
  }

  const rawBody = await req.text();
  const signature = req.headers.get("x-paystack-signature");

  const expectedSignature = crypto
    .createHmac("sha512", secret)
    .update(rawBody)
    .digest("hex");

  if (signature !== expectedSignature) {
    console.error("Paystack webhook signature mismatch — rejecting.");
    return NextResponse.json({ error: "Invalid signature." }, { status: 401 });
  }

  let event: { event?: string; data?: { reference?: string } };
  try {
    event = JSON.parse(rawBody);
  } catch {
    return NextResponse.json({ error: "Invalid payload." }, { status: 400 });
  }

  if (event.event === "charge.success" && event.data?.reference) {
    await markOrderPaidByReference(event.data.reference);
  }

  // Paystack expects a 200 quickly, regardless of what the event was.
  return NextResponse.json({ received: true });
}

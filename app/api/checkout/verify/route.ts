import { NextRequest, NextResponse } from "next/server";
import { verifyTransaction } from "@/lib/paystack";
import { markOrderPaidByReference } from "@/lib/order-fulfillment";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const reference = req.nextUrl.searchParams.get("reference");
  if (!reference) {
    return NextResponse.json({ error: "Missing reference." }, { status: 400 });
  }

  const order = await prisma.order.findUnique({ where: { paystackReference: reference } });
  if (!order) {
    return NextResponse.json({ error: "Order not found." }, { status: 404 });
  }

  // Already confirmed (likely by the webhook already) — nothing more to do.
  if (order.status === "PAID" || order.status === "FULFILLED") {
    return NextResponse.json({ status: order.status, orderId: order.id });
  }

  try {
    const result = await verifyTransaction(reference);
    if (result.status === "success") {
      const updated = await markOrderPaidByReference(reference);
      return NextResponse.json({ status: updated?.status ?? "PAID", orderId: order.id });
    }
    return NextResponse.json({ status: "PENDING", orderId: order.id });
  } catch (err) {
    console.error("Verify failed:", err);
    return NextResponse.json({ error: "Couldn't verify payment right now." }, { status: 502 });
  }
}

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { initializeTransaction } from "@/lib/paystack";
import { randomUUID } from "crypto";

interface CartItemInput {
  productId: string;
  quantity: number;
}

export async function POST(req: NextRequest) {
  let body: {
    buyerName?: string;
    buyerEmail?: string;
    buyerPhone?: string;
    shippingAddress?: string;
    items?: CartItemInput[];
  };

  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const { buyerName, buyerEmail, buyerPhone, shippingAddress, items } = body;

  if (!buyerName || !buyerEmail || !buyerPhone || !shippingAddress) {
    return NextResponse.json(
      { error: "Name, email, phone and shipping address are all required." },
      { status: 400 }
    );
  }

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailPattern.test(buyerEmail)) {
    return NextResponse.json({ error: "Enter a valid email address." }, { status: 400 });
  }

  if (!items || items.length === 0) {
    return NextResponse.json({ error: "Your cart is empty." }, { status: 400 });
  }

  // Never trust prices or availability from the client — re-fetch from the
  // database and validate every item server-side.
  const productIds = items.map((i) => i.productId);
  const products = await prisma.product.findMany({
    where: { id: { in: productIds } },
  });

  const commissionPercent = Number(process.env.COMMISSION_PERCENT ?? 20);

  let totalAmount = 0;
  const orderItemsData: {
    productId: string;
    quantity: number;
    unitPrice: number;
    memberName: string;
    memberContact: string;
    commissionPercent: number;
    payoutAmount: number;
  }[] = [];

  for (const requested of items) {
    const product = products.find((p) => p.id === requested.productId);

    if (!product || product.status !== "ACTIVE") {
      return NextResponse.json(
        { error: `An item in your cart is no longer available.` },
        { status: 409 }
      );
    }
    if (requested.quantity < 1 || requested.quantity > product.stock) {
      return NextResponse.json(
        { error: `Only ${product.stock} of "${product.title}" left in stock.` },
        { status: 409 }
      );
    }

    const lineTotal = product.price * requested.quantity;
    totalAmount += lineTotal;

    const payoutAmount = Math.round((lineTotal * (100 - commissionPercent)) / 100);

    orderItemsData.push({
      productId: product.id,
      quantity: requested.quantity,
      unitPrice: product.price,
      memberName: product.memberName,
      memberContact: product.memberContact,
      commissionPercent,
      payoutAmount,
    });
  }

  const reference = `cc_${randomUUID()}`;

  try {
    const order = await prisma.order.create({
      data: {
        buyerName,
        buyerEmail,
        buyerPhone,
        shippingAddress,
        totalAmount,
        paystackReference: reference,
        status: "PENDING",
        items: { create: orderItemsData },
      },
    });

    const origin = req.nextUrl.origin;
    const paystack = await initializeTransaction({
      email: buyerEmail,
      amountKobo: totalAmount,
      reference,
      callbackUrl: `${origin}/order/${order.id}`,
      metadata: { orderId: order.id },
    });

    return NextResponse.json({ authorizationUrl: paystack.authorization_url });
  } catch (err) {
    console.error("Checkout initialization failed:", err);
    return NextResponse.json(
      {
        error:
          err instanceof Error
            ? err.message
            : "We couldn't start checkout right now. Please try again.",
      },
      { status: 502 }
    );
  }
}

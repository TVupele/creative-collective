import { prisma } from "@/lib/prisma";

/**
 * Marks an order paid and decrements stock for each item, exactly once.
 * Safe to call multiple times for the same reference (from both the
 * webhook and the return-URL verification) — if the order is already
 * PAID, this is a no-op.
 */
export async function markOrderPaidByReference(reference: string) {
  const order = await prisma.order.findUnique({
    where: { paystackReference: reference },
    include: { items: true },
  });

  if (!order) {
    console.error(`No order found for Paystack reference ${reference}`);
    return null;
  }

  if (order.status === "PAID" || order.status === "FULFILLED") {
    return order; // already processed
  }

  const updated = await prisma.$transaction(async (tx) => {
    const result = await tx.order.update({
      where: { id: order.id },
      data: { status: "PAID" },
      include: { items: true },
    });

    for (const item of order.items) {
      await tx.product.update({
        where: { id: item.productId },
        data: { stock: { decrement: item.quantity } },
      });
    }

    return result;
  });

  return updated;
}

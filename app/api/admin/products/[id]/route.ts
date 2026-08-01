import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/require-admin";
import { nairaToKobo } from "@/lib/money";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { unauthorized } = await requireAdmin();
  if (unauthorized) return unauthorized;

  const { id } = await params;
  const product = await prisma.product.findUnique({ where: { id } });
  if (!product) {
    return NextResponse.json({ error: "Product not found." }, { status: 404 });
  }
  return NextResponse.json({ product });
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { unauthorized } = await requireAdmin();
  if (unauthorized) return unauthorized;

  const { id } = await params;

  let data: Record<string, unknown>;
  try {
    data = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const updateData: Record<string, unknown> = { ...data };
  if (typeof data.priceNaira === "number") {
    updateData.price = nairaToKobo(data.priceNaira);
    delete updateData.priceNaira;
  }

  try {
    const product = await prisma.product.update({
      where: { id },
      data: updateData,
    });
    return NextResponse.json({ product });
  } catch (err) {
    console.error("Failed to update product:", err);
    return NextResponse.json({ error: "Couldn't update the product." }, { status: 502 });
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { unauthorized } = await requireAdmin();
  if (unauthorized) return unauthorized;

  const { id } = await params;

  try {
    await prisma.product.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Failed to delete product:", err);
    return NextResponse.json({ error: "Couldn't delete the product." }, { status: 502 });
  }
}

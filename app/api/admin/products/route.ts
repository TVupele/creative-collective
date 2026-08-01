import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/require-admin";
import { nairaToKobo } from "@/lib/money";

export async function GET() {
  const { unauthorized } = await requireAdmin();
  if (unauthorized) return unauthorized;

  const products = await prisma.product.findMany({
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json({ products });
}

export async function POST(req: NextRequest) {
  const { unauthorized } = await requireAdmin();
  if (unauthorized) return unauthorized;

  let data: {
    title?: string;
    description?: string;
    priceNaira?: number;
    images?: string[];
    category?: string;
    stock?: number;
    memberName?: string;
    memberContact?: string;
    memberBankName?: string;
    memberAccountNumber?: string;
    memberAccountName?: string;
    status?: "DRAFT" | "ACTIVE";
  };

  try {
    data = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const {
    title,
    description,
    priceNaira,
    images,
    category,
    stock,
    memberName,
    memberContact,
    memberBankName,
    memberAccountNumber,
    memberAccountName,
    status,
  } = data;

  if (!title || !description || !priceNaira || !category || !memberName || !memberContact) {
    return NextResponse.json(
      {
        error:
          "Title, description, price, category, member name and member contact are required.",
      },
      { status: 400 }
    );
  }

  if (priceNaira <= 0) {
    return NextResponse.json({ error: "Price must be greater than zero." }, { status: 400 });
  }

  try {
    const product = await prisma.product.create({
      data: {
        title,
        description,
        price: nairaToKobo(priceNaira),
        images: images ?? [],
        category,
        stock: stock ?? 1,
        memberName,
        memberContact,
        memberBankName: memberBankName || null,
        memberAccountNumber: memberAccountNumber || null,
        memberAccountName: memberAccountName || null,
        status: status ?? "DRAFT",
      },
    });
    return NextResponse.json({ product });
  } catch (err) {
    console.error("Failed to create product:", err);
    return NextResponse.json({ error: "Couldn't save the product." }, { status: 502 });
  }
}

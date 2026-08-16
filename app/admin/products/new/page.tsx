import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import ProductForm from "@/components/ProductForm";

export const dynamic = "force-dynamic";

export default async function NewProductPage({
  searchParams,
}: {
  searchParams: Promise<{ collection?: string }>;
}) {
  const session = await auth();
  if (!session?.user) redirect("/admin/login");

  const { collection } = await searchParams;

  // Offer the categories already in use, so spelling stays consistent.
  const categoryRows = await prisma.product.findMany({
    select: { category: true },
    distinct: ["category"],
  });

  return (
    <main className="min-h-dvh bg-ink px-5 py-12 text-parchment sm:px-6 sm:py-16">
      <div className="mx-auto max-w-3xl">
        <Link
          href="/admin/products"
          className="text-xs uppercase tracking-widest text-parchment/60 hover:text-parchment"
        >
          &larr; Products
        </Link>
        <h1 className="mt-2 text-2xl font-bold">New product</h1>
        <p className="mt-1 text-sm text-parchment/60">
          Upload a piece on behalf of a member and place it in the right shop section.
        </p>
        <ProductForm
          knownCategories={categoryRows.map((c) => c.category)}
          initialValues={collection ? { collection } : undefined}
        />
      </div>
    </main>
  );
}

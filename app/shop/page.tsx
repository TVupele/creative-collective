import { Suspense } from "react";
import { prisma } from "@/lib/prisma";
import ProductCard from "@/components/ProductCard";
import ShopFilters from "@/components/ShopFilters";
import Link from "next/link";

export const dynamic = "force-dynamic";

async function ShopResults({
  q,
  category,
}: {
  q?: string;
  category?: string;
}) {
  const [products, categoryRows] = await Promise.all([
    prisma.product.findMany({
      where: {
        status: "ACTIVE",
        ...(category ? { category } : {}),
        ...(q
          ? {
              OR: [
                { title: { contains: q, mode: "insensitive" } },
                { memberName: { contains: q, mode: "insensitive" } },
                { description: { contains: q, mode: "insensitive" } },
              ],
            }
          : {}),
      },
      orderBy: { createdAt: "desc" },
    }),
    prisma.product.findMany({
      where: { status: "ACTIVE" },
      select: { category: true },
      distinct: ["category"],
    }),
  ]);

  const categories = categoryRows.map((c) => c.category).sort();

  return (
    <>
      <ShopFilters categories={categories} />

      {products.length === 0 ? (
        <p className="mt-16 text-center text-ink/50">
          Nothing matches yet — try a different search or category.
        </p>
      ) : (
        <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </>
  );
}

export default async function ShopPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; category?: string }>;
}) {
  const params = await searchParams;

  return (
    <main className="min-h-dvh bg-parchment px-6 py-12">
      <div className="mx-auto max-w-6xl">
        <Link
          href="/"
          className="text-xs uppercase tracking-widest text-ink/50 hover:text-ink"
        >
          &larr; Creative Collective
        </Link>
        <h1 className="mt-2 font-display text-3xl font-bold text-ink">Shop</h1>
        <p className="mt-2 text-ink/70">
          Original work from creatives across Africa and the Diaspora, ahead of FESTAC@50.
        </p>

        <div className="mt-8">
          <Suspense fallback={<p className="text-ink/50">Loading...</p>}>
            <ShopResults q={params.q} category={params.category} />
          </Suspense>
        </div>
      </div>
    </main>
  );
}

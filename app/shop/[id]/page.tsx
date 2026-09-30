import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { formatNaira } from "@/lib/money";
import AddToCartButton from "@/components/AddToCartButton";
import ProductGallery from "@/components/ProductGallery";
import ProductCard from "@/components/ProductCard";
import ShopNav from "@/components/ShopNav";
import { getCollection } from "@/lib/collections";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const product = await prisma.product.findUnique({ where: { id } });
  if (!product) return { title: "Piece not found — Creative Collective" };

  return {
    title: `${product.title} — Creative Collective`,
    description: product.description.slice(0, 160),
    openGraph: {
      title: product.title,
      description: product.description.slice(0, 160),
      images: product.images[0] ? [product.images[0]] : undefined,
    },
  };
}

function initials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = await prisma.product.findUnique({ where: { id } });

  if (!product || product.status !== "ACTIVE") notFound();

  const related = await prisma.product.findMany({
    where: { status: "ACTIVE", category: product.category, id: { not: product.id } },
    orderBy: { createdAt: "desc" },
    take: 4,
  });

  const productCollection = getCollection(product.collection);
  const soldOut = product.stock <= 0;
  const lowStock = !soldOut && product.stock <= 3;
  const listedOn = new Date(product.createdAt).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });

  return (
    <div className="min-h-dvh bg-parchment font-body text-ink">
      <ShopNav />

      <main className="mx-auto max-w-6xl px-5 pb-24 pt-6">
        <nav className="flex items-center gap-2 text-xs text-ink/45" aria-label="Breadcrumb">
          <Link href="/shop" className="transition hover:text-ink">
            Shop
          </Link>
          <span aria-hidden>/</span>
          <Link
            href={`/shop/products?category=${encodeURIComponent(product.category)}`}
            className="transition hover:text-ink"
          >
            {product.category}
          </Link>
          <span aria-hidden>/</span>
          <span className="truncate text-ink/70">{product.title}</span>
        </nav>

        <div className="mt-6 grid gap-10 lg:grid-cols-2 lg:gap-14">
          <ProductGallery images={product.images} title={product.title} />

          <div className="animate-fade-up">
            <div className="flex flex-wrap items-center gap-2">
              <Link
                href={`/shop/products?category=${encodeURIComponent(product.category)}&scope=all#general`}
                className="pill-tag transition hover:bg-ink/10"
              >
                {product.category}
              </Link>
              {productCollection && (
                <Link
                  href={`/shop/collection/${productCollection.slug}`}
                  className="pill bg-amber/20 px-3 py-1 text-[0.65rem] font-bold uppercase tracking-[0.14em] text-goldDeep transition hover:bg-amber/35"
                >
                  {productCollection.name}
                </Link>
              )}
              {soldOut ? (
                <span className="pill bg-ink/[0.06] px-3 py-1 text-[0.65rem] font-bold uppercase tracking-[0.14em] text-ink/50">
                  Sold out
                </span>
              ) : lowStock ? (
                <span className="pill bg-clay/12 px-3 py-1 text-[0.65rem] font-bold uppercase tracking-[0.14em] text-clay">
                  Only {product.stock} left
                </span>
              ) : (
                <span className="pill bg-sage/12 px-3 py-1 text-[0.65rem] font-bold uppercase tracking-[0.14em] text-sage">
                  In stock
                </span>
              )}
            </div>

            <h1 className="mt-4 font-display text-3xl font-bold leading-tight tracking-tight text-ink sm:text-4xl">
              {product.title}
            </h1>

            <p className="mt-4 font-display text-3xl font-bold text-ink">
              {formatNaira(product.price)}
            </p>
            <p className="mt-1 text-xs text-ink/45">
              Price in Nigerian Naira &middot; taxes included
            </p>

            <div className="mt-6 flex items-center gap-3 rounded-4xl border border-ink/[0.07] bg-bone p-3 shadow-soft">
              <span className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-amber to-clay font-display text-sm font-bold text-parchment">
                {initials(product.memberName)}
              </span>
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-ink">
                  {product.memberName}
                </p>
                <p className="text-xs text-ink/50">
                  Collective member &middot; listed {listedOn}
                </p>
              </div>
            </div>

            <div className="mt-8">
              <AddToCartButton
                product={{
                  id: product.id,
                  title: product.title,
                  price: product.price,
                  images: product.images,
                  stock: product.stock,
                }}
              />
            </div>

            <div className="mt-8">
              <h2 className="text-xs font-bold uppercase tracking-[0.16em] text-ink/45">
                About this piece
              </h2>
              <p className="mt-3 whitespace-pre-line leading-relaxed text-ink/75">
                {product.description}
              </p>
            </div>

            <ul className="mt-8 grid gap-2 sm:grid-cols-3">
              <Assurance title="Secure payment" body="Cards, transfer & USSD via Paystack" />
              <Assurance title="Nationwide delivery" body="Arranged after your order is confirmed" />
              <Assurance title="Direct support" body="Most of every sale reaches the maker" />
            </ul>
          </div>
        </div>

        {related.length > 0 && (
          <section className="mt-20">
            <div className="flex items-end justify-between gap-4">
              <div>
                <h2 className="font-display text-2xl font-bold tracking-tight text-ink">
                  More in {product.category}
                </h2>
                <p className="mt-1 text-sm text-ink/55">
                  Other pieces the collective has listed in this category.
                </p>
              </div>
              <Link
                href={`/shop/products?category=${encodeURIComponent(product.category)}`}
                className="pill-ghost hidden px-5 py-2.5 text-xs sm:inline-flex"
              >
                See all
              </Link>
            </div>

            <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {related.map((item) => (
                <ProductCard key={item.id} product={item} />
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  );
}

function Assurance({ title, body }: { title: string; body: string }) {
  return (
    <li className="rounded-3xl border border-ink/[0.07] bg-bone/70 px-4 py-3">
      <p className="text-xs font-bold text-ink">{title}</p>
      <p className="mt-0.5 text-xs leading-relaxed text-ink/50">{body}</p>
    </li>
  );
}

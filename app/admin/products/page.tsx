import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { formatNaira } from "@/lib/money";
import { COLLECTIONS, collectionName } from "@/lib/collections";
import Link from "next/link";
import Image from "next/image";
import type { Prisma } from "@/prisma/generated/prisma/client";

export const dynamic = "force-dynamic";

export default async function AdminProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ collection?: string; status?: string; q?: string }>;
}) {
  const session = await auth();
  if (!session?.user) redirect("/admin/login");

  const sp = await searchParams;
  const statusFilter =
    sp.status === "ACTIVE" || sp.status === "DRAFT" || sp.status === "ARCHIVED"
      ? sp.status
      : undefined;

  const collectionFilter =
    sp.collection === "general"
      ? null
      : COLLECTIONS.some((c) => c.slug === sp.collection)
        ? sp.collection
        : undefined;

  const where: Prisma.ProductWhereInput = {
    ...(statusFilter ? { status: statusFilter } : {}),
    ...(collectionFilter !== undefined ? { collection: collectionFilter } : {}),
    ...(sp.q
      ? {
          OR: [
            { title: { contains: sp.q, mode: "insensitive" } },
            { memberName: { contains: sp.q, mode: "insensitive" } },
            { category: { contains: sp.q, mode: "insensitive" } },
          ],
        }
      : {}),
  };

  const [products, all] = await Promise.all([
    prisma.product.findMany({ where, orderBy: { createdAt: "desc" } }),
    prisma.product.findMany({ select: { collection: true, status: true } }),
  ]);

  const countFor = (slug: string | null) =>
    all.filter((p) => p.collection === slug).length;

  const buildHref = (patch: Record<string, string | undefined>) => {
    const qs = new URLSearchParams();
    const merged = { collection: sp.collection, status: sp.status, q: sp.q, ...patch };
    for (const [k, v] of Object.entries(merged)) if (v) qs.set(k, v);
    const s = qs.toString();
    return `/admin/products${s ? `?${s}` : ""}`;
  };

  return (
    <main className="min-h-dvh bg-ink px-5 py-12 text-parchment sm:px-6 sm:py-16">
      <div className="mx-auto max-w-5xl">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <Link
              href="/admin/dashboard"
              className="text-xs uppercase tracking-widest text-parchment/60 hover:text-parchment"
            >
              &larr; Dashboard
            </Link>
            <h1 className="mt-2 text-2xl font-bold">Products</h1>
            <p className="mt-1 text-sm text-parchment/60">
              {all.length} total &middot; {all.filter((p) => p.status === "ACTIVE").length} live
            </p>
          </div>
          <Link
            href="/admin/products/new"
            className="rounded-full bg-amber px-6 py-3 text-sm font-semibold text-ink shadow-glow transition hover:bg-gold"
          >
            + New product
          </Link>
        </div>

        {/* Search */}
        <form action="/admin/products" className="mt-8 flex gap-2">
          {sp.collection && <input type="hidden" name="collection" value={sp.collection} />}
          {sp.status && <input type="hidden" name="status" value={sp.status} />}
          <input
            name="q"
            defaultValue={sp.q ?? ""}
            placeholder="Search title, member or category..."
            className="w-full rounded-full border border-parchment/20 bg-white/5 px-5 py-2.5 text-sm text-parchment outline-none placeholder:text-parchment/35 focus:border-amber"
          />
          <button className="flex-shrink-0 rounded-full border border-parchment/20 px-5 py-2.5 text-sm font-semibold transition hover:bg-white/5">
            Search
          </button>
        </form>

        {/* Collection filter */}
        <div className="mt-4 flex flex-wrap gap-2">
          <FilterPill href={buildHref({ collection: undefined })} active={!sp.collection}>
            All sections ({all.length})
          </FilterPill>
          <FilterPill
            href={buildHref({ collection: "general" })}
            active={sp.collection === "general"}
          >
            General ({countFor(null)})
          </FilterPill>
          {COLLECTIONS.map((c) => (
            <FilterPill
              key={c.slug}
              href={buildHref({ collection: c.slug })}
              active={sp.collection === c.slug}
            >
              {c.name} ({countFor(c.slug)})
            </FilterPill>
          ))}
        </div>

        {/* Status filter */}
        <div className="mt-3 flex flex-wrap gap-2">
          <FilterPill href={buildHref({ status: undefined })} active={!sp.status} subtle>
            Any status
          </FilterPill>
          {(["ACTIVE", "DRAFT", "ARCHIVED"] as const).map((s) => (
            <FilterPill
              key={s}
              href={buildHref({ status: s })}
              active={sp.status === s}
              subtle
            >
              {s} ({all.filter((p) => p.status === s).length})
            </FilterPill>
          ))}
        </div>

        {products.length === 0 ? (
          <div className="mt-10 rounded-3xl border border-parchment/15 bg-white/5 p-10 text-center">
            <p className="text-sm text-parchment/70">
              {all.length === 0
                ? "No products yet. Click “New product” to list the first item from a member."
                : "Nothing matches these filters."}
            </p>
            {all.length > 0 && (
              <Link
                href="/admin/products"
                className="mt-4 inline-block text-sm text-amber hover:underline"
              >
                Clear filters
              </Link>
            )}
          </div>
        ) : (
          <ul className="mt-8 space-y-3">
            {products.map((p) => (
              <li
                key={p.id}
                className="flex flex-wrap items-center gap-4 rounded-2xl border border-parchment/15 bg-white/5 p-3 transition hover:border-parchment/30 sm:p-4"
              >
                <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-xl bg-white/10">
                  {p.images[0] ? (
                    <Image
                      src={p.images[0]}
                      alt=""
                      fill
                      className="object-cover"
                      sizes="64px"
                    />
                  ) : (
                    <span className="flex h-full items-center justify-center text-[0.6rem] text-parchment/40">
                      No photo
                    </span>
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  <p className="truncate font-semibold">{p.title}</p>
                  <p className="mt-0.5 truncate text-sm text-parchment/60">
                    {formatNaira(p.price)} &middot; {p.memberName} &middot; stock {p.stock}
                  </p>
                  <div className="mt-1.5 flex flex-wrap gap-1.5">
                    <span className="rounded-full bg-white/10 px-2 py-0.5 text-[0.65rem] text-parchment/70">
                      {p.category}
                    </span>
                    <span
                      className={`rounded-full px-2 py-0.5 text-[0.65rem] ${
                        p.collection
                          ? "bg-amber/20 text-amber"
                          : "bg-white/5 text-parchment/50"
                      }`}
                    >
                      {collectionName(p.collection) ?? "General"}
                    </span>
                  </div>
                </div>

                <span
                  className={`flex-shrink-0 rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide ${
                    p.status === "ACTIVE"
                      ? "bg-green-500/20 text-green-300"
                      : p.status === "DRAFT"
                        ? "bg-white/10 text-parchment/60"
                        : "bg-clay/20 text-clay"
                  }`}
                >
                  {p.status}
                </span>

                <Link
                  href={`/admin/products/${p.id}/edit`}
                  className="flex-shrink-0 rounded-full border border-parchment/20 px-5 py-2 text-sm transition hover:bg-white/5"
                >
                  Edit
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </main>
  );
}

function FilterPill({
  href,
  active,
  subtle,
  children,
}: {
  href: string;
  active: boolean;
  subtle?: boolean;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className={`rounded-full px-3.5 py-1.5 text-xs font-semibold transition ${
        active
          ? "bg-amber text-ink"
          : subtle
            ? "border border-parchment/15 text-parchment/50 hover:bg-white/5"
            : "border border-parchment/20 text-parchment/70 hover:bg-white/5"
      }`}
    >
      {children}
    </Link>
  );
}

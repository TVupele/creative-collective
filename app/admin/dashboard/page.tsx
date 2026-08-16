import { auth, signOut } from "@/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/prisma";
import { formatNaira } from "@/lib/money";
import { COLLECTIONS, collectionName } from "@/lib/collections";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const session = await auth();
  if (!session?.user) redirect("/admin/login");

  const commissionPercent = Number(process.env.COMMISSION_PERCENT ?? 30);

  const [products, orders, recentOrders, pendingPayouts] = await Promise.all([
    prisma.product.findMany({
      select: {
        id: true,
        title: true,
        status: true,
        stock: true,
        collection: true,
        images: true,
        price: true,
        memberName: true,
        createdAt: true,
      },
      orderBy: { createdAt: "desc" },
    }),
    prisma.order.findMany({ select: { status: true, totalAmount: true } }),
    prisma.order.findMany({
      orderBy: { createdAt: "desc" },
      take: 6,
      include: { items: true },
    }),
    prisma.orderItem.aggregate({
      where: { payoutStatus: "PENDING", order: { status: { in: ["PAID", "FULFILLED"] } } },
      _sum: { payoutAmount: true },
      _count: { _all: true },
    }),
  ]);

  const live = products.filter((p) => p.status === "ACTIVE");
  const drafts = products.filter((p) => p.status === "DRAFT");
  const paidOrders = orders.filter((o) => o.status === "PAID" || o.status === "FULFILLED");
  const revenue = paidOrders.reduce((sum, o) => sum + o.totalAmount, 0);
  const outOfStock = live.filter((p) => p.stock <= 0);
  const lowStock = live.filter((p) => p.stock > 0 && p.stock <= 3);
  const uncollected = products.filter((p) => !p.collection);

  return (
    <main className="min-h-dvh bg-ink px-5 py-10 text-parchment sm:px-6 sm:py-14">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-widest text-parchment/50">
              Admin dashboard
            </p>
            <h1 className="mt-1 text-2xl font-bold sm:text-3xl">
              Welcome, {session.user.name}
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/shop"
              target="_blank"
              className="rounded-full border border-parchment/20 px-4 py-2 text-sm text-parchment/80 transition hover:bg-white/5"
            >
              View shop &rarr;
            </Link>
            <form
              action={async () => {
                "use server";
                await signOut({ redirectTo: "/" });
              }}
            >
              <button
                type="submit"
                className="rounded-full border border-parchment/20 px-4 py-2 text-sm text-parchment/80 transition hover:bg-white/5"
              >
                Sign out
              </button>
            </form>
          </div>
        </div>

        {/* Headline numbers */}
        <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <Stat label="Live products" value={String(live.length)} hint={`${drafts.length} in draft`} />
          <Stat label="Paid orders" value={String(paidOrders.length)} hint={`${orders.length} total`} />
          <Stat label="Revenue" value={formatNaira(revenue)} hint={`${commissionPercent}% commission`} />
          <Stat
            label="Payouts owed"
            value={formatNaira(pendingPayouts._sum.payoutAmount ?? 0)}
            hint={`${pendingPayouts._count._all} line items pending`}
            accent
          />
        </div>

        {/* Attention needed */}
        {(outOfStock.length > 0 || lowStock.length > 0 || drafts.length > 0) && (
          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            {outOfStock.length > 0 && (
              <Alert
                tone="clay"
                title={`${outOfStock.length} sold out`}
                body="Live products with no stock left."
                href="/admin/products?status=ACTIVE"
              />
            )}
            {lowStock.length > 0 && (
              <Alert
                tone="amber"
                title={`${lowStock.length} low on stock`}
                body="Three or fewer remaining."
                href="/admin/products?status=ACTIVE"
              />
            )}
            {drafts.length > 0 && (
              <Alert
                tone="muted"
                title={`${drafts.length} draft${drafts.length === 1 ? "" : "s"}`}
                body="Not visible in the shop yet."
                href="/admin/products?status=DRAFT"
              />
            )}
          </div>
        )}

        {/* Collections at a glance */}
        <section className="mt-10">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold">Shop sections</h2>
            <Link href="/admin/products" className="text-sm text-amber hover:underline">
              Manage all &rarr;
            </Link>
          </div>

          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {COLLECTIONS.map((c) => {
              const items = products.filter((p) => p.collection === c.slug);
              const liveCount = items.filter((p) => p.status === "ACTIVE").length;
              return (
                <div
                  key={c.slug}
                  className="overflow-hidden rounded-2xl border border-parchment/15 bg-white/5"
                >
                  <div className="relative h-24">
                    <Image
                      src={c.image}
                      alt=""
                      fill
                      sizes="(max-width: 640px) 100vw, 25vw"
                      className="object-cover object-top"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-ink to-ink/10" />
                    <p className="absolute bottom-2 left-3 text-sm font-semibold">{c.name}</p>
                  </div>
                  <div className="flex items-center justify-between px-3 py-2.5">
                    <span className="text-xs text-parchment/60">
                      {liveCount} live / {items.length} total
                    </span>
                    <Link
                      href={`/admin/products/new?collection=${c.slug}`}
                      className="rounded-full bg-amber/20 px-2.5 py-1 text-[0.65rem] font-semibold text-amber transition hover:bg-amber hover:text-ink"
                    >
                      + Add
                    </Link>
                  </div>
                </div>
              );
            })}

            <div className="overflow-hidden rounded-2xl border border-parchment/15 bg-white/5">
              <div className="flex h-24 items-end bg-white/5 px-3 pb-2">
                <p className="text-sm font-semibold">General products</p>
              </div>
              <div className="flex items-center justify-between px-3 py-2.5">
                <span className="text-xs text-parchment/60">
                  {uncollected.filter((p) => p.status === "ACTIVE").length} live /{" "}
                  {uncollected.length} total
                </span>
                <Link
                  href="/admin/products/new"
                  className="rounded-full bg-amber/20 px-2.5 py-1 text-[0.65rem] font-semibold text-amber transition hover:bg-amber hover:text-ink"
                >
                  + Add
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Recent activity */}
        <div className="mt-10 grid gap-6 lg:grid-cols-2">
          <section>
            <h2 className="text-lg font-bold">Recent orders</h2>
            {recentOrders.length === 0 ? (
              <p className="mt-4 rounded-2xl border border-parchment/15 bg-white/5 p-6 text-sm text-parchment/60">
                No orders yet. They&apos;ll appear here as soon as the first checkout
                completes.
              </p>
            ) : (
              <ul className="mt-4 space-y-2">
                {recentOrders.map((o) => (
                  <li
                    key={o.id}
                    className="flex items-center justify-between gap-3 rounded-2xl border border-parchment/15 bg-white/5 px-4 py-3"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold">{o.buyerName}</p>
                      <p className="truncate text-xs text-parchment/55">
                        {o.items.length} item{o.items.length === 1 ? "" : "s"} &middot;{" "}
                        {new Date(o.createdAt).toLocaleDateString("en-GB", {
                          day: "numeric",
                          month: "short",
                        })}
                      </p>
                    </div>
                    <div className="flex flex-shrink-0 items-center gap-3">
                      <span className="text-sm font-semibold">
                        {formatNaira(o.totalAmount)}
                      </span>
                      <span
                        className={`rounded-full px-2.5 py-1 text-[0.65rem] font-semibold uppercase ${
                          o.status === "PAID" || o.status === "FULFILLED"
                            ? "bg-green-500/20 text-green-300"
                            : o.status === "PENDING"
                              ? "bg-white/10 text-parchment/60"
                              : "bg-clay/20 text-clay"
                        }`}
                      >
                        {o.status}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </section>

          <section>
            <h2 className="text-lg font-bold">Recently added</h2>
            {products.length === 0 ? (
              <p className="mt-4 rounded-2xl border border-parchment/15 bg-white/5 p-6 text-sm text-parchment/60">
                Nothing listed yet.{" "}
                <Link href="/admin/products/new" className="text-amber hover:underline">
                  Add the first product
                </Link>
                .
              </p>
            ) : (
              <ul className="mt-4 space-y-2">
                {products.slice(0, 6).map((p) => (
                  <li
                    key={p.id}
                    className="flex items-center gap-3 rounded-2xl border border-parchment/15 bg-white/5 px-3 py-2.5"
                  >
                    <div className="relative h-10 w-10 flex-shrink-0 overflow-hidden rounded-lg bg-white/10">
                      {p.images[0] && (
                        <Image
                          src={p.images[0]}
                          alt=""
                          fill
                          className="object-cover"
                          sizes="40px"
                        />
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium">{p.title}</p>
                      <p className="truncate text-xs text-parchment/55">
                        {collectionName(p.collection) ?? "General"} &middot;{" "}
                        {formatNaira(p.price)}
                      </p>
                    </div>
                    <Link
                      href={`/admin/products/${p.id}/edit`}
                      className="flex-shrink-0 text-xs text-amber hover:underline"
                    >
                      Edit
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>
      </div>
    </main>
  );
}

function Stat({
  label,
  value,
  hint,
  accent,
}: {
  label: string;
  value: string;
  hint?: string;
  accent?: boolean;
}) {
  return (
    <div
      className={`rounded-2xl border p-4 ${
        accent ? "border-amber/40 bg-amber/10" : "border-parchment/15 bg-white/5"
      }`}
    >
      <p className="text-xs uppercase tracking-widest text-parchment/50">{label}</p>
      <p className="mt-2 text-2xl font-bold">{value}</p>
      {hint && <p className="mt-1 text-xs text-parchment/50">{hint}</p>}
    </div>
  );
}

function Alert({
  tone,
  title,
  body,
  href,
}: {
  tone: "clay" | "amber" | "muted";
  title: string;
  body: string;
  href: string;
}) {
  const tones = {
    clay: "border-clay/40 bg-clay/10 text-clay",
    amber: "border-amber/40 bg-amber/10 text-amber",
    muted: "border-parchment/15 bg-white/5 text-parchment/70",
  } as const;

  return (
    <Link
      href={href}
      className={`block rounded-2xl border p-4 transition hover:brightness-110 ${tones[tone]}`}
    >
      <p className="text-sm font-bold">{title}</p>
      <p className="mt-0.5 text-xs opacity-80">{body}</p>
    </Link>
  );
}

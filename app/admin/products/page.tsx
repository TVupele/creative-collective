import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { formatNaira } from "@/lib/money";
import Link from "next/link";
import Image from "next/image";

export default async function AdminProductsPage() {
  const session = await auth();
  if (!session?.user) redirect("/admin/login");

  const products = await prisma.product.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <main className="min-h-dvh bg-ink px-6 py-16 text-parchment">
      <div className="mx-auto max-w-3xl">
        <div className="flex items-center justify-between">
          <div>
            <Link
              href="/admin/dashboard"
              className="text-xs uppercase tracking-widest text-parchment/60 hover:text-parchment"
            >
              &larr; Dashboard
            </Link>
            <h1 className="mt-2 text-2xl font-bold">Products</h1>
          </div>
          <Link
            href="/admin/products/new"
            className="rounded-md bg-amber px-5 py-2.5 text-sm font-semibold text-ink shadow-lg transition hover:bg-gold"
          >
            + New product
          </Link>
        </div>

        {products.length === 0 ? (
          <p className="mt-10 text-sm text-parchment/70">
            No products yet. Click &quot;New product&quot; to list the first item from a
            member.
          </p>
        ) : (
          <ul className="mt-8 space-y-3">
            {products.map((p) => (
              <li
                key={p.id}
                className="flex items-center gap-4 rounded-lg border border-parchment/15 bg-white/5 p-4"
              >
                <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-md bg-white/10">
                  {p.images[0] && (
                    <Image
                      src={p.images[0]}
                      alt={p.title}
                      width={64}
                      height={64}
                      className="h-full w-full object-cover"
                    />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-semibold">{p.title}</p>
                  <p className="text-sm text-parchment/60">
                    {formatNaira(p.price)} &middot; by {p.memberName} &middot; stock {p.stock}
                  </p>
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
                  className="flex-shrink-0 rounded-md border border-parchment/20 px-4 py-2 text-sm transition hover:bg-white/5"
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

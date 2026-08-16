import { auth } from "@/auth";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { koboToNaira } from "@/lib/money";
import ProductForm from "@/components/ProductForm";

export const dynamic = "force-dynamic";

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await auth();
  if (!session?.user) redirect("/admin/login");

  const { id } = await params;
  const [product, categoryRows] = await Promise.all([
    prisma.product.findUnique({ where: { id } }),
    prisma.product.findMany({ select: { category: true }, distinct: ["category"] }),
  ]);
  if (!product) notFound();

  return (
    <main className="min-h-dvh bg-ink px-5 py-12 text-parchment sm:px-6 sm:py-16">
      <div className="mx-auto max-w-3xl">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <Link
            href="/admin/products"
            className="text-xs uppercase tracking-widest text-parchment/60 hover:text-parchment"
          >
            &larr; Products
          </Link>
          {product.status === "ACTIVE" && (
            <Link
              href={`/shop/${product.id}`}
              target="_blank"
              className="rounded-full border border-parchment/20 px-4 py-1.5 text-xs text-parchment/70 transition hover:bg-white/5"
            >
              View on shop &rarr;
            </Link>
          )}
        </div>
        <h1 className="mt-2 text-2xl font-bold">Edit product</h1>
        <ProductForm
          productId={product.id}
          knownCategories={categoryRows.map((c) => c.category)}
          initialValues={{
            title: product.title,
            description: product.description,
            priceNaira: koboToNaira(product.price),
            category: product.category,
            collection: product.collection ?? "",
            stock: product.stock,
            images: product.images,
            memberName: product.memberName,
            memberContact: product.memberContact,
            memberBankName: product.memberBankName ?? "",
            memberAccountNumber: product.memberAccountNumber ?? "",
            memberAccountName: product.memberAccountName ?? "",
            status: product.status,
          }}
        />
      </div>
    </main>
  );
}

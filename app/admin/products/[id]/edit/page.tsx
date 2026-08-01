import { auth } from "@/auth";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { koboToNaira } from "@/lib/money";
import ProductForm from "@/components/ProductForm";

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await auth();
  if (!session?.user) redirect("/admin/login");

  const { id } = await params;
  const product = await prisma.product.findUnique({ where: { id } });
  if (!product) notFound();

  return (
    <main className="min-h-dvh bg-ink px-6 py-16 text-parchment">
      <div className="mx-auto max-w-2xl">
        <Link
          href="/admin/products"
          className="text-xs uppercase tracking-widest text-parchment/60 hover:text-parchment"
        >
          &larr; Products
        </Link>
        <h1 className="mt-2 text-2xl font-bold">Edit product</h1>
        <ProductForm
          productId={product.id}
          initialValues={{
            title: product.title,
            description: product.description,
            priceNaira: koboToNaira(product.price),
            category: product.category,
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

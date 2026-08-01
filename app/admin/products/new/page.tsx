import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import ProductForm from "@/components/ProductForm";

export default async function NewProductPage() {
  const session = await auth();
  if (!session?.user) redirect("/admin/login");

  return (
    <main className="min-h-dvh bg-ink px-6 py-16 text-parchment">
      <div className="mx-auto max-w-2xl">
        <Link
          href="/admin/products"
          className="text-xs uppercase tracking-widest text-parchment/60 hover:text-parchment"
        >
          &larr; Products
        </Link>
        <h1 className="mt-2 text-2xl font-bold">New product</h1>
        <ProductForm />
      </div>
    </main>
  );
}

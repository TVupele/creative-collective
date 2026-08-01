import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { formatNaira } from "@/lib/money";
import AddToCartButton from "@/components/AddToCartButton";

export default async function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = await prisma.product.findUnique({ where: { id } });

  if (!product || product.status !== "ACTIVE") notFound();

  return (
    <main className="min-h-dvh bg-parchment px-6 py-12">
      <div className="mx-auto max-w-4xl">
        <Link href="/shop" className="text-xs uppercase tracking-widest text-ink/50 hover:text-ink">
          &larr; Shop
        </Link>

        <div className="mt-6 grid gap-10 sm:grid-cols-2">
          <div>
            <div className="relative aspect-square overflow-hidden rounded-lg bg-white">
              {product.images[0] ? (
                <Image
                  src={product.images[0]}
                  alt={product.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 100vw, 50vw"
                  priority
                />
              ) : (
                <div className="flex h-full items-center justify-center text-ink/30">
                  No photo
                </div>
              )}
            </div>
            {product.images.length > 1 && (
              <div className="mt-3 grid grid-cols-4 gap-2">
                {product.images.slice(1).map((img) => (
                  <div key={img} className="relative aspect-square overflow-hidden rounded-md bg-white">
                    <Image src={img} alt={product.title} fill className="object-cover" />
                  </div>
                ))}
              </div>
            )}
          </div>

          <div>
            <p className="text-xs uppercase tracking-wide text-ink/50">{product.category}</p>
            <h1 className="mt-1 font-display text-2xl font-bold text-ink">{product.title}</h1>
            <p className="mt-2 text-lg text-ink/80">{formatNaira(product.price)}</p>
            <p className="mt-1 text-sm text-ink/60">by {product.memberName}</p>

            <p className="mt-6 whitespace-pre-line text-ink/80">{product.description}</p>

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

            {product.stock > 0 && product.stock <= 3 && (
              <p className="mt-3 text-sm text-clay">Only {product.stock} left.</p>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}

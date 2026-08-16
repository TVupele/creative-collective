"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { COLLECTIONS } from "@/lib/collections";

export interface ProductFormValues {
  title: string;
  description: string;
  priceNaira: number | "";
  category: string;
  collection: string;
  stock: number | "";
  images: string[];
  memberName: string;
  memberContact: string;
  memberBankName: string;
  memberAccountNumber: string;
  memberAccountName: string;
  status: "DRAFT" | "ACTIVE" | "ARCHIVED";
}

const emptyValues: ProductFormValues = {
  title: "",
  description: "",
  priceNaira: "",
  category: "",
  collection: "",
  stock: 1,
  images: [],
  memberName: "",
  memberContact: "",
  memberBankName: "",
  memberAccountNumber: "",
  memberAccountName: "",
  status: "DRAFT",
};

const CATEGORY_SUGGESTIONS = [
  "Painting",
  "Sculpture",
  "Textiles",
  "Photography",
  "Prints",
  "Jewellery",
  "Apparel",
  "Accessories",
  "Ceramics",
  "Digital Art",
];

export default function ProductForm({
  initialValues,
  productId,
  knownCategories = [],
}: {
  initialValues?: Partial<ProductFormValues>;
  productId?: string;
  knownCategories?: string[];
}) {
  const router = useRouter();
  const [values, setValues] = useState<ProductFormValues>({
    ...emptyValues,
    ...initialValues,
  });
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const update = <K extends keyof ProductFormValues>(key: K, value: ProductFormValues[K]) =>
    setValues((v) => ({ ...v, [key]: value }));

  const categoryOptions = Array.from(
    new Set([...knownCategories, ...CATEGORY_SUGGESTIONS])
  ).sort();

  /** Uploads every selected file, so several photos can be added in one go. */
  const handleImageSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    if (files.length === 0) return;
    setUploading(true);
    setError(null);

    const uploaded: string[] = [];
    try {
      for (const file of files) {
        const formData = new FormData();
        formData.append("file", file);
        const res = await fetch("/api/admin/upload", { method: "POST", body: formData });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || `Upload failed for ${file.name}.`);
        uploaded.push(data.url);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed.");
    } finally {
      // Keep whatever made it through, even if a later file failed.
      if (uploaded.length) {
        setValues((v) => ({ ...v, images: [...v.images, ...uploaded] }));
      }
      setUploading(false);
      e.target.value = "";
    }
  };

  const removeImage = (url: string) =>
    setValues((v) => ({ ...v, images: v.images.filter((i) => i !== url) }));

  const moveImage = (index: number, direction: -1 | 1) =>
    setValues((v) => {
      const next = [...v.images];
      const target = index + direction;
      if (target < 0 || target >= next.length) return v;
      [next[index], next[target]] = [next[target], next[index]];
      return { ...v, images: next };
    });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    const payload = {
      ...values,
      priceNaira: Number(values.priceNaira),
      stock: Number(values.stock),
      collection: values.collection || null,
    };

    try {
      const res = await fetch(
        productId ? `/api/admin/products/${productId}` : "/api/admin/products",
        {
          method: productId ? "PATCH" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Something went wrong.");
      router.push("/admin/products");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!productId) return;
    if (!confirm(`Delete "${values.title}"? This cannot be undone.`)) return;
    setDeleting(true);
    setError(null);
    try {
      const res = await fetch(`/api/admin/products/${productId}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Couldn't delete the product.");
      router.push("/admin/products");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Couldn't delete the product.");
      setDeleting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-8 space-y-6">
      <Section
        title="Item details"
        hint="What the buyer sees on the shop card and product page."
      >
        <div className="space-y-4">
          <Field label="Title" required>
            <input
              required
              value={values.title}
              onChange={(e) => update("title", e.target.value)}
              placeholder="e.g. Bronze Head Study, Ife Series"
              className={inputCls}
            />
          </Field>
          <Field label="Description" required>
            <textarea
              required
              rows={4}
              value={values.description}
              onChange={(e) => update("description", e.target.value)}
              placeholder="Materials, dimensions, the story behind the piece..."
              className={inputCls}
            />
          </Field>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Price (₦)" required>
              <input
                required
                type="number"
                min={1}
                step="0.01"
                value={values.priceNaira}
                onChange={(e) =>
                  update("priceNaira", e.target.value === "" ? "" : Number(e.target.value))
                }
                className={inputCls}
              />
            </Field>
            <Field label="Stock">
              <input
                type="number"
                min={0}
                value={values.stock}
                onChange={(e) =>
                  update("stock", e.target.value === "" ? "" : Number(e.target.value))
                }
                className={inputCls}
              />
            </Field>
          </div>
          <Field label="Category" required hint="Used for the shop's category filter pills.">
            <input
              required
              list="category-options"
              placeholder="e.g. Painting, Textiles, Sculpture"
              value={values.category}
              onChange={(e) => update("category", e.target.value)}
              className={inputCls}
            />
            <datalist id="category-options">
              {categoryOptions.map((c) => (
                <option key={c} value={c} />
              ))}
            </datalist>
          </Field>
        </div>
      </Section>

      <Section
        title="Collection"
        hint="Which shop section this piece belongs to. 'General products' means it only shows in the general list, not behind a collection card."
      >
        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          <CollectionOption
            label="General products"
            description="No collection card"
            active={values.collection === ""}
            onClick={() => update("collection", "")}
          />
          {COLLECTIONS.map((c) => (
            <CollectionOption
              key={c.slug}
              label={c.name}
              description={c.title}
              active={values.collection === c.slug}
              onClick={() => update("collection", c.slug)}
            />
          ))}
        </div>
      </Section>

      <Section
        title="Photos"
        hint="First photo is the cover. Uploads go to Vercel Blob — you can select several at once."
      >
        <div className="flex flex-wrap gap-3">
          {values.images.map((url, index) => (
            <div
              key={url}
              className="group relative h-28 w-28 overflow-hidden rounded-2xl border border-parchment/15"
            >
              <Image src={url} alt="" fill className="object-cover" sizes="112px" />
              {index === 0 && (
                <span className="absolute left-1 top-1 rounded-full bg-amber px-2 py-0.5 text-[0.6rem] font-bold text-ink">
                  Cover
                </span>
              )}
              <button
                type="button"
                onClick={() => removeImage(url)}
                aria-label="Remove photo"
                className="absolute right-1 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-ink/80 text-xs text-parchment transition hover:bg-clay"
              >
                &times;
              </button>
              <div className="absolute inset-x-0 bottom-0 flex justify-between bg-ink/70 opacity-0 transition group-hover:opacity-100">
                <button
                  type="button"
                  onClick={() => moveImage(index, -1)}
                  disabled={index === 0}
                  aria-label="Move photo earlier"
                  className="px-2 py-1 text-xs text-parchment disabled:opacity-30"
                >
                  &larr;
                </button>
                <button
                  type="button"
                  onClick={() => moveImage(index, 1)}
                  disabled={index === values.images.length - 1}
                  aria-label="Move photo later"
                  className="px-2 py-1 text-xs text-parchment disabled:opacity-30"
                >
                  &rarr;
                </button>
              </div>
            </div>
          ))}
          <label className="flex h-28 w-28 cursor-pointer flex-col items-center justify-center gap-1 rounded-2xl border border-dashed border-parchment/30 text-xs text-parchment/60 transition hover:border-amber hover:text-amber">
            {uploading ? "Uploading..." : "+ Add photos"}
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageSelect}
              disabled={uploading}
              className="hidden"
            />
          </label>
        </div>
      </Section>

      <Section
        title="Member (for payout)"
        hint="Not a login — just enough to know who to pay when this sells."
      >
        <div className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Member name" required>
              <input
                required
                value={values.memberName}
                onChange={(e) => update("memberName", e.target.value)}
                className={inputCls}
              />
            </Field>
            <Field label="Contact (phone/email/WhatsApp)" required>
              <input
                required
                value={values.memberContact}
                onChange={(e) => update("memberContact", e.target.value)}
                className={inputCls}
              />
            </Field>
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            <Field label="Bank name">
              <input
                value={values.memberBankName}
                onChange={(e) => update("memberBankName", e.target.value)}
                className={inputCls}
              />
            </Field>
            <Field label="Account number">
              <input
                value={values.memberAccountNumber}
                onChange={(e) => update("memberAccountNumber", e.target.value)}
                className={inputCls}
              />
            </Field>
            <Field label="Account name">
              <input
                value={values.memberAccountName}
                onChange={(e) => update("memberAccountName", e.target.value)}
                className={inputCls}
              />
            </Field>
          </div>
        </div>
      </Section>

      <Section title="Visibility" hint="Only ACTIVE products appear in the shop.">
        <div className="flex flex-wrap gap-2">
          {(["DRAFT", "ACTIVE", "ARCHIVED"] as const).map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => update("status", s)}
              className={`rounded-full px-5 py-2.5 text-sm font-semibold transition ${
                values.status === s
                  ? "bg-amber text-ink shadow-glow"
                  : "border border-parchment/20 text-parchment/70 hover:bg-white/5"
              }`}
            >
              {s === "ACTIVE" ? "Live on shop" : s === "DRAFT" ? "Draft" : "Archived"}
            </button>
          ))}
        </div>
      </Section>

      {error && (
        <p role="alert" className="rounded-2xl bg-clay/15 px-4 py-3 text-sm text-clay">
          {error}
        </p>
      )}

      <div className="flex flex-col gap-3 sm:flex-row">
        <button
          type="submit"
          disabled={submitting || uploading || deleting}
          className="flex-1 rounded-full bg-amber px-8 py-3.5 font-semibold text-ink shadow-glow transition hover:bg-gold disabled:cursor-not-allowed disabled:opacity-60"
        >
          {submitting ? "Saving..." : productId ? "Save changes" : "Create product"}
        </button>
        {productId && (
          <button
            type="button"
            onClick={handleDelete}
            disabled={submitting || deleting}
            className="rounded-full border border-clay/50 px-6 py-3.5 text-sm font-semibold text-clay transition hover:bg-clay/10 disabled:opacity-50"
          >
            {deleting ? "Deleting..." : "Delete"}
          </button>
        )}
      </div>
    </form>
  );
}

function Section({
  title,
  hint,
  children,
}: {
  title: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-3xl border border-parchment/15 bg-white/5 p-5 sm:p-6">
      <h2 className="font-semibold">{title}</h2>
      {hint && <p className="mt-1 text-xs leading-relaxed text-parchment/55">{hint}</p>}
      <div className="mt-4">{children}</div>
    </section>
  );
}

function CollectionOption({
  label,
  description,
  active,
  onClick,
}: {
  label: string;
  description: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`rounded-2xl border p-3 text-left transition ${
        active
          ? "border-amber bg-amber/15"
          : "border-parchment/15 hover:border-parchment/35 hover:bg-white/5"
      }`}
    >
      <span className="block text-sm font-semibold">{label}</span>
      <span className="mt-0.5 block text-[0.7rem] leading-snug text-parchment/50">
        {description}
      </span>
    </button>
  );
}

function Field({
  label,
  required,
  hint,
  children,
}: {
  label: string;
  required?: boolean;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="text-sm font-medium text-parchment/80">
        {label}
        {required && <span className="text-amber"> *</span>}
      </span>
      {hint && <span className="mt-0.5 block text-[0.7rem] text-parchment/45">{hint}</span>}
      <div className="mt-1.5">{children}</div>
    </label>
  );
}

const inputCls =
  "w-full rounded-xl border border-parchment/20 bg-ink/40 px-3.5 py-2.5 text-sm text-parchment outline-none transition placeholder:text-parchment/30 focus:border-amber focus:ring-2 focus:ring-amber/30";

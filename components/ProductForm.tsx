"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

export interface ProductFormValues {
  title: string;
  description: string;
  priceNaira: number | "";
  category: string;
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
  stock: 1,
  images: [],
  memberName: "",
  memberContact: "",
  memberBankName: "",
  memberAccountNumber: "",
  memberAccountName: "",
  status: "DRAFT",
};

export default function ProductForm({
  initialValues,
  productId,
}: {
  initialValues?: Partial<ProductFormValues>;
  productId?: string;
}) {
  const router = useRouter();
  const [values, setValues] = useState<ProductFormValues>({
    ...emptyValues,
    ...initialValues,
  });
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const update = <K extends keyof ProductFormValues>(key: K, value: ProductFormValues[K]) =>
    setValues((v) => ({ ...v, [key]: value }));

  const handleImageSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/admin/upload", { method: "POST", body: formData });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Upload failed.");
      update("images", [...values.images, data.url]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed.");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  const removeImage = (url: string) => {
    update(
      "images",
      values.images.filter((i) => i !== url)
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    const payload = {
      ...values,
      priceNaira: Number(values.priceNaira),
      stock: Number(values.stock),
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

  return (
    <form onSubmit={handleSubmit} className="mt-8 space-y-8">
      <section className="rounded-lg border border-parchment/15 bg-white/5 p-6">
        <h2 className="font-semibold">Item details</h2>
        <div className="mt-4 space-y-4">
          <Field label="Title">
            <input
              required
              value={values.title}
              onChange={(e) => update("title", e.target.value)}
              className={inputCls}
            />
          </Field>
          <Field label="Description">
            <textarea
              required
              rows={4}
              value={values.description}
              onChange={(e) => update("description", e.target.value)}
              className={inputCls}
            />
          </Field>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Price (₦)">
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
          <Field label="Category">
            <input
              required
              placeholder="e.g. Painting, Textile, Sculpture, Photography"
              value={values.category}
              onChange={(e) => update("category", e.target.value)}
              className={inputCls}
            />
          </Field>
        </div>
      </section>

      <section className="rounded-lg border border-parchment/15 bg-white/5 p-6">
        <h2 className="font-semibold">Photos</h2>
        <div className="mt-4 flex flex-wrap gap-3">
          {values.images.map((url) => (
            <div key={url} className="relative h-24 w-24 overflow-hidden rounded-md">
              <Image src={url} alt="" fill className="object-cover" />
              <button
                type="button"
                onClick={() => removeImage(url)}
                className="absolute right-1 top-1 rounded-full bg-ink/80 px-1.5 text-xs text-parchment"
              >
                &times;
              </button>
            </div>
          ))}
          <label className="flex h-24 w-24 cursor-pointer items-center justify-center rounded-md border border-dashed border-parchment/30 text-xs text-parchment/60 hover:border-amber hover:text-amber">
            {uploading ? "Uploading..." : "+ Add photo"}
            <input
              type="file"
              accept="image/*"
              onChange={handleImageSelect}
              disabled={uploading}
              className="hidden"
            />
          </label>
        </div>
      </section>

      <section className="rounded-lg border border-parchment/15 bg-white/5 p-6">
        <h2 className="font-semibold">Member (for payout)</h2>
        <p className="mt-1 text-xs text-parchment/60">
          Not a login — just enough to know who to pay when this sells.
        </p>
        <div className="mt-4 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Field label="Member name">
              <input
                required
                value={values.memberName}
                onChange={(e) => update("memberName", e.target.value)}
                className={inputCls}
              />
            </Field>
            <Field label="Contact (phone/email/WhatsApp)">
              <input
                required
                value={values.memberContact}
                onChange={(e) => update("memberContact", e.target.value)}
                className={inputCls}
              />
            </Field>
          </div>
          <div className="grid grid-cols-3 gap-4">
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
      </section>

      <section className="rounded-lg border border-parchment/15 bg-white/5 p-6">
        <h2 className="font-semibold">Visibility</h2>
        <div className="mt-4 flex gap-3">
          {(["DRAFT", "ACTIVE", "ARCHIVED"] as const).map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => update("status", s)}
              className={`rounded-md px-4 py-2 text-sm font-semibold transition ${
                values.status === s
                  ? "bg-amber text-ink"
                  : "border border-parchment/20 text-parchment/70 hover:bg-white/5"
              }`}
            >
              {s === "ACTIVE" ? "Live on shop" : s === "DRAFT" ? "Draft" : "Archived"}
            </button>
          ))}
        </div>
      </section>

      {error && <p className="rounded-md bg-clay/10 px-4 py-3 text-sm text-clay">{error}</p>}

      <button
        type="submit"
        disabled={submitting || uploading}
        className="w-full rounded-md bg-amber px-8 py-3 font-semibold text-ink shadow-lg transition hover:bg-gold disabled:cursor-not-allowed disabled:opacity-60"
      >
        {submitting ? "Saving..." : productId ? "Save changes" : "Create product"}
      </button>
    </form>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="text-sm font-medium text-parchment/80">{label}</span>
      <div className="mt-1">{children}</div>
    </label>
  );
}

const inputCls =
  "w-full rounded-md border border-parchment/20 bg-white/5 px-3 py-2 text-sm text-parchment outline-none focus:border-amber focus:ring-2 focus:ring-amber/30";

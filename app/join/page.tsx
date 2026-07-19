"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Category,
  DISCIPLINES,
  COLLAB_TYPES,
  Registration,
} from "@/lib/types";

const emptyCommon = {
  fullName: "",
  email: "",
  phone: "",
  city: "",
  country: "",
  discipline: DISCIPLINES[0],
  portfolioLink: "",
  instagram: "",
  bio: "",
};

const emptyCreative = {
  yearsActive: "",
  following: "",
  goal: "",
};

const emptyAlist: {
  stageName: string;
  managementContact: string;
  achievements: string;
  ambassadorInterest: "yes" | "no" | "maybe";
  collabType: string;
} = {
  stageName: "",
  managementContact: "",
  achievements: "",
  ambassadorInterest: "maybe",
  collabType: COLLAB_TYPES[0],
};

export default function JoinPage() {
  const router = useRouter();
  const [category, setCategory] = useState<Category | null>(null);
  const [common, setCommon] = useState(emptyCommon);
  const [creative, setCreative] = useState(emptyCreative);
  const [alist, setAlist] = useState(emptyAlist);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateCommon = (field: keyof typeof emptyCommon, value: string) =>
    setCommon((c) => ({ ...c, [field]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!category) return;
    setSubmitting(true);
    setError(null);

    const payload: Registration =
      category === "creative"
        ? { category, ...common, ...creative }
        : { category, ...common, ...alist };

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Something went wrong.");
      }
      router.push("/?joined=1");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-parchment">
      <div className="relative overflow-hidden bg-ink py-14">
        <div className="absolute inset-0 bg-zebra bg-cover bg-center opacity-80" aria-hidden />
        <div className="absolute inset-0 bg-ink/60" aria-hidden />
        <div className="relative mx-auto max-w-2xl px-6 text-center">
          <Link href="/" className="text-xs uppercase tracking-widest text-parchment/60 hover:text-parchment">
            &larr; Back to Creative Collective
          </Link>
          <h1 className="mt-4 font-display text-3xl font-semibold text-parchment sm:text-4xl">
            Join the Collective
          </h1>
          <p className="mt-3 text-parchment/80">
            Tell us who you are, and we&apos;ll place you in the right lane as Road to
            FESTAC unfolds.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-2xl px-6 py-12">
        {!category ? (
          <div className="grid gap-5 sm:grid-cols-2">
            <button
              onClick={() => setCategory("creative")}
              className="group rounded-xl border border-goldDeep/20 bg-white p-6 text-left shadow-sm transition hover:border-amber hover:shadow-md"
            >
              <span className="text-xs font-semibold uppercase tracking-widest text-clay">
                Category 1
              </span>
              <h2 className="mt-2 font-display text-2xl font-semibold">
                Creative &amp; Entertainer
              </h2>
              <p className="mt-2 text-sm text-ink/70">
                For emerging and working artists, designers, musicians, filmmakers,
                photographers, writers and performers building their practice.
              </p>
              <span className="mt-4 inline-block text-sm font-semibold text-clay group-hover:text-goldDeep">
                Continue &rarr;
              </span>
            </button>

            <button
              onClick={() => setCategory("alist")}
              className="group rounded-xl border border-goldDeep/20 bg-white p-6 text-left shadow-sm transition hover:border-amber hover:shadow-md"
            >
              <span className="text-xs font-semibold uppercase tracking-widest text-navy">
                Category 2
              </span>
              <h2 className="mt-2 font-display text-2xl font-semibold">
                A-List &amp; Veteran
              </h2>
              <p className="mt-2 text-sm text-ink/70">
                For established names and veterans with a recognized body of work,
                management, or a professional track record.
              </p>
              <span className="mt-4 inline-block text-sm font-semibold text-navy group-hover:text-goldDeep">
                Continue &rarr;
              </span>
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-8">
            <button
              type="button"
              onClick={() => setCategory(null)}
              className="text-sm font-semibold text-clay hover:text-goldDeep"
            >
              &larr; Change category
            </button>

            <div className="rounded-xl border border-goldDeep/20 bg-white p-6 shadow-sm">
              <h3 className="font-display text-xl font-semibold">
                {category === "creative" ? "Creative & Entertainer details" : "A-List & Veteran details"}
              </h3>

              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                <Field label="Full name" required>
                  <input
                    required
                    value={common.fullName}
                    onChange={(e) => updateCommon("fullName", e.target.value)}
                    className={inputCls}
                  />
                </Field>
                <Field label="Email" required>
                  <input
                    required
                    type="email"
                    value={common.email}
                    onChange={(e) => updateCommon("email", e.target.value)}
                    className={inputCls}
                  />
                </Field>
                <Field label="Phone" required>
                  <input
                    required
                    type="tel"
                    value={common.phone}
                    onChange={(e) => updateCommon("phone", e.target.value)}
                    className={inputCls}
                  />
                </Field>
                <Field label="Discipline">
                  <select
                    value={common.discipline}
                    onChange={(e) => updateCommon("discipline", e.target.value)}
                    className={inputCls}
                  >
                    {DISCIPLINES.map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>
                </Field>
                <Field label="City">
                  <input
                    value={common.city}
                    onChange={(e) => updateCommon("city", e.target.value)}
                    className={inputCls}
                  />
                </Field>
                <Field label="Country">
                  <input
                    value={common.country}
                    onChange={(e) => updateCommon("country", e.target.value)}
                    className={inputCls}
                  />
                </Field>
                <Field label="Portfolio / work sample link">
                  <input
                    value={common.portfolioLink}
                    onChange={(e) => updateCommon("portfolioLink", e.target.value)}
                    placeholder="https://"
                    className={inputCls}
                  />
                </Field>
                <Field label="Instagram / social handle">
                  <input
                    value={common.instagram}
                    onChange={(e) => updateCommon("instagram", e.target.value)}
                    placeholder="@handle"
                    className={inputCls}
                  />
                </Field>
              </div>

              <div className="mt-4">
                <Field label="Short bio">
                  <textarea
                    value={common.bio}
                    onChange={(e) => updateCommon("bio", e.target.value)}
                    rows={3}
                    className={inputCls}
                  />
                </Field>
              </div>
            </div>

            {category === "creative" ? (
              <div className="rounded-xl border border-goldDeep/20 bg-white p-6 shadow-sm">
                <h3 className="font-display text-xl font-semibold">A bit more about your practice</h3>
                <div className="mt-5 grid gap-4 sm:grid-cols-2">
                  <Field label="Years active">
                    <input
                      value={creative.yearsActive}
                      onChange={(e) => setCreative((c) => ({ ...c, yearsActive: e.target.value }))}
                      className={inputCls}
                    />
                  </Field>
                  <Field label="Social following (optional)">
                    <input
                      value={creative.following}
                      onChange={(e) => setCreative((c) => ({ ...c, following: e.target.value }))}
                      placeholder="e.g. 12,000 Instagram"
                      className={inputCls}
                    />
                  </Field>
                </div>
                <div className="mt-4">
                  <Field label="What are you hoping to gain from Creative Collective?">
                    <textarea
                      value={creative.goal}
                      onChange={(e) => setCreative((c) => ({ ...c, goal: e.target.value }))}
                      rows={3}
                      className={inputCls}
                    />
                  </Field>
                </div>
              </div>
            ) : (
              <div className="rounded-xl border border-goldDeep/20 bg-white p-6 shadow-sm">
                <h3 className="font-display text-xl font-semibold">Professional details</h3>
                <div className="mt-5 grid gap-4 sm:grid-cols-2">
                  <Field label="Stage / professional name">
                    <input
                      value={alist.stageName}
                      onChange={(e) => setAlist((a) => ({ ...a, stageName: e.target.value }))}
                      className={inputCls}
                    />
                  </Field>
                  <Field label="Management / agency contact">
                    <input
                      value={alist.managementContact}
                      onChange={(e) => setAlist((a) => ({ ...a, managementContact: e.target.value }))}
                      className={inputCls}
                    />
                  </Field>
                  <Field label="Interested in a Road to FESTAC ambassador role?">
                    <select
                      value={alist.ambassadorInterest}
                      onChange={(e) =>
                        setAlist((a) => ({ ...a, ambassadorInterest: e.target.value as "yes" | "no" | "maybe" }))
                      }
                      className={inputCls}
                    >
                      <option value="yes">Yes</option>
                      <option value="maybe">Maybe / tell me more</option>
                      <option value="no">No</option>
                    </select>
                  </Field>
                  <Field label="Preferred collaboration type">
                    <select
                      value={alist.collabType}
                      onChange={(e) => setAlist((a) => ({ ...a, collabType: e.target.value }))}
                      className={inputCls}
                    >
                      {COLLAB_TYPES.map((t) => (
                        <option key={t} value={t}>
                          {t}
                        </option>
                      ))}
                    </select>
                  </Field>
                </div>
                <div className="mt-4">
                  <Field label="Notable achievements / awards">
                    <textarea
                      value={alist.achievements}
                      onChange={(e) => setAlist((a) => ({ ...a, achievements: e.target.value }))}
                      rows={3}
                      className={inputCls}
                    />
                  </Field>
                </div>
              </div>
            )}

            {error && (
              <p className="rounded-md bg-clay/10 px-4 py-3 text-sm text-clay">{error}</p>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="w-full rounded-md bg-amber px-8 py-3 font-semibold text-ink shadow-lg transition hover:bg-gold disabled:cursor-not-allowed disabled:opacity-60"
            >
              {submitting ? "Submitting..." : "Join the waiting list"}
            </button>
          </form>
        )}
      </div>
    </main>
  );
}

function Field({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="text-sm font-medium text-ink/80">
        {label}
        {required && <span className="text-clay"> *</span>}
      </span>
      <div className="mt-1">{children}</div>
    </label>
  );
}

const inputCls =
  "w-full rounded-md border border-ink/15 bg-parchment px-3 py-2 text-sm text-ink outline-none focus:border-amber focus:ring-2 focus:ring-amber/30";

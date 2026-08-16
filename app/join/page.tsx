"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Category,
  DISCIPLINES,
  COLLAB_TYPES,
  PARTNER_FOCUS_AREAS,
  PARTNER_SUPPORT_TYPES,
  PARTNER_ORG_TYPES,
  Registration,
} from "@/lib/types";

const emptyCommon = {
  fullName: "",
  email: "",
  phone: "",
  city: "",
  country: "",
  discipline: DISCIPLINES[0] as string,
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

const emptyPartner = {
  organisation: "",
  orgType: PARTNER_ORG_TYPES[0] as string,
  fullName: "",
  role: "",
  email: "",
  phone: "",
  city: "",
  country: "",
  website: "",
  focusAreas: [] as string[],
  supportTypes: [] as string[],
  budgetRange: "",
  projectInterest: "",
  message: "",
};

const BUDGET_RANGES = [
  "Not decided yet",
  "Under ₦1,000,000",
  "₦1,000,000 – ₦5,000,000",
  "₦5,000,000 – ₦20,000,000",
  "₦20,000,000 – ₦50,000,000",
  "Above ₦50,000,000",
  "In-kind support only",
];

export default function JoinPage() {
  const router = useRouter();
  const [category, setCategory] = useState<Category | null>(null);
  const [common, setCommon] = useState(emptyCommon);
  const [creative, setCreative] = useState(emptyCreative);
  const [alist, setAlist] = useState(emptyAlist);
  const [partner, setPartner] = useState(emptyPartner);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateCommon = (field: keyof typeof emptyCommon, value: string) =>
    setCommon((c) => ({ ...c, [field]: value }));

  const updatePartner = <K extends keyof typeof emptyPartner>(
    field: K,
    value: (typeof emptyPartner)[K]
  ) => setPartner((p) => ({ ...p, [field]: value }));

  const toggleInList = (list: string[], value: string) =>
    list.includes(value) ? list.filter((v) => v !== value) : [...list, value];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!category) return;
    setSubmitting(true);
    setError(null);

    const payload: Registration =
      category === "partner"
        ? { category: "partner", ...partner }
        : category === "creative"
          ? { category: "creative", ...common, ...creative }
          : { category: "alist", ...common, ...alist };

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
      router.push(category === "partner" ? "/?partner=1" : "/?joined=1");
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
        <div className="relative mx-auto max-w-3xl px-6 text-center">
          <Link
            href="/"
            className="text-xs uppercase tracking-widest text-parchment/60 hover:text-parchment"
          >
            &larr; Back to Creative Collective
          </Link>
          <h1 className="mt-4 text-3xl font-semibold text-parchment sm:text-4xl">
            Join the Collective
          </h1>
          <p className="mt-3 text-parchment/80">
            Tell us who you are, and we&apos;ll place you in the right lane as Road to
            FESTAC unfolds.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-3xl px-6 py-12">
        {!category ? (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            <ChoiceCard
              kicker="Category 1"
              kickerClass="text-clay"
              title="Creative & Entertainer"
              body="For emerging and working artists, designers, musicians, filmmakers, photographers, writers and performers building their practice."
              onClick={() => setCategory("creative")}
              arrowClass="text-clay group-hover:text-goldDeep"
            />
            <ChoiceCard
              kicker="Category 2"
              kickerClass="text-navy"
              title="A-List & Veteran"
              body="For established names and veterans with a recognized body of work, management, or a professional track record."
              onClick={() => setCategory("alist")}
              arrowClass="text-navy group-hover:text-goldDeep"
            />
            <ChoiceCard
              kicker="Category 3"
              kickerClass="text-goldDeep"
              title="Partner & Supporter"
              body="For brands, foundations, agencies and individuals who want to back specific creative projects — music, arts, film, fashion, festivals and more."
              onClick={() => setCategory("partner")}
              arrowClass="text-goldDeep group-hover:text-clay"
            />
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

            {category === "partner" ? (
              <>
                <Card title="Your organisation">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <Field label="Organisation / brand name" required>
                      <input
                        required
                        value={partner.organisation}
                        onChange={(e) => updatePartner("organisation", e.target.value)}
                        className={inputCls}
                      />
                    </Field>
                    <Field label="Type of organisation">
                      <select
                        value={partner.orgType}
                        onChange={(e) => updatePartner("orgType", e.target.value)}
                        className={inputCls}
                      >
                        {PARTNER_ORG_TYPES.map((t) => (
                          <option key={t} value={t}>
                            {t}
                          </option>
                        ))}
                      </select>
                    </Field>
                    <Field label="Contact person" required>
                      <input
                        required
                        value={partner.fullName}
                        onChange={(e) => updatePartner("fullName", e.target.value)}
                        className={inputCls}
                      />
                    </Field>
                    <Field label="Role / title">
                      <input
                        value={partner.role}
                        onChange={(e) => updatePartner("role", e.target.value)}
                        placeholder="e.g. Head of Partnerships"
                        className={inputCls}
                      />
                    </Field>
                    <Field label="Email" required>
                      <input
                        required
                        type="email"
                        value={partner.email}
                        onChange={(e) => updatePartner("email", e.target.value)}
                        className={inputCls}
                      />
                    </Field>
                    <Field label="Phone" required>
                      <input
                        required
                        type="tel"
                        value={partner.phone}
                        onChange={(e) => updatePartner("phone", e.target.value)}
                        className={inputCls}
                      />
                    </Field>
                    <Field label="City">
                      <input
                        value={partner.city}
                        onChange={(e) => updatePartner("city", e.target.value)}
                        className={inputCls}
                      />
                    </Field>
                    <Field label="Country">
                      <input
                        value={partner.country}
                        onChange={(e) => updatePartner("country", e.target.value)}
                        className={inputCls}
                      />
                    </Field>
                  </div>
                  <div className="mt-4">
                    <Field label="Website">
                      <input
                        value={partner.website}
                        onChange={(e) => updatePartner("website", e.target.value)}
                        placeholder="https://"
                        className={inputCls}
                      />
                    </Field>
                  </div>
                </Card>

                <Card
                  title="What do you want to support?"
                  hint="Pick every area you're interested in backing."
                >
                  <CheckGrid
                    options={PARTNER_FOCUS_AREAS}
                    selected={partner.focusAreas}
                    onToggle={(v) =>
                      updatePartner("focusAreas", toggleInList(partner.focusAreas, v))
                    }
                  />
                </Card>

                <Card
                  title="How would you like to support?"
                  hint="Support doesn't have to be financial."
                >
                  <CheckGrid
                    options={PARTNER_SUPPORT_TYPES}
                    selected={partner.supportTypes}
                    onToggle={(v) =>
                      updatePartner("supportTypes", toggleInList(partner.supportTypes, v))
                    }
                  />

                  <div className="mt-5">
                    <Field label="Scale of support you have in mind">
                      <select
                        value={partner.budgetRange}
                        onChange={(e) => updatePartner("budgetRange", e.target.value)}
                        className={inputCls}
                      >
                        <option value="">Select a range</option>
                        {BUDGET_RANGES.map((b) => (
                          <option key={b} value={b}>
                            {b}
                          </option>
                        ))}
                      </select>
                    </Field>
                  </div>
                </Card>

                <Card title="Tell us more">
                  <div className="space-y-4">
                    <Field label="Specific projects or creatives you'd like to back">
                      <textarea
                        rows={3}
                        value={partner.projectInterest}
                        onChange={(e) => updatePartner("projectInterest", e.target.value)}
                        placeholder="e.g. a music showcase at FESTAC@50, a Benin bronze exhibition, a film fund..."
                        className={inputCls}
                      />
                    </Field>
                    <Field label="Anything else we should know?">
                      <textarea
                        rows={3}
                        value={partner.message}
                        onChange={(e) => updatePartner("message", e.target.value)}
                        className={inputCls}
                      />
                    </Field>
                  </div>
                </Card>
              </>
            ) : (
              <>
                <Card
                  title={
                    category === "creative"
                      ? "Creative & Entertainer details"
                      : "A-List & Veteran details"
                  }
                >
                  <div className="grid gap-4 sm:grid-cols-2">
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
                </Card>

                {category === "creative" ? (
                  <Card title="A bit more about your practice">
                    <div className="grid gap-4 sm:grid-cols-2">
                      <Field label="Years active">
                        <input
                          value={creative.yearsActive}
                          onChange={(e) =>
                            setCreative((c) => ({ ...c, yearsActive: e.target.value }))
                          }
                          className={inputCls}
                        />
                      </Field>
                      <Field label="Social following (optional)">
                        <input
                          value={creative.following}
                          onChange={(e) =>
                            setCreative((c) => ({ ...c, following: e.target.value }))
                          }
                          placeholder="e.g. 12,000 Instagram"
                          className={inputCls}
                        />
                      </Field>
                    </div>
                    <div className="mt-4">
                      <Field label="What are you hoping to gain from Creative Collective?">
                        <textarea
                          value={creative.goal}
                          onChange={(e) =>
                            setCreative((c) => ({ ...c, goal: e.target.value }))
                          }
                          rows={3}
                          className={inputCls}
                        />
                      </Field>
                    </div>
                  </Card>
                ) : (
                  <Card title="Professional details">
                    <div className="grid gap-4 sm:grid-cols-2">
                      <Field label="Stage / professional name">
                        <input
                          value={alist.stageName}
                          onChange={(e) =>
                            setAlist((a) => ({ ...a, stageName: e.target.value }))
                          }
                          className={inputCls}
                        />
                      </Field>
                      <Field label="Management / agency contact">
                        <input
                          value={alist.managementContact}
                          onChange={(e) =>
                            setAlist((a) => ({ ...a, managementContact: e.target.value }))
                          }
                          className={inputCls}
                        />
                      </Field>
                      <Field label="Interested in a Road to FESTAC ambassador role?">
                        <select
                          value={alist.ambassadorInterest}
                          onChange={(e) =>
                            setAlist((a) => ({
                              ...a,
                              ambassadorInterest: e.target.value as "yes" | "no" | "maybe",
                            }))
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
                          onChange={(e) =>
                            setAlist((a) => ({ ...a, collabType: e.target.value }))
                          }
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
                          onChange={(e) =>
                            setAlist((a) => ({ ...a, achievements: e.target.value }))
                          }
                          rows={3}
                          className={inputCls}
                        />
                      </Field>
                    </div>
                  </Card>
                )}
              </>
            )}

            {error && (
              <p role="alert" className="rounded-md bg-clay/10 px-4 py-3 text-sm text-clay">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="w-full rounded-full bg-amber px-8 py-3.5 font-semibold text-ink shadow-lg transition hover:bg-gold disabled:cursor-not-allowed disabled:opacity-60"
            >
              {submitting
                ? "Submitting..."
                : category === "partner"
                  ? "Submit partnership interest"
                  : "Join the waiting list"}
            </button>
          </form>
        )}
      </div>
    </main>
  );
}

function ChoiceCard({
  kicker,
  kickerClass,
  title,
  body,
  onClick,
  arrowClass,
}: {
  kicker: string;
  kickerClass: string;
  title: string;
  body: string;
  onClick: () => void;
  arrowClass: string;
}) {
  return (
    <button
      onClick={onClick}
      className="group flex flex-col rounded-2xl border border-goldDeep/20 bg-white p-6 text-left shadow-sm transition hover:border-amber hover:shadow-md"
    >
      <span className={`text-xs font-semibold uppercase tracking-widest ${kickerClass}`}>
        {kicker}
      </span>
      <h2 className="mt-2 text-2xl font-semibold">{title}</h2>
      <p className="mt-2 flex-1 text-sm text-ink/70">{body}</p>
      <span className={`mt-4 inline-block text-sm font-semibold ${arrowClass}`}>
        Continue &rarr;
      </span>
    </button>
  );
}

function Card({
  title,
  hint,
  children,
}: {
  title: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-goldDeep/20 bg-white p-6 shadow-sm">
      <h3 className="text-xl font-semibold">{title}</h3>
      {hint && <p className="mt-1 text-sm text-ink/55">{hint}</p>}
      <div className="mt-5">{children}</div>
    </div>
  );
}

function CheckGrid({
  options,
  selected,
  onToggle,
}: {
  options: readonly string[];
  selected: string[];
  onToggle: (value: string) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((option) => {
        const active = selected.includes(option);
        return (
          <button
            key={option}
            type="button"
            onClick={() => onToggle(option)}
            aria-pressed={active}
            className={`rounded-full px-4 py-2 text-sm font-medium transition ${
              active
                ? "bg-amber text-ink shadow-sm"
                : "border border-ink/15 text-ink/65 hover:border-ink/35 hover:bg-ink/[0.03]"
            }`}
          >
            {option}
          </button>
        );
      })}
    </div>
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
  "w-full rounded-lg border border-ink/15 bg-parchment px-3 py-2.5 text-sm text-ink outline-none focus:border-amber focus:ring-2 focus:ring-amber/30";

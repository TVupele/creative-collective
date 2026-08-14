"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useState } from "react";

export const SORT_OPTIONS = [
  { value: "newest", label: "Newest first" },
  { value: "price-asc", label: "Price: low to high" },
  { value: "price-desc", label: "Price: high to low" },
  { value: "title", label: "A – Z" },
] as const;

export default function ShopFilters({ categories }: { categories: string[] }) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const [query, setQuery] = useState(params.get("q") ?? "");

  const activeCategory = params.get("category") ?? "";
  const activeView = params.get("view") === "grid" ? "grid" : "timeline";
  const activeSort = params.get("sort") ?? "newest";

  const pushParams = (next: URLSearchParams) => {
    const qs = next.toString();
    router.push(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  };

  const setParam = (key: string, value: string | null) => {
    const next = new URLSearchParams(params.toString());
    if (value) next.set(key, value);
    else next.delete(key);
    pushParams(next);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setParam("q", query.trim() || null);
  };

  const clearSearch = () => {
    setQuery("");
    setParam("q", null);
  };

  const toggleCategory = (category: string) => {
    setParam("category", activeCategory === category ? null : category);
  };

  return (
    <div className="sticky top-[4.4rem] z-30 rounded-4xl border border-ink/[0.07] bg-bone/85 p-3 shadow-soft backdrop-blur-xl sm:p-4">
      <form onSubmit={handleSearch} className="flex items-center gap-2">
        <div className="relative flex-1">
          <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-ink/35">
            <SearchIcon />
          </span>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search pieces, materials or member names..."
            aria-label="Search the shop"
            className="w-full rounded-full border border-ink/10 bg-parchment/60 py-3 pl-11 pr-10 text-sm text-ink outline-none transition placeholder:text-ink/35 focus:border-amber focus:bg-bone focus:ring-4 focus:ring-amber/15"
          />
          {query && (
            <button
              type="button"
              onClick={clearSearch}
              aria-label="Clear search"
              className="absolute right-3 top-1/2 flex h-6 w-6 -translate-y-1/2 items-center justify-center rounded-full text-ink/40 transition hover:bg-ink/10 hover:text-ink"
            >
              &times;
            </button>
          )}
        </div>
        <button type="submit" className="pill-primary flex-shrink-0 px-6 py-3">
          Search
        </button>
      </form>

      <div className="mt-3 flex flex-col gap-3 border-t border-ink/[0.06] pt-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="no-scrollbar -mx-1 flex gap-2 overflow-x-auto px-1 pb-0.5">
          <CategoryPill
            label="All pieces"
            active={!activeCategory}
            onClick={() => setParam("category", null)}
          />
          {categories.map((c) => (
            <CategoryPill
              key={c}
              label={c}
              active={activeCategory === c}
              onClick={() => toggleCategory(c)}
            />
          ))}
        </div>

        <div className="flex flex-shrink-0 items-center gap-2">
          <label className="relative">
            <span className="sr-only">Sort by</span>
            <select
              value={activeSort}
              onChange={(e) =>
                setParam("sort", e.target.value === "newest" ? null : e.target.value)
              }
              className="cursor-pointer appearance-none rounded-full border border-ink/10 bg-parchment/60 py-2.5 pl-4 pr-9 text-xs font-semibold text-ink/70 outline-none transition hover:border-ink/25 focus:border-amber focus:ring-4 focus:ring-amber/15"
            >
              {SORT_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
            <span className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-ink/40">
              <ChevronIcon />
            </span>
          </label>

          <div className="flex items-center gap-1 rounded-full border border-ink/10 bg-parchment/60 p-1">
            <ViewButton
              label="Timeline"
              active={activeView === "timeline"}
              onClick={() => setParam("view", null)}
            >
              <TimelineIcon />
            </ViewButton>
            <ViewButton
              label="Grid"
              active={activeView === "grid"}
              onClick={() => setParam("view", "grid")}
            >
              <GridIcon />
            </ViewButton>
          </div>
        </div>
      </div>
    </div>
  );
}

function CategoryPill({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      aria-pressed={active}
      className={`pill flex-shrink-0 px-4 py-2 text-xs font-semibold uppercase tracking-[0.1em] ${
        active
          ? "bg-ink text-parchment shadow-soft"
          : "border border-ink/10 bg-parchment/60 text-ink/55 hover:border-ink/25 hover:text-ink"
      }`}
    >
      {label}
    </button>
  );
}

function ViewButton({
  label,
  active,
  onClick,
  children,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      aria-pressed={active}
      title={`${label} view`}
      className={`pill px-3 py-1.5 text-xs ${
        active ? "bg-ink text-parchment shadow-soft" : "text-ink/50 hover:text-ink"
      }`}
    >
      {children}
      <span className="hidden sm:inline">{label}</span>
    </button>
  );
}

function SearchIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      className="h-4 w-4"
      aria-hidden
    >
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.2-3.2" />
    </svg>
  );
}

function ChevronIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-3.5 w-3.5"
      aria-hidden
    >
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}

function TimelineIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.9}
      strokeLinecap="round"
      className="h-3.5 w-3.5"
      aria-hidden
    >
      <path d="M5 4v16" />
      <circle cx="5" cy="8" r="1.6" />
      <circle cx="5" cy="16" r="1.6" />
      <path d="M10 8h9M10 16h6" />
    </svg>
  );
}

function GridIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.9}
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-3.5 w-3.5"
      aria-hidden
    >
      <rect x="3.5" y="3.5" width="7" height="7" rx="2" />
      <rect x="13.5" y="3.5" width="7" height="7" rx="2" />
      <rect x="3.5" y="13.5" width="7" height="7" rx="2" />
      <rect x="13.5" y="13.5" width="7" height="7" rx="2" />
    </svg>
  );
}

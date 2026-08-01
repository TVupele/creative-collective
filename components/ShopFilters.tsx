"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useState } from "react";

export default function ShopFilters({ categories }: { categories: string[] }) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const [query, setQuery] = useState(params.get("q") ?? "");

  const activeCategory = params.get("category") ?? "";

  const pushParams = (next: URLSearchParams) => {
    const qs = next.toString();
    router.push(qs ? `${pathname}?${qs}` : pathname);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const next = new URLSearchParams(params.toString());
    if (query) next.set("q", query);
    else next.delete("q");
    pushParams(next);
  };

  const toggleCategory = (category: string) => {
    const next = new URLSearchParams(params.toString());
    if (activeCategory === category) next.delete("category");
    else next.set("category", category);
    pushParams(next);
  };

  return (
    <div className="space-y-4">
      <form onSubmit={handleSearch} className="flex gap-2">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search items or member names..."
          className="w-full rounded-md border border-ink/15 bg-white px-4 py-2.5 text-sm text-ink outline-none focus:border-amber focus:ring-2 focus:ring-amber/30"
        />
        <button
          type="submit"
          className="flex-shrink-0 rounded-md bg-ink px-5 py-2.5 text-sm font-semibold text-parchment transition hover:bg-ink/80"
        >
          Search
        </button>
      </form>

      {categories.length > 0 && (
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => pushParams(new URLSearchParams())}
            className={`rounded-full px-4 py-1.5 text-xs font-semibold uppercase tracking-wide transition ${
              !activeCategory
                ? "bg-amber text-ink"
                : "border border-ink/15 text-ink/60 hover:bg-ink/5"
            }`}
          >
            All
          </button>
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => toggleCategory(c)}
              className={`rounded-full px-4 py-1.5 text-xs font-semibold uppercase tracking-wide transition ${
                activeCategory === c
                  ? "bg-amber text-ink"
                  : "border border-ink/15 text-ink/60 hover:bg-ink/5"
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

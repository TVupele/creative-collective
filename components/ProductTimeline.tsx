import ProductCard, { type ShopProduct } from "@/components/ProductCard";

export type TimelineProduct = ShopProduct & { createdAt: Date };

interface TimelineGroup {
  key: string;
  label: string;
  items: TimelineProduct[];
}

/** Groups products into "drops" by the month they were listed, newest first.
 *  The incoming list is already sorted, so first-seen order defines the
 *  order of the groups and the order inside each group. */
function groupByMonth(products: TimelineProduct[]): TimelineGroup[] {
  const groups = new Map<string, TimelineGroup>();

  for (const product of products) {
    const date = new Date(product.createdAt);
    const key = `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, "0")}`;

    let group = groups.get(key);
    if (!group) {
      group = {
        key,
        label: date.toLocaleDateString("en-GB", {
          month: "long",
          year: "numeric",
          timeZone: "UTC",
        }),
        items: [],
      };
      groups.set(key, group);
    }
    group.items.push(product);
  }

  return [...groups.values()];
}

export default function ProductTimeline({ products }: { products: TimelineProduct[] }) {
  const groups = groupByMonth(products);

  return (
    <div className="relative mt-10">
      {/* The spine. Sits behind every marker and fades out at both ends. */}
      <div
        className="absolute bottom-4 left-[7px] top-4 w-px bg-gradient-to-b from-transparent via-ink/15 to-transparent"
        aria-hidden
      />

      <ol className="space-y-16">
        {groups.map((group, groupIndex) => (
          <li key={group.key} className="relative pl-10 sm:pl-16">
            {/* Marker, centred on the spine */}
            <span
              className="absolute left-0 top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-parchment"
              aria-hidden
            >
              <span
                className={`h-2.5 w-2.5 rounded-full ring-4 ${
                  groupIndex === 0
                    ? "bg-amber ring-amber/20"
                    : "bg-ink/25 ring-ink/[0.06]"
                }`}
              />
            </span>

            <header className="flex flex-wrap items-center gap-x-3 gap-y-2">
              <h2 className="font-display text-xl font-bold tracking-tight text-ink sm:text-2xl">
                {group.label}
              </h2>
              <span className="pill-tag">
                {group.items.length} {group.items.length === 1 ? "piece" : "pieces"}
              </span>
              {groupIndex === 0 && (
                <span className="pill bg-amber/15 px-3 py-1 text-[0.65rem] font-bold uppercase tracking-[0.14em] text-goldDeep">
                  Latest drop
                </span>
              )}
            </header>

            <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {group.items.map((product, index) => (
                <div
                  key={product.id}
                  className="animate-fade-up"
                  style={{ animationDelay: `${Math.min(index, 5) * 60}ms` }}
                >
                  <ProductCard
                    product={product}
                    priority={groupIndex === 0 && index < 3}
                  />
                </div>
              ))}
            </div>
          </li>
        ))}

        {/* Closing marker — the start of the collection */}
        <li className="relative pl-10 sm:pl-16">
          <span
            className="absolute left-0 top-1 flex h-4 w-4 items-center justify-center rounded-full bg-parchment"
            aria-hidden
          >
            <span className="h-2 w-2 rounded-full border border-ink/25" />
          </span>
          <p className="text-sm text-ink/45">
            The beginning of the collection — more pieces are added every week.
          </p>
        </li>
      </ol>
    </div>
  );
}

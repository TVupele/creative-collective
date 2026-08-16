export default function ShopSkeleton() {
  return (
    <div className="animate-fade-in">
      <div className="h-[7.5rem] rounded-4xl border border-ink/[0.07] bg-bone/70 shadow-soft" />
      <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="rounded-4xl border border-ink/[0.07] bg-bone p-2 shadow-soft">
            <div className="aspect-[4/5] animate-pulse rounded-[1.35rem] bg-sand" />
            <div className="space-y-2 px-3 pb-3 pt-4">
              <div className="h-4 w-3/4 animate-pulse rounded-full bg-sand" />
              <div className="h-3 w-1/2 animate-pulse rounded-full bg-sand" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

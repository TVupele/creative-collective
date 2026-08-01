import { auth, signOut } from "@/auth";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function AdminDashboardPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/admin/login");
  }

  return (
    <main className="min-h-dvh bg-ink px-6 py-16 text-parchment">
      <div className="mx-auto max-w-2xl">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-widest text-parchment/60">
              Admin dashboard
            </p>
            <h1 className="mt-1 text-2xl font-bold">Welcome, {session.user.name}</h1>
          </div>

          <form
            action={async () => {
              "use server";
              await signOut({ redirectTo: "/" });
            }}
          >
            <button
              type="submit"
              className="rounded-md border border-parchment/20 px-4 py-2 text-sm text-parchment/80 transition hover:bg-white/5"
            >
              Sign out
            </button>
          </form>
        </div>

        <Link
          href="/admin/products"
          className="mt-10 block rounded-lg border border-parchment/15 bg-white/5 p-6 transition hover:border-amber/40"
        >
          <p className="font-semibold">Products &rarr;</p>
          <p className="mt-2 text-sm text-parchment/70">
            Upload items from members, with their contact and bank details for payout.
          </p>
        </Link>

        <div className="mt-6 rounded-lg border border-parchment/15 bg-white/5 p-6">
          <p className="font-semibold">Orders &amp; payouts</p>
          <p className="mt-2 text-sm text-parchment/70">
            Once checkout is live, orders will show here with each member&apos;s owed
            payout, so you can track what&apos;s been paid out and what&apos;s still
            pending.
          </p>
        </div>
      </div>
    </main>
  );
}

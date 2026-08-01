"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import Link from "next/link";

export default function AdminLoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    setSubmitting(false);

    if (result?.error) {
      setError("Incorrect email or password.");
      return;
    }

    router.push("/admin/dashboard");
    router.refresh();
  };

  return (
    <main className="min-h-dvh bg-ink px-6 py-16 text-parchment">
      <div className="mx-auto max-w-sm">
        <Link href="/" className="text-xs uppercase tracking-widest text-parchment/60 hover:text-parchment">
          &larr; Back to Creative Collective
        </Link>

        <h1 className="mt-6 text-2xl font-bold">Admin login</h1>

        <form onSubmit={handleSubmit} className="mt-8 space-y-4">
          <label className="block">
            <span className="text-sm font-medium text-parchment/80">Email</span>
            <input
              required
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={inputCls}
            />
          </label>
          <label className="block">
            <span className="text-sm font-medium text-parchment/80">Password</span>
            <input
              required
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={inputCls}
            />
          </label>

          {error && (
            <p className="rounded-md bg-clay/10 px-4 py-3 text-sm text-clay">{error}</p>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-md bg-amber px-8 py-3 font-semibold text-ink shadow-lg transition hover:bg-gold disabled:cursor-not-allowed disabled:opacity-60"
          >
            {submitting ? "Logging in..." : "Log in"}
          </button>
        </form>
      </div>
    </main>
  );
}

const inputCls =
  "w-full rounded-md border border-parchment/20 bg-white/5 px-3 py-2 text-sm text-parchment outline-none focus:border-amber focus:ring-2 focus:ring-amber/30";

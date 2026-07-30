import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Sign in",
  description: "Sign in to InterviewHub to save progress and bookmarks.",
};

export default function LoginPage() {
  return (
    <div className="mx-auto flex min-h-[70vh] max-w-md flex-col justify-center px-4 py-16">
      <h1 className="text-2xl font-bold tracking-tight text-navy">Sign in</h1>
      <p className="mt-2 text-sm text-muted">
        Student accounts (bookmarks, history) ship in a later phase. Content admins can use the
        CMS now.
      </p>
      <form className="mt-8 space-y-4 rounded-2xl border border-border bg-white p-6 shadow-sm">
        <label className="block text-sm">
          <span className="mb-1 block font-medium text-ink">Email</span>
          <input
            type="email"
            placeholder="you@email.com"
            className="w-full rounded-lg border border-border px-3 py-2 outline-none focus:border-primary"
          />
        </label>
        <label className="block text-sm">
          <span className="mb-1 block font-medium text-ink">Password</span>
          <input
            type="password"
            placeholder="••••••••"
            className="w-full rounded-lg border border-border px-3 py-2 outline-none focus:border-primary"
          />
        </label>
        <button
          type="button"
          className="w-full rounded-lg bg-primary py-2.5 text-sm font-semibold text-white hover:bg-primary-dark"
        >
          Sign in
        </button>
        <p className="text-center text-xs text-muted">Auth API not connected yet.</p>
      </form>
      <p className="mt-4 text-center text-sm text-muted">
        No account?{" "}
        <Link href="/signup" className="font-semibold text-primary hover:underline">
          Sign up
        </Link>
      </p>
      <p className="mt-2 text-center text-sm text-muted">
        Site admin?{" "}
        <Link href="/admin/login" className="font-semibold text-primary hover:underline">
          Admin login
        </Link>
      </p>
    </div>
  );
}

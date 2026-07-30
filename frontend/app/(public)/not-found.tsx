import Link from "next/link";

export default function NotFound() {
  return (
    <main className="mx-auto flex max-w-6xl flex-1 flex-col items-center justify-center px-4 py-24 text-center">
      <h1 className="text-3xl font-bold text-navy">Page not found</h1>
      <p className="mt-3 max-w-md text-muted">
        That page does not exist yet. Head back home or browse languages.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link
          href="/"
          className="inline-flex h-11 items-center rounded-xl bg-primary px-5 text-sm font-semibold text-white hover:bg-primary-dark"
        >
          Home
        </Link>
        <Link
          href="/languages"
          className="inline-flex h-11 items-center rounded-xl border border-border bg-surface px-5 text-sm font-semibold text-navy hover:border-primary hover:text-primary"
        >
          Languages
        </Link>
      </div>
    </main>
  );
}
